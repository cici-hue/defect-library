// Material Test Module Data

export interface MaterialTestFile {
  name: string;
  size: number;
  type: string;
  url: string; // base64 or blob url
}

export interface MaterialTestData {
  testReportFiles: MaterialTestFile[];
  testStatus: string; // Pass / Conditional Tolerance / Fail
}

export const defaultMaterialTestData: MaterialTestData = {
  testReportFiles: [],
  testStatus: '',
};
