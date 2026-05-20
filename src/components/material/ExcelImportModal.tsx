import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../ui/Button';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface PreviewData {
  data: any[];
  errors: ValidationError[];
  validCount: number;
}

const REQUIRED_FIELDS = [
  'Material Top Category',
  'Material Sub Category',
  'Fiber Contents',
  'Finished Weight (GSM)',
  'Material Width (inch)'
];

const FIELD_MAPPINGS: Record<string, string> = {
  'Material Top Category': 'materialTopCategory',
  'Material Sub Category': 'materialSubCategory',
  'Fiber Contents': 'fiberContents',
  'Branded Fiber': 'brandedFiber',
  'Finished Weight (GSM)': 'finishedWeight',
  'Material Finishes': 'materialFinishes',
  'Fabric Density': 'fabricDensity',
  'Material Width (inch)': 'materialWidth',
  'Cuttable Width (inch)': 'cuttableWidth',
  'Impression Intents': 'impressionIntents',
  'Comments': 'comments',
  'Material Function': 'materialFunction',
  'Sustainable': 'sustainable',
  'Care Recommendations': 'careRecommendations',
  'Material Supplier Name': 'supplierName',
  'Material Code (mill code)': 'materialCode',
  'Oi Code (Customer Code)': 'oiCode',
  'Country of Production': 'countryOfProduction',
  'Weaving/Knitting Factory': 'weavingFactory',
  'Dyeing Factory': 'dyeingFactory',
  'Printing Factory': 'printingFactory',
  'Finishing Factory': 'finishingFactory'
};

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcel(selectedFile);
    }
  };

  const parseExcel = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          setPreview({
            data: [],
            errors: [{ row: 0, field: 'File', message: 'Excel file is empty or has no data rows' }],
            validCount: 0
          });
          setIsLoading(false);
          return;
        }

        const headers = (jsonData[0] as string[]).map(h => h?.toString().trim());
        const rows = jsonData.slice(1) as any[];
        
        const errors: ValidationError[] = [];
        const validData: any[] = [];

        // Check required fields
        const missingFields = REQUIRED_FIELDS.filter(field => !headers.includes(field));
        if (missingFields.length > 0) {
          errors.push({
            row: 0,
            field: 'Headers',
            message: `Missing required fields: ${missingFields.join(', ')}`
          });
        }

        rows.forEach((row, index) => {
          const rowData: any = {};
          const rowNum = index + 2;

          headers.forEach((header, colIndex) => {
            const fieldName = FIELD_MAPPINGS[header];
            if (fieldName) {
              rowData[fieldName] = row[colIndex]?.toString().trim() || '';
            }
          });

          // Validate required fields
          REQUIRED_FIELDS.forEach(field => {
            const fieldName = FIELD_MAPPINGS[field];
            if (!rowData[fieldName]) {
              errors.push({
                row: rowNum,
                field: field,
                message: `${field} is required`
              });
            }
          });

          // Validate numeric fields
          if (rowData.finishedWeight && isNaN(Number(rowData.finishedWeight))) {
            errors.push({
              row: rowNum,
              field: 'Finished Weight (GSM)',
              message: 'Must be a number'
            });
          }

          if (rowData.materialWidth && isNaN(Number(rowData.materialWidth))) {
            errors.push({
              row: rowNum,
              field: 'Material Width (inch)',
              message: 'Must be a number'
            });
          }

          if (errors.filter(e => e.row === rowNum).length === 0) {
            validData.push(rowData);
          }
        });

        setPreview({
          data: validData,
          errors,
          validCount: validData.length
        });
      } catch (error) {
        setPreview({
          data: [],
          errors: [{ row: 0, field: 'File', message: 'Failed to parse Excel file' }],
          validCount: 0
        });
      }
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (preview && preview.validCount > 0) {
      onImport(preview.data);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setIsLoading(false);
    onClose();
  };

  const downloadTemplate = () => {
    const templateData = [
      Object.keys(FIELD_MAPPINGS),
      [
        'Woven',
        'Poplin',
        'Cotton',
        'BCI',
        '150',
        'Peach, Brushed',
        'Warp pick per inch',
        '58',
        '56',
        'Solid',
        'High quality cotton poplin',
        'Apparel',
        'Yes',
        'Machine wash cold',
        'ABC Textile Co., Ltd.',
        'ABC-001',
        'OI-2024-001',
        'China',
        'ABC Weaving Mill',
        'XYZ Dyeing Factory',
        '',
        'ABC Finishing'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Material Template');
    XLSX.writeFile(wb, 'Material_Import_Template.xlsx');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#334155] to-[#64748b] rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Import Materials from Excel</h2>
              <p className="text-sm text-gray-500">Upload Excel file to batch import materials</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!file ? (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#334155] hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload or drag and drop
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Excel files (.xlsx, .xls) up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Template Download */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Download Template</h4>
                    <p className="text-sm text-gray-500">
                      Get the Excel template with all required fields
                    </p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    Download Template
                  </Button>
                </div>
              </div>

              {/* Required Fields */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Required Fields</h4>
                <div className="flex flex-wrap gap-2">
                  {REQUIRED_FIELDS.map(field => (
                    <span
                      key={field}
                      className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-[#334155] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Parsing Excel file...</p>
                </div>
              ) : preview ? (
                <>
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-700">{preview.validCount}</p>
                      <p className="text-sm text-green-600">Valid Records</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-700">{preview.errors.length}</p>
                      <p className="text-sm text-red-600">Errors</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <FileSpreadsheet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-700">{preview.data.length + preview.errors.length}</p>
                      <p className="text-sm text-blue-600">Total Rows</p>
                    </div>
                  </div>

                  {/* Errors */}
                  {preview.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Validation Errors
                      </h4>
                      <div className="max-h-48 overflow-auto space-y-2">
                        {preview.errors.map((error, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm text-red-700 bg-white p-2 rounded"
                          >
                            <span className="px-2 py-0.5 bg-red-100 rounded text-xs font-medium">
                              Row {error.row}
                            </span>
                            <span className="font-medium">{error.field}:</span>
                            <span>{error.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview Table */}
                  {preview.data.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Preview (First 5 records)</h4>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">Material</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">Fiber</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">Weight</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">Width</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {preview.data.slice(0, 5).map((row, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2">{row.materialSubCategory}</td>
                                <td className="px-4 py-2">{row.materialTopCategory}</td>
                                <td className="px-4 py-2">{row.fiberContents}</td>
                                <td className="px-4 py-2">{row.finishedWeight} GSM</td>
                                <td className="px-4 py-2">{row.materialWidth}"</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {preview && preview.validCount > 0 && (
            <Button onClick={handleImport}>
              Import {preview.validCount} Materials
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
