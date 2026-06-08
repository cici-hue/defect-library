import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import {
  Package,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
  XCircle,
  AlertTriangle,
  PlusCircle,
  Building2,
  Tags,
  Beaker,
  Ruler,
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
    'Materials with Pass test status',
    'Fabrics with low MOQ',
  ];

  // Recent materials (most recently updated)
  const recentMaterials = [...materials]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const materialsByType = Object.entries(stats.materialsByType);
  const materialsByTestStatus = Object.entries(stats.materialsByTestStatus);
  const materialsByMOQ = Object.entries(stats.materialsByMOQ);

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
            change="In library"
            changeType="neutral"
            color="blue"
          />
          <StatCard
            title="Approved"
            value={stats.approvedMaterials}
            icon={<CheckCircle className="w-6 h-6" />}
            change="Available to use"
            changeType="positive"
            color="green"
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
            title="Recent Updates"
            value={stats.recentUpdates}
            icon={<TrendingUp className="w-6 h-6" />}
            change="Last 30 days"
            changeType="neutral"
            color="blue"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials by Top Category */}
          <Card title="Materials by Top Category">
            <div className="space-y-3">
              {materialsByType.length === 0 ? (
                <p className="text-sm text-[#94a3b8] text-center py-4">No data</p>
              ) : (
                materialsByType.map(([type, count], index) => {
                  const maxCount = Math.max(...materialsByType.map(([, c]) => c));
                  const percentage = (count / maxCount) * 100;
                  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-[#64748b] truncate">{type}</div>
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
                })
              )}
            </div>
          </Card>

          {/* Test Status Distribution */}
          <Card title="Material Test Status">
            <div className="space-y-3">
              {materialsByTestStatus.length === 0 ? (
                <p className="text-sm text-[#94a3b8] text-center py-4">No test data</p>
              ) : (
                materialsByTestStatus.map(([status, count]) => {
                  const maxCount = Math.max(...materialsByTestStatus.map(([, c]) => c));
                  const percentage = (count / maxCount) * 100;
                  const colorMap: Record<string, string> = {
                    'Pass': '#22c55e',
                    'Conditional Tolerance': '#f59e0b',
                    'Fail': '#ef4444',
                  };
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-[#64748b]">{status}</div>
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
                })
              )}
            </div>
          </Card>
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials by Supplier */}
          <Card title="Materials by Supplier">
            <div className="space-y-3">
              {Object.entries(stats.materialsBySupplier)
                .sort(([, a], [, b]) => b - a)
                .map(([supplier, count], index) => {
                  const maxCount = Math.max(...Object.values(stats.materialsBySupplier));
                  const percentage = (count / maxCount) * 100;
                  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4'];
                  return (
                    <div key={supplier} className="flex items-center gap-3">
                      <div className="w-40 text-sm text-[#64748b] truncate">{supplier}</div>
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

          {/* MOQ Unit Distribution */}
          <Card title="Material MOQ Unit">
            <div className="space-y-3">
              {materialsByMOQ.length === 0 ? (
                <p className="text-sm text-[#94a3b8] text-center py-4">No data</p>
              ) : (
                materialsByMOQ.map(([unit, count]) => {
                  const maxCount = Math.max(...materialsByMOQ.map(([, c]) => c));
                  const percentage = (count / maxCount) * 100;
                  const colorMap: Record<string, string> = {
                    'meter': '#3b82f6',
                    'kg': '#22c55e',
                  };
                  return (
                    <div key={unit} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-[#64748b]">{unit}</div>
                      <div className="flex-1 h-6 bg-[#f0f4f8] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: colorMap[unit] || '#94a3b8',
                          }}
                        />
                      </div>
                      <div className="w-8 text-sm font-medium text-[#0f172a]">{count}</div>
                    </div>
                  );
                })
              )}
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
                        Supplier
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#64748b] uppercase tracking-wide">
                        Test Status
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
                          {material.supplierName || material.supplier}
                        </td>
                        <td className="py-3 px-4">
                          <TestStatusBadge status={material.testStatus} />
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

// Test Status Badge Component
function TestStatusBadge({ status }: { status?: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    'Pass': { bg: 'bg-[#22c55e]/10', text: 'text-[#22c55e]', icon: <CheckCircle className="w-3 h-3" /> },
    'Conditional Tolerance': { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', icon: <AlertTriangle className="w-3 h-3" /> },
    'Fail': { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', icon: <XCircle className="w-3 h-3" /> },
  };

  if (!status) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#94a3b8]/10 text-[#94a3b8]">
        N/A
      </span>
    );
  }

  const { bg, text, icon } = config[status] || config['Pass'];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${bg} ${text}`}>
      {icon}
      {status}
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
      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8fafc] transition-colors text-left border border-[#e2e8f0] hover:border-[#cbd5e1]"
    >
      <div className="w-10 h-10 rounded-lg bg-[#f0f4f8] flex items-center justify-center text-[#3b82f6] flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-[#0f172a]">{label}</p>
        <p className="text-xs text-[#94a3b8] mt-0.5">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-[#94a3b8] flex-shrink-0 mt-2" />
    </button>
  );
}
