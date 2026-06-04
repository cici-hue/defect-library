import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MaterialSpecificationForm, MaterialSpecificationData } from '../components/material/MaterialSpecificationForm';
import { SupplyChainForm, SupplyChainData } from '../components/material/SupplyChainForm';
import { useApp } from '../context/AppContext';
import { Material } from '../types';
import { stockStatusOptions, statusOptions } from '../data/mockData';
import { defaultMaterialSpecification } from '../data/materialSpecificationData';
import { defaultSupplyChainData } from '../data/supplyChainData';
import { CostLeadTimeForm } from '../components/material/CostLeadTimeForm';
import { CostLeadTimeData, defaultCostLeadTimeData } from '../data/costLeadTimeData';
import { MaterialTestForm } from '../components/material/MaterialTestForm';
import { MaterialTestData, defaultMaterialTestData } from '../data/materialTestData';
import {
  Save,
  X,
  Trash2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// 模块配置
const MODULES = [
  { id: 'specification', title: '1. Material Specification', description: 'Material Category and parameter specification' },
  { id: 'supplyChain', title: '2. Supply Chain', description: 'Material Supplier and production locations' },
  { id: 'costLeadtime', title: '3. Cost and Lead-time', description: 'Material Cost, MOQ, MCQ, production lead-time' },
  { id: 'materialTest', title: '4. Material Test', description: 'Enable supplier to attach the test report' },
];

export function CreateMaterial() {
  const navigate = useNavigate();
  const { addMaterial, suppliers } = useApp();

  // Expanded module state
  const [expandedModules, setExpandedModules] = useState<string[]>(['specification']);

  // Material Specification 数据
  const [specificationData, setSpecificationData] = useState<MaterialSpecificationData>(defaultMaterialSpecification);

  // Supply Chain 数据
  const [supplyChainData, setSupplyChainData] = useState<SupplyChainData>(defaultSupplyChainData);

  // Cost and Lead-time 数据
  const [costLeadTimeData, setCostLeadTimeData] = useState<CostLeadTimeData>(defaultCostLeadTimeData);

  // Material Test 数据
  const [materialTestData, setMaterialTestData] = useState<MaterialTestData>(defaultMaterialTestData);

  // 图片上传
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // 验证错误
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 切换模块展开/折叠
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Expand all modules
  const expandAll = () => {
    setExpandedModules(MODULES.map(m => m.id));
  };

  // Collapse all modules
  const collapseAll = () => {
    setExpandedModules([]);
  };

  // 处理图片上传
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newUrls = Array.from(files).slice(0, 5 - imageUrls.length).map((file, i) => {
      return `https://picsum.photos/seed/${Date.now() + i}/400/400`;
    });

    setImageUrls(prev => [...prev, ...newUrls]);
  };

  // 移除图片
  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证 Material Specification 必填字段
    if (!specificationData.materialTopCategory) {
      newErrors.materialTopCategory = 'Material Top Category is required';
    }
    if (!specificationData.materialSubCategory) {
      newErrors.materialSubCategory = 'Material Sub Category is required';
    }
    if (!specificationData.fiberContents) {
      newErrors.fiberContents = 'Fiber Contents is required';
    }
    if (!specificationData.finishedWeight) {
      newErrors.finishedWeight = 'Finished Weight is required';
    }
    if (!specificationData.materialWidth) {
      newErrors.materialWidth = 'Material Width is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // If there are errors, expand the first module with errors
      setExpandedModules(prev => [...new Set([...prev, 'specification'])]);
      return;
    }

    // 构建 material 数据
    const newMaterial: Omit<Material, 'id' | 'createdAt' | 'updatedAt'> = {
      code: `MAT-${Date.now().toString(36).toUpperCase().slice(-8)}`,
      name: `${specificationData.materialTopCategory} - ${specificationData.materialSubCategory}`,
      materialType: specificationData.materialTopCategory,
      materialTopCategory: specificationData.materialTopCategory,
      materialSubCategory: specificationData.materialSubCategory,
      fiberContents: specificationData.fiberContents.map(f => f.content).filter(Boolean).join(', '),
      brandedFiber: specificationData.brandedFibers.filter(Boolean).join(', '),
      finishedWeight: Number(specificationData.finishedWeight) || 0,
      materialWidth: Number(specificationData.materialWidth) || 0,
      supplier: supplyChainData.materialSupplierName,
      supplierId: supplyChainData.materialCode,
      origin: supplyChainData.countryOfProduction,
      weight: Number(specificationData.finishedWeight) || 0,
      width: Number(specificationData.materialWidth) || 0,
      composition: specificationData.fiberContents.map(f => `${f.percentage}% ${f.content}`).filter(f => f.includes('%')).join(', '),
      fabricDensity: specificationData.fabricDensity.map(d => `${d.density} ${d.number} ${d.gauge ? d.gauge + 'GG' : ''}`).filter(Boolean).join(', '),
      color: '',
      yarnSpec: '',
      price: 0,
      minOrder: 0,
      leadTime: 0,
      stockStatus: 'in_stock',
      status: 'pending',
      images: imageUrls,
      documents: [],
      remarks: specificationData.comments,
      createdBy: 'Admin',
    };

    addMaterial(newMaterial);
    navigate('/library');
  };

  // 清空表单
  const handleClear = () => {
    setSpecificationData(defaultMaterialSpecification);
    setSupplyChainData(defaultSupplyChainData);
    setImageUrls([]);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header
        title="Create Material"
        subtitle="v1.0"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClear}>
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        }
      />

      <div className="p-6 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 模块折叠控制 */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={expandAll}
              className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium"
            >
              Expand All
            </button>
            <span className="text-[#cbd5e1]">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium"
            >
              Collapse All
            </button>
          </div>

          {/* Module 1: Material Specification */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleModule('specification')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#334155] to-[#64748b] text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Material Specification</h3>
                  <p className="text-sm text-white/70">Material Category and parameter specification</p>
                </div>
              </div>
              {expandedModules.includes('specification') ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {expandedModules.includes('specification') && (
              <div className="p-6">
                <MaterialSpecificationForm
                  data={specificationData}
                  onChange={setSpecificationData}
                />
              </div>
            )}
          </div>

          {/* Module 2: Supply Chain */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleModule('supplyChain')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#334155] to-[#64748b] text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Supply Chain</h3>
                  <p className="text-sm text-white/70">Material Supplier and production locations</p>
                </div>
              </div>
              {expandedModules.includes('supplyChain') ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {expandedModules.includes('supplyChain') && (
              <div className="p-6">
                <SupplyChainForm
                  data={supplyChainData}
                  onChange={setSupplyChainData}
                />
              </div>
            )}
          </div>

          {/* Module 3: Cost and Lead-time (Placeholder) */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleModule('costLeadtime')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#334155] to-[#64748b] text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Cost and Lead-time</h3>
                  <p className="text-sm text-white/70">Material Cost, MOQ, MCQ, production lead-time</p>
                </div>
              </div>
              {expandedModules.includes('costLeadtime') ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {expandedModules.includes('costLeadtime') && (
              <div className="p-6">
                <CostLeadTimeForm
                  data={costLeadTimeData}
                  onChange={setCostLeadTimeData}
                  cuttableWidth={specificationData.cuttableWidth}
                />
              </div>
            )}
          </div>

          {/* Module 4: Material Test (Placeholder) */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => toggleModule('materialTest')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#334155] to-[#64748b] text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Material Test</h3>
                  <p className="text-sm text-white/70">Enable supplier to attach the test report</p>
                </div>
              </div>
              {expandedModules.includes('materialTest') ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {expandedModules.includes('materialTest') && (
              <div className="p-6">
                <MaterialTestForm
                  data={materialTestData}
                  onChange={setMaterialTestData}
                />
              </div>
            )}
          </div>

          {/* Material Images */}
          <Card title="Material Images">
            <div className="space-y-4">
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-[#f0f4f8] rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#ef4444] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imageUrls.length < 5 && (
                <label className="block border-2 border-dashed border-[#e2e8f0] rounded-lg p-8 text-center cursor-pointer hover:border-[#3b82f6] hover:bg-[#f0f4f8]/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  <ImageIcon className="w-10 h-10 text-[#94a3b8] mx-auto mb-3" />
                  <p className="text-sm text-[#64748b]">
                    <span className="text-[#3b82f6] font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    PNG, JPG up to 10MB (max {5 - imageUrls.length} more)
                  </p>
                </label>
              )}
            </div>
          </Card>

          {/* 底部操作按钮 */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClear}>
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4" />
              Save Material
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
