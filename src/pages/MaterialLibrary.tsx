import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput, Select, Checkbox } from '../components/ui/FormElements';
import { useApp } from '../context/AppContext';
import { Material } from '../types';
import { ExcelImportModal } from '../components/material/ExcelImportModal';
import {
  Search,
  Filter,
  PlusCircle,
  Grid,
  List,
  ChevronDown,
  X,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MinusCircle,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Upload,
  Download,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

export function MaterialLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { materials, suppliers, addMaterial } = useApp();

  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortField, setSortField] = useState<keyof Material>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    materialType: [] as string[],
    color: [] as string[],
    supplier: [] as string[],
    stockStatus: [] as string[],
    status: [] as string[],
  });

  // Get unique values for filters
  const uniqueTypes = [...new Set(materials.map(m => m.materialType))];
  const uniqueColors = [...new Set(materials.map(m => m.color))];
  const uniqueSuppliers = [...new Set(materials.map(m => m.supplier))];
  const uniqueStatuses = [...new Set(materials.map(m => m.stockStatus))];

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let result = [...materials];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.name.toLowerCase().includes(query) ||
          m.code.toLowerCase().includes(query) ||
          m.materialType.toLowerCase().includes(query) ||
          m.supplier.toLowerCase().includes(query) ||
          m.color.toLowerCase().includes(query)
      );
    }

    // Material type filter
    if (filters.materialType.length > 0) {
      result = result.filter(m => filters.materialType.includes(m.materialType));
    }

    // Color filter
    if (filters.color.length > 0) {
      result = result.filter(m => filters.color.includes(m.color));
    }

    // Supplier filter
    if (filters.supplier.length > 0) {
      result = result.filter(m => filters.supplier.includes(m.supplier));
    }

    // Stock status filter
    if (filters.stockStatus.length > 0) {
      result = result.filter(m => filters.stockStatus.includes(m.stockStatus));
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(m => filters.status.includes(m.status));
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [materials, searchQuery, filters, sortField, sortOrder]);

  const toggleFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      materialType: [],
      color: [],
      supplier: [],
      stockStatus: [],
      status: [],
    });
    setSearchQuery('');
  };

  const activeFilterCount =
    filters.materialType.length +
    filters.color.length +
    filters.supplier.length +
    filters.stockStatus.length +
    filters.status.length;

  const handleSort = (field: keyof Material) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle batch import from Excel
  const handleBatchImport = (importData: any[]) => {
    importData.forEach(data => {
      const newMaterial: Omit<Material, 'id' | 'createdAt' | 'updatedAt'> = {
        code: data.materialCode || `MAT-${Date.now().toString(36).toUpperCase().slice(-8)}`,
        name: `${data.materialTopCategory} - ${data.materialSubCategory}`,
        materialType: data.materialTopCategory,
        supplier: data.supplierName || '',
        supplierId: '',
        origin: data.countryOfProduction || '',
        weight: Number(data.finishedWeight) || 0,
        width: Number(data.materialWidth) || 0,
        composition: data.fiberContents,
        color: '',
        yarnSpec: '',
        price: 0,
        minOrder: 0,
        leadTime: 0,
        stockStatus: 'in_stock',
        status: 'pending',
        images: [],
        description: data.comments || '',
        certifications: [],
        testReports: []
      };
      addMaterial(newMaterial);
    });
  };

  // Export materials to Excel
  const handleExport = () => {
    const exportData = filteredMaterials.map(m => ({
      'Material Code': m.code,
      'Material Name': m.name,
      'Material Type': m.materialType,
      'Supplier': m.supplier,
      'Origin': m.origin,
      'Composition': m.composition,
      'Weight (GSM)': m.weight,
      'Width (inch)': m.width,
      'Color': m.color,
      'Price': m.price,
      'Min Order': m.minOrder,
      'Lead Time (days)': m.leadTime,
      'Stock Status': m.stockStatus,
      'Status': m.status,
      'Created At': new Date(m.createdAt).toLocaleDateString(),
      'Updated At': new Date(m.updatedAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Materials');
    XLSX.writeFile(wb, `Materials_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Material Library"
        subtitle="v1.0"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => navigate('/create')}>
              <PlusCircle className="w-4 h-4" />
              New Material
            </Button>
          </div>
        }
      />

      {/* Import Modal */}
      <ExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleBatchImport}
      />

      <div className="p-6 space-y-6">
        {/* Search and Filter Bar */}
        <Card className="!p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, type, supplier..."
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* View Toggle */}
            <div className="flex gap-1 bg-[#f0f4f8] p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Material Type */}
                <FilterSection
                  title="Material Type"
                  options={uniqueTypes}
                  selected={filters.materialType}
                  onToggle={(val) => toggleFilter('materialType', val)}
                />

                {/* Color */}
                <FilterSection
                  title="Color"
                  options={uniqueColors}
                  selected={filters.color}
                  onToggle={(val) => toggleFilter('color', val)}
                />

                {/* Supplier */}
                <FilterSection
                  title="Supplier"
                  options={uniqueSuppliers}
                  selected={filters.supplier}
                  onToggle={(val) => toggleFilter('supplier', val)}
                />

                {/* Stock Status */}
                <FilterSection
                  title="Stock Status"
                  options={uniqueStatuses}
                  selected={filters.stockStatus}
                  onToggle={(val) => toggleFilter('stockStatus', val)}
                />
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#64748b]">
            Showing <span className="font-medium text-[#0f172a]">{filteredMaterials.length}</span> of{' '}
            <span className="font-medium text-[#0f172a]">{materials.length}</span> materials
          </p>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onClick={() => navigate(`/material/${material.id}`)}
                onEdit={() => navigate(`/edit/${material.id}`)}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <Card className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <SortableHeader
                      label="Material"
                      field="name"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Code"
                      field="code"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Type"
                      field="materialType"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Supplier"
                      field="supplier"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Weight"
                      field="weight"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => (
                    <tr
                      key={material.id}
                      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                      onClick={() => navigate(`/material/${material.id}`)}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm text-[#0f172a]">{material.name}</p>
                          <p className="text-xs text-[#94a3b8]">{material.color}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#64748b]">{material.code}</td>
                      <td className="py-3 px-4 text-sm text-[#64748b]">{material.materialType}</td>
                      <td className="py-3 px-4 text-sm text-[#64748b]">{material.supplier}</td>
                      <td className="py-3 px-4 text-sm text-[#64748b]">{material.weight} GSM</td>
                      <td className="py-3 px-4">
                        <StockStatusBadge status={material.stockStatus} />
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/material/${material.id}`)}
                            className="p-1.5 rounded hover:bg-[#f0f4f8] text-[#64748b] hover:text-[#3b82f6]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/edit/${material.id}`)}
                            className="p-1.5 rounded hover:bg-[#f0f4f8] text-[#64748b] hover:text-[#3b82f6]"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-[#f0f4f8] text-[#64748b] hover:text-[#ef4444]">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <Card className="py-12 text-center">
            <Package className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#0f172a] mb-2">No materials found</h3>
            <p className="text-sm text-[#64748b] mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

// Import icons
import { Package } from 'lucide-react';

// Filter Section Component
function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-[#f0f4f8] transition-colors"
      >
        <span className="text-[#64748b]">
          {title}
          {selected.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-[#3b82f6] text-white rounded text-xs">
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown className="w-4 h-4 text-[#64748b]" />
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[#f0f4f8] cursor-pointer"
            >
              <Checkbox
                label={option}
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// Sortable Header Component
function SortableHeader({
  label,
  field,
  currentField,
  currentOrder,
  onSort,
}: {
  label: string;
  field: keyof Material;
  currentField: keyof Material;
  currentOrder: 'asc' | 'desc';
  onSort: (field: keyof Material) => void;
}) {
  const isActive = currentField === field;

  return (
    <th
      className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide cursor-pointer hover:text-[#3b82f6] transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${isActive ? 'text-[#3b82f6]' : ''}`} />
      </div>
    </th>
  );
}

// Material Card Component
function MaterialCard({
  material,
  onClick,
  onEdit,
}: {
  material: Material;
  onClick: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className="bg-white rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.08)] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-40 bg-[#f0f4f8] overflow-hidden">
        {material.images.length > 0 ? (
          <img
            src={material.images[0]}
            alt={material.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-[#94a3b8]" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StockStatusBadge status={material.stockStatus} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <p className="font-semibold text-sm text-[#0f172a] line-clamp-1">{material.name}</p>
          <p className="text-xs text-[#94a3b8]">{material.code}</p>
        </div>

        <div className="space-y-1 text-xs text-[#64748b]">
          <p>{material.materialType}</p>
          <p>{material.supplier}</p>
          <p>{material.weight} GSM | {material.color}</p>
        </div>

        <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex items-center justify-between">
          <p className="text-sm font-bold text-[#3b82f6]">${material.price.toFixed(2)}</p>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="p-1.5 rounded hover:bg-[#f0f4f8] text-[#94a3b8] hover:text-[#3b82f6]"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stock Status Badge
function StockStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    in_stock: { bg: 'bg-[#22c55e]/10', text: 'text-[#22c55e]', icon: <CheckCircle className="w-3 h-3" /> },
    low_stock: { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', icon: <AlertTriangle className="w-3 h-3" /> },
    out_of_stock: { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', icon: <XCircle className="w-3 h-3" /> },
    discontinued: { bg: 'bg-[#94a3b8]/10', text: 'text-[#94a3b8]', icon: <MinusCircle className="w-3 h-3" /> },
  };

  const { bg, text, icon } = config[status] || config.in_stock;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${bg} ${text}`}>
      {icon}
      {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}