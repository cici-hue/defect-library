import React, { useState, useEffect } from 'react';
import { SearchableSelect } from '../ui/SearchableSelect';
import { MultiSelect } from '../ui/MultiSelect';
import { NumberInput } from '../ui/NumberInput';
import { TextInput } from '../ui/TextInput';
import { Plus, X } from 'lucide-react';
import {
  materialTopCategories,
  materialSubCategories,
  fiberContents,
  brandedFibers,
  materialFinishes,
  fabricDensities,
  impressionIntents,
  materialFunctions,
  sustainableOptions,
  customerOptions,
} from '../../data/materialSpecificationData';

export interface FiberContentItem {
  percentage: string;
  content: string;
}

export interface FabricDensityItem {
  density: string;
  number: string;
  gauge: string;
}

export interface MaterialSpecificationData {
  materialTopCategory: string;
  materialSubCategory: string;
  fiberContents: FiberContentItem[];
  brandedFibers: string[];
  finishedWeight: string;
  materialFinishes: string[];
  fabricDensity: FabricDensityItem[];
  materialWidth: string;
  cuttableWidth: string;
  impressionIntents: string[];
  comments: string;
  materialFunction: string;
  sustainable: string;
  careRecommendations: string;
  customers: string[];
}

interface MaterialSpecificationFormProps {
  data: MaterialSpecificationData;
  onChange: (data: MaterialSpecificationData) => void;
}

export function MaterialSpecificationForm({ data, onChange }: MaterialSpecificationFormProps) {
  const [percentageError, setPercentageError] = useState<string>('');

  // 调试：log data changes
  useEffect(() => {
    console.log('Fiber contents updated:', JSON.stringify(data.fiberContents));
  }, [JSON.stringify(data.fiberContents)]);

  const handleChange = <K extends keyof MaterialSpecificationData>(
    field: K,
    value: MaterialSpecificationData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const validatePercentage = (items: FiberContentItem[]) => {
    const total = items.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
    if (total !== 100) {
      setPercentageError('Total percentage should be 100%');
      return false;
    }
    setPercentageError('');
    return true;
  };

  const handleFiberContentChange = (index: number, field: keyof FiberContentItem, value: string) => {
    const newFiberContents = [...data.fiberContents];
    newFiberContents[index] = { ...newFiberContents[index], [field]: value };
    
    // Auto-set to 100% if only one item
    if (newFiberContents.length === 1) {
      newFiberContents[0].percentage = '100';
    }
    
    handleChange('fiberContents', newFiberContents);
    validatePercentage(newFiberContents);
  };

  const addFiberContent = () => {
    const newFiberContents = [...data.fiberContents, { percentage: '', content: '' }];
    const newBrandedFibers = [...data.brandedFibers, ''];
    onChange({
      ...data,
      fiberContents: newFiberContents,
      brandedFibers: newBrandedFibers,
    });
  };

  const removeFiberContent = (index: number) => {
    const newFiberContents = data.fiberContents.filter((_, i) => i !== index);
    const newBrandedFibers = data.brandedFibers.filter((_, i) => i !== index);
    
    // Auto-set to 100% if only one item remains
    if (newFiberContents.length === 1) {
      newFiberContents[0].percentage = '100';
    }
    
    onChange({
      ...data,
      fiberContents: newFiberContents,
      brandedFibers: newBrandedFibers,
    });
    validatePercentage(newFiberContents);
  };

  const handleBrandedFiberChange = (index: number, value: string) => {
    const newBrandedFibers = [...data.brandedFibers];
    newBrandedFibers[index] = value;
    handleChange('brandedFibers', newBrandedFibers);
  };

  const getFiberContentLabel = (index: number) => {
    if (index === 0) return 'Fiber Content';
    if (index === 1) return 'Add 2nd fiber content';
    if (index === 2) return 'Add 3rd fiber content';
    return `Add ${index + 1}th fiber content`;
  };

  return (
    <div className="space-y-6">
      {/* 第一行：Material Top Category + Material Sub Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchableSelect
          label="Material Top Category"
          value={data.materialTopCategory}
          options={materialTopCategories}
          onChange={(value) => handleChange('materialTopCategory', value)}
          placeholder="Select or search top category..."
          required
        />
        <SearchableSelect
          label="Material Sub Category"
          value={data.materialSubCategory}
          options={materialSubCategories}
          onChange={(value) => handleChange('materialSubCategory', value)}
          placeholder="Select or search sub category..."
          required
        />
      </div>

      {/* Fiber Contents + Branded Fiber */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-[#334155]">
            Fiber Contents
            <span className="text-red-500 ml-1">*</span>
          </label>
          <label className="block text-sm font-medium text-[#334155]">
            Branded Fiber
          </label>
        </div>
        
        {data.fiberContents.map((item, index) => (
          <div key={`fiber-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              {/* + button for first item, X button for others */}
              <div className="flex-shrink-0">
                {index === 0 ? (
                  <div
                    onClick={() => {
                      console.log('Add button clicked!');
                      addFiberContent();
                    }}
                    className="w-6 h-6 rounded-full bg-[#475569] text-white flex items-center justify-center hover:bg-[#334155] transition-colors cursor-pointer"
                    title="Add another fiber content"
                    role="button"
                    tabIndex={0}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div
                    onClick={() => removeFiberContent(index)}
                    className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                    title="Remove"
                    role="button"
                    tabIndex={0}
                  >
                    <X className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              
              {/* Percentage Input */}
              <div className="flex-shrink-0 w-24">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={item.percentage}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      handleFiberContentChange(index, 'percentage', val);
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#94a3b8]">%</span>
                </div>
              </div>
              
              {/* Fiber Content Select */}
              <div className="flex-1">
                <SearchableSelect
                  label=""
                  value={item.content}
                  options={fiberContents}
                  onChange={(value) => handleFiberContentChange(index, 'content', value)}
                  placeholder={getFiberContentLabel(index)}
                  required={index === 0}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Branded Fiber - each row has its own */}
            <SearchableSelect
              label=""
              value={data.brandedFibers[index] || ''}
              options={brandedFibers}
              onChange={(value) => handleBrandedFiberChange(index, value)}
              placeholder="Select or search branded fiber..."
            />
          </div>
        ))}
        
        {/* Percentage Error */}
        {percentageError && (
          <p className="text-sm text-red-500 mt-1">{percentageError}</p>
        )}
        
        {/* Total percentage indicator */}
        <div className="text-sm text-[#64748b]">
          Total: {data.fiberContents.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0)}%
        </div>
      </div>

      {/* 第三行：Finished Weight + Material Finishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput
          label="Finished Weight (GSM)"
          value={data.finishedWeight}
          onChange={(value) => handleChange('finishedWeight', value)}
          placeholder="Enter weight in GSM..."
          required
          suffix="GSM"
        />
        <MultiSelect
          label="Material Finishes (Including both mechanical and chemical)"
          values={data.materialFinishes}
          options={materialFinishes}
          onChange={(value) => handleChange('materialFinishes', value)}
          placeholder="Select finishes..."
        />
      </div>

      {/* 第四行：Fabric Density + Gauge (2 rows with 3 columns) */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block text-sm font-medium text-[#334155]">
            Fabric Density
          </label>
          <label className="block text-sm font-medium text-[#334155]">
            Number
          </label>
          <label className="block text-sm font-medium text-[#334155]">
            Gauge (Only applicable for knit)
          </label>
        </div>
        {data.fabricDensity.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableSelect
              label=""
              value={item.density}
              options={fabricDensities}
              onChange={(value) => {
                const newDensity = [...data.fabricDensity];
                newDensity[index] = { ...newDensity[index], density: value };
                handleChange('fabricDensity', newDensity);
              }}
              placeholder={`Fabric Density ${index + 1}`}
            />
            <NumberInput
              label=""
              value={item.number}
              onChange={(value) => {
                const newDensity = [...data.fabricDensity];
                newDensity[index] = { ...newDensity[index], number: value };
                handleChange('fabricDensity', newDensity);
              }}
              placeholder="Enter number..."
            />
            <NumberInput
              label=""
              value={item.gauge}
              onChange={(value) => {
                const newDensity = [...data.fabricDensity];
                newDensity[index] = { ...newDensity[index], gauge: value };
                handleChange('fabricDensity', newDensity);
              }}
              placeholder="Enter gauge..."
              suffix="GG"
            />
          </div>
        ))}
      </div>

      {/* 第五行：Material Width + Cuttable Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput
          label="Material Width (inch)"
          value={data.materialWidth}
          onChange={(value) => handleChange('materialWidth', value)}
          placeholder="Enter width..."
          required
          suffix="inch"
        />
        <NumberInput
          label="Cuttable Width (inch)"
          value={data.cuttableWidth}
          onChange={(value) => handleChange('cuttableWidth', value)}
          placeholder="Enter cuttable width..."
          suffix="inch"
        />
      </div>

      {/* 第六行：Impression Intents + Material Function */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MultiSelect
          label="Impression Intents"
          values={data.impressionIntents}
          options={impressionIntents}
          onChange={(value) => handleChange('impressionIntents', value)}
          placeholder="Select impression intents..."
        />
        <SearchableSelect
          label="Material Function (Able to Claim)"
          value={data.materialFunction}
          options={materialFunctions}
          onChange={(value) => handleChange('materialFunction', value)}
          placeholder="Select or search material function..."
        />
      </div>

      {/* 第六行：Sustainable + Care Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchableSelect
          label="Sustainable"
          value={data.sustainable}
          options={sustainableOptions}
          onChange={(value) => handleChange('sustainable', value)}
          placeholder="Select sustainable option..."
        />
        <TextInput
          label="Care Recommendations"
          value={data.careRecommendations}
          onChange={(value) => handleChange('careRecommendations', value)}
          placeholder="Enter care recommendations..."
        />
      </div>

      {/* 第七行：Comments */}
      <TextInput
        label="Comments Section for remarks"
        value={data.comments}
        onChange={(value) => handleChange('comments', value)}
        placeholder="Enter comments..."
        multiline
        rows={3}
      />

      {/* 第八行：Customer (多选) */}
      <MultiSelect
        label="Customer"
        values={data.customers}
        options={customerOptions}
        onChange={(value) => handleChange('customers', value)}
        placeholder="Select customers..."
      />
    </div>
  );
}
