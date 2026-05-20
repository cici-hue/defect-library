import React from 'react';
import { SearchableSelect } from '../ui/SearchableSelect';
import { MultiSelect } from '../ui/MultiSelect';
import { NumberInput } from '../ui/NumberInput';
import { TextInput } from '../ui/TextInput';
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
} from '../../data/materialSpecificationData';

export interface MaterialSpecificationData {
  materialTopCategory: string;
  materialSubCategory: string;
  fiberContents: string;
  brandedFiber: string;
  finishedWeight: string;
  materialFinishes: string[];
  fabricDensity: string;
  materialWidth: string;
  cuttableWidth: string;
  impressionIntents: string;
  comments: string;
  materialFunction: string;
  sustainable: string;
  careRecommendations: string;
}

interface MaterialSpecificationFormProps {
  data: MaterialSpecificationData;
  onChange: (data: MaterialSpecificationData) => void;
}

export function MaterialSpecificationForm({ data, onChange }: MaterialSpecificationFormProps) {
  const handleChange = <K extends keyof MaterialSpecificationData>(
    field: K,
    value: MaterialSpecificationData[K]
  ) => {
    onChange({ ...data, [field]: value });
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

      {/* 第二行：Fiber Contents + Branded Fiber */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchableSelect
          label="Fiber Contents"
          value={data.fiberContents}
          options={fiberContents}
          onChange={(value) => handleChange('fiberContents', value)}
          placeholder="Select or search fiber content..."
          required
        />
        <SearchableSelect
          label="Branded Fiber"
          value={data.brandedFiber}
          options={brandedFibers}
          onChange={(value) => handleChange('brandedFiber', value)}
          placeholder="Select or search branded fiber..."
        />
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

      {/* 第四行：Fabric Density + Material Width + Cuttable Width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchableSelect
          label="Fabric Density"
          value={data.fabricDensity}
          options={fabricDensities}
          onChange={(value) => handleChange('fabricDensity', value)}
          placeholder="Select or search fabric density..."
        />
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

      {/* 第五行：Impression Intents + Material Function */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchableSelect
          label="Impression Intents"
          value={data.impressionIntents}
          options={impressionIntents}
          onChange={(value) => handleChange('impressionIntents', value)}
          placeholder="Select or search impression intent..."
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
    </div>
  );
}
