// Cost and Lead-time Module Data

export interface CostLeadTimeData {
  // Material Cost
  usdPerMCuttable: string;
  usdCalculated60: string;
  rmbPerMCuttable: string;
  rmbCalculated60: string;
  costValidationDate: string;
  // Material MOQ & MCQ
  materialMOQ: string; // meter 或 kg
  materialMCQ: string; // meter 或 kg
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
  materialMOQ: '',
  materialMCQ: '',
  sampleYardageDevTime: '',
  bulkProductionTime: '',
};
