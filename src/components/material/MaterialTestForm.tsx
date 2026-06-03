import React, { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { SearchableSelect } from '../ui/SearchableSelect';
import { MaterialTestData, MaterialTestFile } from '../../data/materialTestData';

interface MaterialTestFormProps {
  data: MaterialTestData;
  onChange: (data: MaterialTestData) => void;
}

export function MaterialTestForm({ data, onChange }: MaterialTestFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 限制最多上传 10 个文件
    const remainingSlots = 10 - data.testReportFiles.length;
    if (remainingSlots <= 0) {
      alert('Maximum 10 files allowed');
      return;
    }

    const filesToAdd: MaterialTestFile[] = [];
    const fileArray = Array.from(files).slice(0, remainingSlots);

    fileArray.forEach((file) => {
      filesToAdd.push({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file),
      });
    });

    onChange({
      ...data,
      testReportFiles: [...data.testReportFiles, ...filesToAdd],
    });

    // 清空 input value 以便选择同名文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = data.testReportFiles.filter((_, i) => i !== index);
    onChange({
      ...data,
      testReportFiles: newFiles,
    });
  };

  return (
    <div className="space-y-6">
      {/* 第 1 点：上传文件 */}
      <div>
        <h4 className="text-sm font-semibold text-[#334155] mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#475569] rounded-full"></span>
          Fabric Test Report
        </h4>
        <p className="text-xs text-[#64748b] mb-3 pl-4">
          Enable supplier or internal user to upload the fabric test report (all file types supported, max 10 files)
        </p>

        <div className="pl-4 space-y-3">
          {/* 上传区域 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#cbd5e1] rounded-lg p-6 text-center cursor-pointer hover:border-[#475569] hover:bg-[#f8fafc] transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-[#94a3b8]" />
            <p className="text-sm text-[#64748b]">
              <span className="font-medium text-[#475569]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-[#94a3b8] mt-1">All file types supported</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* 文件列表 */}
          {data.testReportFiles.length > 0 && (
            <div className="space-y-2">
              {data.testReportFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg"
                >
                  <FileText className="w-4 h-4 text-[#475569] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#334155] truncate">{file.name}</p>
                    <p className="text-xs text-[#94a3b8]">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-[#94a3b8] hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 第 2 点：Material Test Status */}
      <div>
        <h4 className="text-sm font-semibold text-[#334155] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#475569] rounded-full"></span>
          Material Test Status
        </h4>
        <div className="pl-4">
          <SearchableSelect
            label=""
            value={data.testStatus}
            options={['Pass', 'Conditional Tolerance', 'Fail']}
            onChange={(value) => onChange({ ...data, testStatus: value })}
            placeholder="Select test result..."
          />
        </div>
      </div>
    </div>
  );
}
