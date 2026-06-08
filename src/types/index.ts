// Material type definitions

export interface Material {
  id: string;
  
  // Module 1: Material Specification
  materialTopCategory: string;
  materialSubCategory: string;
  fiberContents: string;
  brandedFiber?: string;
  finishedWeight: number; // GSM
  materialFinishes?: string[];
  fabricDensity?: string;
  materialWidth: number; // inch
  cuttableWidth?: number; // inch
  impressionIntents?: string;
  comments?: string;
  materialFunction?: string;
  sustainable?: string;
  careRecommendations?: string;
  
  // Module 2: Supply Chain
  supplierName?: string;
  materialCode?: string;
  oiCode?: string;
  countryOfProduction?: string;
  weavingFactory?: string;
  dyeingFactory?: string;
  printingFactory?: string;
  finishingFactory?: string;
  
  // Legacy fields (for backward compatibility)
  code: string;
  name: string;
  materialType: string;
  supplier: string;
  supplierId: string;
  origin: string;
  weight: number;
  width: number;
  composition: string;
  color: string;
  yarnSpec: string;
  price: number;
  minOrder: number;
  leadTime: number;
  status: 'pending' | 'approved' | 'archived';
  images: string[];
  documents: Document[];
  remarks: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Test reports
  testReports?: TestReport[];
  certifications?: string[];

  // Module 3: Cost and Lead-time
  usdPerMCuttable?: string;
  usdCalculated60?: string;
  rmbPerMCuttable?: string;
  rmbCalculated60?: string;
  costValidationDate?: string;
  materialMOQ?: string; // meter or kg
  materialMCQ?: string; // meter or kg
  sampleYardageDevTime?: string; // days
  bulkProductionTime?: string; // days

  // Module 4: Material Test
  testReportFiles?: TestReport[];
  testStatus?: string; // Pass / Conditional Tolerance / Fail
}

export interface TestReport {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  rating: number;
  materials: string[]; // material IDs
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
  materialCount: number;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'view';
  entityType: 'material' | 'supplier' | 'category';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  changes: Record<string, { old: any; new: any }>;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar: string;
}

// Filter and Search types
export interface MaterialFilters {
  search: string;
  materialType: string[];
  color: string[];
  supplier: string[];
  priceRange: [number, number];
  weightRange: [number, number];
  status: string[];
}

// Dashboard statistics
export interface DashboardStats {
  totalMaterials: number;
  pendingReview: number;
  approvedMaterials: number;
  recentUpdates: number;
  materialsByType: Record<string, number>;
  materialsBySupplier: Record<string, number>;
  materialsByTestStatus: Record<string, number>;
  materialsByMOQ: Record<string, number>;
}
