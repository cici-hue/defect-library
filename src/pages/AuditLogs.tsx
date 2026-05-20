import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { SearchInput } from '../components/ui/FormElements';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
} from 'lucide-react';

export function AuditLogs() {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // Filter logs
  const filteredLogs = auditLogs.filter(log =>
    log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="w-4 h-4 text-[#22c55e]" />;
      case 'update':
        return <Edit className="w-4 h-4 text-[#3b82f6]" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-[#ef4444]" />;
      case 'view':
        return <Eye className="w-4 h-4 text-[#94a3b8]" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionBadge = (action: string) => {
    const config: Record<string, { bg: string; text: string }> = {
      create: { bg: 'bg-[#22c55e]/10', text: 'text-[#22c55e]' },
      update: { bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]' },
      delete: { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]' },
      view: { bg: 'bg-[#94a3b8]/10', text: 'text-[#94a3b8]' },
    };
    return config[action] || config.view;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen">
      <Header title="Audit Logs" subtitle="v1.0" />

      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <Card className="!p-4">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by entity, user, or action..."
          />
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Logs" value={auditLogs.length} />
          <StatCard
            title="Creates"
            value={auditLogs.filter(l => l.action === 'create').length}
            color="green"
          />
          <StatCard
            title="Updates"
            value={auditLogs.filter(l => l.action === 'update').length}
            color="blue"
          />
          <StatCard
            title="Deletes"
            value={auditLogs.filter(l => l.action === 'delete').length}
            color="red"
          />
        </div>

        {/* Logs List */}
        <Card className="!p-0 overflow-hidden">
          <div className="divide-y divide-[#e2e8f0]">
            {filteredLogs.map((log) => {
              const { bg, text } = getActionBadge(log.action);
              const isExpanded = expandedLog === log.id;

              return (
                <div key={log.id} className="hover:bg-[#f8fafc] transition-colors">
                  <button
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    className="w-full flex items-center gap-4 p-4 text-left"
                  >
                    {/* Action Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
                      {getActionIcon(log.action)}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
                          {log.action.toUpperCase()}
                        </span>
                        <span className="text-sm text-[#0f172a] font-medium truncate">
                          {log.entityName}
                        </span>
                      </div>
                      <p className="text-xs text-[#94a3b8] mt-1">
                        {log.entityType} • {log.userName}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-4 text-right">
                      <span className="text-xs text-[#94a3b8] hidden md:block">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#64748b]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#64748b]" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-[72px]">
                      <div className="bg-[#f8fafc] rounded-lg p-4 space-y-3">
                        <DetailRow label="Log ID" value={log.id} />
                        <DetailRow label="Entity Type" value={log.entityType} />
                        <DetailRow label="Entity ID" value={log.entityId} />
                        <DetailRow label="User" value={`${log.userName} (${log.userId})`} />
                        <DetailRow label="Timestamp" value={formatTimestamp(log.timestamp)} />

                        {Object.keys(log.changes).length > 0 && (
                          <div className="pt-3 border-t border-[#e2e8f0]">
                            <p className="text-xs font-medium text-[#64748b] uppercase mb-2">
                              Changes
                            </p>
                            <div className="space-y-2">
                              {Object.entries(log.changes).map(([field, { old: oldVal, new: newVal }]) => (
                                <div key={field} className="flex items-center gap-2 text-sm">
                                  <span className="text-[#64748b]">{field}:</span>
                                  <span className="text-[#ef4444] line-through">{String(oldVal)}</span>
                                  <span className="text-[#64748b]">→</span>
                                  <span className="text-[#22c55e]">{String(newVal)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredLogs.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#0f172a] mb-2">No logs found</h3>
              <p className="text-sm text-[#64748b]">
                {searchQuery ? 'Try adjusting your search criteria' : 'Activity logs will appear here'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  color = 'default',
}: {
  title: string;
  value: number;
  color?: 'default' | 'green' | 'blue' | 'red';
}) {
  const colorMap = {
    default: 'text-[#0f172a]',
    green: 'text-[#22c55e]',
    blue: 'text-[#3b82f6]',
    red: 'text-[#ef4444]',
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.08)] p-4">
      <p className="text-sm text-[#64748b]">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
    </div>
  );
}

// Detail Row Component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#64748b]">{label}:</span>
      <span className="text-[#0f172a] font-medium">{value}</span>
    </div>
  );
}