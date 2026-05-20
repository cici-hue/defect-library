import React from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { Tags, ChevronRight, Package } from 'lucide-react';

export function Categories() {
  const { categories, materials } = useApp();

  // Group materials by category
  const materialsByCategory = materials.reduce((acc, m) => {
    const type = m.materialType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(m);
    return acc;
  }, {} as Record<string, typeof materials>);

  return (
    <div className="min-h-screen">
      <Header title="Categories" subtitle="v1.0" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="!p-4">
            <p className="text-sm text-[#64748b]">Total Categories</p>
            <p className="text-2xl font-bold text-[#0f172a] mt-1">{categories.length}</p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-[#64748b]">Total Materials</p>
            <p className="text-2xl font-bold text-[#0f172a] mt-1">{materials.length}</p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-[#64748b]">Avg. per Category</p>
            <p className="text-2xl font-bold text-[#0f172a] mt-1">
              {Math.round(materials.length / categories.length)}
            </p>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const count = materialsByCategory[category.name]?.length || 0;
            return (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-lg flex items-center justify-center">
                      <Tags className="w-5 h-5 text-[#3b82f6]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">{category.name}</h3>
                      <p className="text-xs text-[#94a3b8]">ID: {category.id}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#94a3b8] group-hover:text-[#3b82f6] transition-colors" />
                </div>

                <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-[#64748b]">
                    <Package className="w-4 h-4" />
                    <span>{count} materials</span>
                  </div>
                  <span className="text-xs text-[#94a3b8]">View all</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}