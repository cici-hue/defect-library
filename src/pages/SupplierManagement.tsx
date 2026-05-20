import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput, Input, Select } from '../components/ui/FormElements';
import { useApp } from '../context/AppContext';
import { Supplier } from '../types';
import {
  PlusCircle,
  Building2,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Star,
  Package,
  X,
  Save,
} from 'lucide-react';

export function SupplierManagement() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal form state
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    region: '',
    rating: 4,
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        region: supplier.region,
        rating: supplier.rating,
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        region: '',
        rating: 4,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, {
        ...formData,
        materials: editingSupplier.materials,
        code: editingSupplier.code,
      });
    } else {
      addSupplier({
        ...formData,
        materials: [],
        code: `SUP-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      });
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteSupplier(id);
    setShowDeleteModal(null);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Supplier Management"
        subtitle="v1.0"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <PlusCircle className="w-4 h-4" />
            Add Supplier
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <Card className="!p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suppliers by name, code, or region..."
              />
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Suppliers" value={suppliers.length} />
          <StatCard title="Active Suppliers" value={suppliers.filter(s => s.materials.length > 0).length} />
          <StatCard title="Total Materials" value={suppliers.reduce((acc, s) => acc + s.materials.length, 0)} />
          <StatCard
            title="Avg. Rating"
            value={(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length).toFixed(1)}
          />
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#f0f4f8] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-[#64748b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0f172a] truncate">{supplier.name}</h3>
                  <p className="text-xs text-[#94a3b8]">{supplier.code}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#f59e0b] fill-current" />
                  <span className="text-sm font-medium text-[#0f172a]">{supplier.rating}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{supplier.region}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-[#64748b]">
                  <Package className="w-4 h-4" />
                  <span>{supplier.materials.length} materials</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(supplier)}
                    className="p-1.5 rounded hover:bg-[#f0f4f8] text-[#94a3b8] hover:text-[#3b82f6]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(supplier.id)}
                    className="p-1.5 rounded hover:bg-[#f0f4f8] text-[#94a3b8] hover:text-[#ef4444]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <Card className="py-12 text-center">
            <Building2 className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#0f172a] mb-2">No suppliers found</h3>
            <p className="text-sm text-[#64748b] mb-4">
              {searchQuery ? 'Try adjusting your search criteria' : 'Add your first supplier to get started'}
            </p>
            <Button onClick={() => handleOpenModal()}>
              <PlusCircle className="w-4 h-4" />
              Add Supplier
            </Button>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0f172a]">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-[#f0f4f8] rounded">
                <X className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Supplier Name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Zhangwei Textile Co."
              />
              <Input
                label="Contact Person"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="e.g., Zhang Wei"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., contact@supplier.com"
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="e.g., +86 21 8888 1234"
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full address..."
              />
              <Input
                label="Region"
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                placeholder="e.g., East China"
              />
              <Input
                label="Rating (1-5)"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4" />
                  {editingSupplier ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#ef4444]/10 rounded-lg flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-[#ef4444]" />
              </div>
              <h3 className="text-lg font-bold text-[#0f172a]">Delete Supplier</h3>
            </div>
            <p className="text-sm text-[#64748b] mb-6">
              Are you sure you want to delete this supplier? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(showDeleteModal)}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.08)] p-4">
      <p className="text-sm text-[#64748b]">{title}</p>
      <p className="text-2xl font-bold text-[#0f172a] mt-1">{value}</p>
    </div>
  );
}