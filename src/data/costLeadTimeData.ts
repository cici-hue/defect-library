// Cost and Lead-time Module Data

export interface CostLeadTimeData {
  // Material Cost
  usdPerMCuttable: string;
  usdCalculated60: string;
  rmbPerMCuttable: string;
  rmbCalculated60: string;
  costValidationDate: string;
}

export const defaultCostLeadTimeData: CostLeadTimeData = {
  usdPerMCuttable: '',
  usdCalculated60: '',
  rmbPerMCuttable: '',
  rmbCalculated60: '',
  costValidationDate: '',
};
