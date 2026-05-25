// Supply Chain Module Data

export interface SupplyChainData {
  materialSupplierName: string;
  materialCode: string;
  oiCode: string;
  countryOfProduction: string;
  spinningFactory: string;
  weavingKnittingFactory: string;
  dyeingFactory: string;
  printingFactory: string;
  finishingFactory: string;
}

// Country of Production 下拉选项
export const countriesOfProduction = [
  'China',
  'China - Hong Kong',
  'India',
  'Pakistan',
  'Bangladesh',
  'Vietnam',
  'Indonesia',
  'Thailand',
  'Myanmar',
  'Cambodia',
  'Sri Lanka',
  'Turkey',
  'Italy',
  'Spain',
  'Portugal',
  'Germany',
  'France',
  'United Kingdom',
  'United States',
  'Mexico',
  'Brazil',
  'Argentina',
  'Peru',
  'Egypt',
  'Morocco',
  'Tunisia',
  'South Africa',
  'Japan',
  'South Korea',
  'Malaysia',
  'Philippines',
  'Singapore',
  'Australia',
  'New Zealand',
];

// 默认值
export const defaultSupplyChainData: SupplyChainData = {
  materialSupplierName: '',
  materialCode: '',
  oiCode: '',
  countryOfProduction: '',
  spinningFactory: '',
  weavingKnittingFactory: '',
  dyeingFactory: '',
  printingFactory: '',
  finishingFactory: '',
};
