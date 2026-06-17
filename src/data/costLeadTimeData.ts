// Cost and Lead-time Module Data

export interface CostLeadTimeData {
  // Material Cost
  usdPerMCuttable: string;
  usdCalculated60: string;
  rmbPerMCuttable: string;
  rmbCalculated60: string;
  costValidationDate: string;
  // Material MOQ & MCQ
  materialMOQQuantity: string; // 数量
  materialMOQUnit: 'meter' | 'kg'; // 单位
  materialMCQQuantity: string; // 数量
  materialMCQUnit: 'meter' | 'kg'; // 单位
  // Material Lead-time
  sampleYardageDevTime: string;
  bulkProductionTime: string;
}

export const defaultCostLeadTimeData: CostLeadTimeData = {
  usdPerMCuttable: '',
  usdCalculated60: '',
  rmbPerMCuttable: '',
  rmbCalculated60: '',
  costValidationDate: '',
  materialMOQQuantity: '',
  materialMOQUnit: 'meter',
  materialMCQQuantity: '',
  materialMCQUnit: 'meter',
  sampleYardageDevTime: '',
  bulkProductionTime: '',
};
