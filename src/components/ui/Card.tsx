import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ title, children, className = '', noPadding = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.08)] ${
        noPadding ? '' : 'p-6'
      } ${className}`}
    >
      {title && (
        <h2 className="text-lg font-bold text-[#1a3a5c] mb-4 pb-2 border-b border-[#e2e8f0]">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-[#3b82f6]/10 text-[#3b82f6]',
    green: 'bg-[#22c55e]/10 text-[#22c55e]',
    yellow: 'bg-[#f59e0b]/10 text-[#f59e0b]',
    red: 'bg-[#ef4444]/10 text-[#ef4444]',
    purple: 'bg-[#8b5cf6]/10 text-[#8b5cf6]',
  };

  const changeColorClasses = {
    positive: 'text-[#22c55e]',
    negative: 'text-[#ef4444]',
    neutral: 'text-[#64748b]',
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.08)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#64748b] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${changeColorClasses[changeType]}`}>{change}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}