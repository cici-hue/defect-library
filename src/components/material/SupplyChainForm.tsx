import React from 'react';
import { TextInput } from '../ui/TextInput';
import { SearchableSelect } from '../ui/SearchableSelect';
import { countriesOfProduction } from '../../data/supplyChainData';

export interface SupplyChainData {
  materialSupplierName: string;
  materialCode: string;
  oiCode: string;
  countryOfProduction: string;
  weavingKnittingFactory: string;
  dyeingFactory: string;
  printingFactory: string;
  finishingFactory: string;
}

interface SupplyChainFormProps {
  data: SupplyChainData;
  onChange: (data: SupplyChainData) => void;
}

export function SupplyChainForm({ data, onChange }: SupplyChainFormProps) {
  const handleChange = <K extends keyof SupplyChainData>(
    field: K,
    value: SupplyChainData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 第一行：Material Supplier Name + Material Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Material Supplier Name"
          value={data.materialSupplierName}
          onChange={(value) => handleChange('materialSupplierName', value)}
          placeholder="Enter supplier name..."
          required
        />
        <TextInput
          label="Material Code (mill code)"
          value={data.materialCode}
          onChange={(value) => handleChange('materialCode', value)}
          placeholder="Enter material code..."
        />
      </div>

      {/* 第二行：Oi Code + Country of Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Oi Code (Customer Code)"
          value={data.oiCode}
          onChange={(value) => handleChange('oiCode', value)}
          placeholder="Enter Oi code..."
        />
        <SearchableSelect
          label="Country of Production"
          value={data.countryOfProduction}
          options={countriesOfProduction}
          onChange={(value) => handleChange('countryOfProduction', value)}
          placeholder="Select or search country..."
        />
      </div>

      {/* 第三行：Weaving/Knitting Factory + Dyeing Factory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Weaving/Knitting Factory"
          value={data.weavingKnittingFactory}
          onChange={(value) => handleChange('weavingKnittingFactory', value)}
          placeholder="Enter weaving/knitting factory..."
        />
        <TextInput
          label="Dyeing Factory"
          value={data.dyeingFactory}
          onChange={(value) => handleChange('dyeingFactory', value)}
          placeholder="Enter dyeing factory..."
        />
      </div>

      {/* 第四行：Printing Factory + Finishing Factory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Printing Factory"
          value={data.printingFactory}
          onChange={(value) => handleChange('printingFactory', value)}
          placeholder="Enter printing factory..."
        />
        <TextInput
          label="Finishing Factory"
          value={data.finishingFactory}
          onChange={(value) => handleChange('finishingFactory', value)}
          placeholder="Enter finishing factory..."
        />
      </div>
    </div>
  );
}
