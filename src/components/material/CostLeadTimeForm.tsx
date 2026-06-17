import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { SearchableSelect } from '../ui/SearchableSelect';
import { CostLeadTimeData } from '../../data/costLeadTimeData';

interface CostLeadTimeFormProps {
  data: CostLeadTimeData;
  onChange: (data: CostLeadTimeData) => void;
  cuttableWidth: string; // 来自 Material Specification
}

export function CostLeadTimeForm({ data, onChange, cuttableWidth }: CostLeadTimeFormProps) {
  const handleChange = <K extends keyof CostLeadTimeData>(
    field: K,
    value: CostLeadTimeData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  // 计算公式：cuttableWidth × 用户输入值 ÷ 60
  const calculatePrice = (value: string): string => {
    const width = parseFloat(cuttableWidth) || 0;
    const input = parseFloat(value) || 0;
    if (width === 0 || input === 0) return '';
    const result = (width * input) / 60;
    return result.toFixed(2);
  };

  // 当 USD 输入变化时，自动计算
  const handleUsdChange = (value: string) => {
    const calculated = calculatePrice(value);
    onChange({
      ...data,
      usdPerMCuttable: value,
      usdCalculated60: calculated,
    });
  };

  // 当 RMB 输入变化时，自动计算
  const handleRmbChange = (value: string) => {
    const calculated = calculatePrice(value);
    onChange({
      ...data,
      rmbPerMCuttable: value,
      rmbCalculated60: calculated,
    });
  };

  return (
    <div className="space-y-6">
      {/* 第一部分：Material Cost */}
      <div>
        <h4 className="text-sm font-semibold text-[#334155] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#475569] rounded-full"></span>
          Material Cost
        </h4>

        <div className="space-y-6 pl-4">
          {/* 第 1 点：USD */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">
              USD / M based on cuttable width, FOB ex-mill cost
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={data.usdPerMCuttable}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                handleUsdChange(val);
              }}
              placeholder="Enter USD price..."
              className="w-full md:w-1/2 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent"
            />
            <div className="flex items-center gap-2 text-sm text-[#64748b]">
              <span>system automatic to calculate the price based on 60" ( for price comparison purpose only )</span>
              <span className="font-semibold text-[#334155]">
                {data.usdCalculated60 || '0.00'} USD
              </span>
            </div>
          </div>

          {/* 第 2 点：RMB */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">
              RMB / M based on cuttable width, VAT ex-mill cost
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={data.rmbPerMCuttable}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                handleRmbChange(val);
              }}
              placeholder="Enter RMB price..."
              className="w-full md:w-1/2 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent"
            />
            <div className="flex items-center gap-2 text-sm text-[#64748b]">
              <span>system automatic to calculate the price based on 60" ( for price comparison purpose only )</span>
              <span className="font-semibold text-[#334155]">
                {data.rmbCalculated60 || '0.00'} RMB
              </span>
            </div>
          </div>

          {/* 第 3 点：Cost Validation date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">
              Cost Validation date
            </label>
            <div className="relative w-full md:w-1/2">
              <input
                type="date"
                value={data.costValidationDate}
                onChange={(e) => handleChange('costValidationDate', e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 第二部分：Material MOQ */}
      <div>
        <h4 className="text-sm font-semibold text-[#334155] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#475569] rounded-full"></span>
          Material MOQ
        </h4>
        <div className="pl-4 flex items-center gap-2 w-full md:w-1/2">
          <input
            type="text"
            inputMode="decimal"
            value={data.materialMOQQuantity}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              handleChange('materialMOQQuantity', val);
            }}
            placeholder="Enter quantity..."
            className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent"
          />
          <SearchableSelect
            label=""
            value={data.materialMOQUnit}
            options={['meter', 'kg']}
            onChange={(value) => handleChange('materialMOQUnit', value as CostLeadTimeData['materialMOQUnit'])}
            placeholder="Select unit..."
            compact
          />
        </div>
      </div>

      {/* 第三部分：Material MCQ */}
      <div>
        <h4 className="text-sm font-semibold text-[#334155] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#475569] rounded-full"></span>
          Material MCQ
        </h4>
        <div className="pl-4 flex items-center gap-2 w-full md:w-1/2">
          <input
            type="text"
            inputMode="decimal"
            value={data.materialMCQQuantity}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              handleChange('materialMCQQuantity', val);
            }}
            placeholder="Enter quantity..."
            className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent"
          />
          <SearchableSelect
            label=""
            value={data.materialMCQUnit}
            options={['meter', 'kg']}
            onChange={(value) => handleChange('materialMCQUnit', value as CostLeadTimeData['materialMCQUnit'])}
            placeholder="Select unit..."
            compact
          />
        </div>
      </div>

      {/* 第四部分：Material Lead-time */}
      <div>
        <h4 className="text-sm font-semibold text-[#334155] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#475569] rounded-full"></span>
          Material Lead-time
        </h4>
        <div className="space-y-6 pl-4">
          {/* 第 1 点：Sample Yardage development time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">
              Sample Yardage development time
            </label>
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <input
                type="text"
                inputMode="numeric"
                value={data.sampleYardageDevTime}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  handleChange('sampleYardageDevTime', val);
                }}
                placeholder="Enter number..."
                className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent"
              />
              <span className="text-sm text-[#64748b]">day</span>
            </div>
          </div>

          {/* 第 2 点：Bulk production (based on 3000M/color) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">
              Bulk production ( based on 3000M/color )
            </label>
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <input
                type="text"
                inputMode="numeric"
                value={data.bulkProductionTime}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  handleChange('bulkProductionTime', val);
                }}
                placeholder="Enter number..."
                className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#475569] focus:border-transparent"
              />
              <span className="text-sm text-[#64748b]">day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
