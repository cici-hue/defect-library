import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Material, Supplier, Category, AuditLog, DashboardStats, MaterialFilters } from '../types';
import { mockMaterials, mockSuppliers, mockCategories, mockAuditLogs, calculateDashboardStats } from '../data/mockData';

interface AppState {
  materials: Material[];
  suppliers: Supplier[];
  categories: Category[];
  auditLogs: AuditLog[];
  sidebarCollapsed: boolean;
  filters: MaterialFilters;
}

interface AppContextType extends AppState {
  // Sidebar
  toggleSidebar: () => void;

  // Materials
  addMaterial: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => Material;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  getMaterialById: (id: string) => Material | undefined;

  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplierById: (id: string) => Supplier | undefined;

  // Filters
  setFilters: (filters: Partial<MaterialFilters>) => void;
  resetFilters: () => void;

  // Dashboard
  getDashboardStats: () => DashboardStats;
}

const defaultFilters: MaterialFilters = {
  search: '',
  materialType: [],
  color: [],
  supplier: [],
  priceRange: [0, 100],
  weightRange: [0, 500],
  stockStatus: [],
  status: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [categories] = useState<Category[]>(mockCategories);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFiltersState] = useState<MaterialFilters>(defaultFilters);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const addMaterial = useCallback((materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>): Material => {
    const now = new Date().toISOString().split('T')[0];
    const newMaterial: Material = {
      ...materialData,
      id: `mat-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setMaterials(prev => [...prev, newMaterial]);
    return newMaterial;
  }, []);

  const updateMaterial = useCallback((id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(m =>
      m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : m
    ));
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }, []);

  const getMaterialById = useCallback((id: string) => {
    return materials.find(m => m.id === id);
  }, [materials]);

  const addSupplier = useCallback((supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier => {
    const now = new Date().toISOString().split('T')[0];
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
  }, []);

  const updateSupplier = useCallback((id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : s
    ));
  }, []);

  const deleteSupplier = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  }, []);

  const getSupplierById = useCallback((id: string) => {
    return suppliers.find(s => s.id === id);
  }, [suppliers]);

  const setFilters = useCallback((newFilters: Partial<MaterialFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const getDashboardStats = useCallback(() => {
    return calculateDashboardStats(materials);
  }, [materials]);

  const value: AppContextType = {
    materials,
    suppliers,
    categories,
    auditLogs,
    sidebarCollapsed,
    filters,
    toggleSidebar,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    setFilters,
    resetFilters,
    getDashboardStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}