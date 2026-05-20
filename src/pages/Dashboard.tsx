import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import {
  Package,
  Clock,
  AlertTriangle,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
  MinusCircle,
  PlusCircle,
  Building2,
  Tags,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const { getDashboardStats, materials } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getDashboardStats();

  // AI Search suggestions
  const aiSuggestions = [
    'Find lightweight cotton fabrics under 150 GSM',
    'Show all silk materials from China',
    'Materials suitable for summer shirts',
    'Low stock items that need restocking',
    'Blue colored fabrics with low MOQ',
  ];

  // Recent materials
  const recentMaterials = [...materials]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Materials by type for display
  const materialsByType = Object.entries(stats.materialsByType);

  // Stock status data
  const stockStatusData = Object.entries(stats.stockStatus);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard & AI"
        subtitle="v1.0"
        actions={
          <Button onClick={() => navigate('/create')}>
            <Sparkles className="w-4 h-4" />
            New Material
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* AI Search Section */}
        <Card className="!p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#334155] to-[#64748b] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Material Search</h2>
                <p className="text-white/70 text-sm">Ask questions in natural language to find materials</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Find breathable cotton fabrics for summer clothing..."
                className="w-full pl-12 pr-32 py-3 text-base rounded-lg border-0 bg-white shadow-lg focus:ring-2 focus:ring-[#3b82f6]/30 transition-shadow"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>

            {/* Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    navigate(`/library?search=${encodeURIComponent(suggestion)}`);
                  }}
                  className="px-3 py-1.5 text-sm text-white/90 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Materials"
            value={stats.totalMaterials}
            icon={<Package className="w-6 h-6" />}
            change="+5 this week"
            changeType="positive"
            color="blue"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={<Clock className="w-6 h-6" />}
            change={stats.pendingReview > 0 ? 'Needs attention' : 'All reviewed'}
            changeType={stats.pendingReview > 0 ? 'negative' : 'positive'}
            color="yellow"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            icon={<AlertTriangle className="w-6 h-6" />}
            change={stats.lowStock > 0 ? 'Items low' : 'Stock OK'}
            changeType={stats.lowStock > 0 ? 'negative' : 'positive'}
            color="red"
          />
          <StatCard
            title="Recent Updates"
            value={stats.recentUpdates}
            icon={<TrendingUp className="w-6 h-6" />}
            change="Last 7 days"
            changeType="neutral"
            color="green"
          />
        </div>

        {/* Charts Row - Simple CSS-based bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials by Type */}
          <Card title="Materials by Type">
            <div className="space-y-3">
              {materialsByType.map(([type, count], index) => {
                const maxCount = Math.max(...materialsByType.map(([, c]) => c));
                const percentage = (count / maxCount) * 100;
                const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-[#64748b] truncate">{type.split(' ')[0]}</div>
                    <div className="flex-1 h-6 bg-[#f0f4f8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                    </div>
                    <div className="w-8 text-sm font-medium text-[#0f172a]">{count}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Stock Status */}
          <Card title="Stock Status Distribution">
            <div className="space-y-3">
              {stockStatusData.map(([status, count]) => {
                const maxCount = Math.max(...stockStatusData.map(([, c]) => c));
                const percentage = (count / maxCount) * 100;
                const colorMap: Record<string, string> = {
                  'In Stock': '#22c55e',
                  'Low Stock': '#f59e0b',
                  'Out of Stock': '#ef4444',
                  'Discontinued': '#94a3b8',
                };
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-[#64748b]">{status}</div>
                    <div className="flex-1 h-6 bg-[#f0f4f8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colorMap[status] || '#94a3b8',
                        }}
                      />
                    </div>
                    <div className="w-8 text-sm font-medium text-[#0f172a]">{count}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Recent Materials & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Materials */}
          <div className="lg:col-span-2">
            <Card title="Recent Materials">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                        Material
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMaterials.map((material) => (
                      <tr
                        key={material.id}
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] cursor-pointer transition-colors"
                        onClick={() => navigate(`/material/${material.id}`)}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm text-[#0f172a]">{material.name}</p>
                            <p className="text-xs text-[#94a3b8]">{material.code}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#64748b]">
                          {material.materialType}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={material.stockStatus} />
                        </td>
                        <td className="py-3 px-4 text-sm text-[#94a3b8]">
                          {material.updatedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/library')}
                  className="text-[#3b82f6]"
                >
                  View All Materials
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-3">
              <QuickActionButton
                icon={<PlusCircle className="w-5 h-5" />}
                label="Create New Material"
                description="Add a new material to the library"
                onClick={() => navigate('/create')}
              />
              <QuickActionButton
                icon={<Package className="w-5 h-5" />}
                label="Browse Library"
                description="View and search all materials"
                onClick={() => navigate('/library')}
              />
              <QuickActionButton
                icon={<Building2 className="w-5 h-5" />}
                label="Manage Suppliers"
                description="View and edit supplier information"
                onClick={() => navigate('/suppliers')}
              />
              <QuickActionButton
                icon={<Tags className="w-5 h-5" />}
                label="Categories"
                description="Organize materials by category"
                onClick={() => navigate('/categories')}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
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

// Quick Action Button Component
function QuickActionButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#e2e8f0] hover:border-[#3b82f6] hover:bg-[#f0f4f8]/50 transition-all group"
    >
      <div className="w-10 h-10 bg-[#f0f4f8] rounded-lg flex items-center justify-center text-[#64748b] group-hover:bg-[#3b82f6]/10 group-hover:text-[#3b82f6] transition-colors">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-sm text-[#0f172a]">{label}</p>
        <p className="text-xs text-[#94a3b8]">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#3b82f6] transition-colors" />
    </button>
  );
}