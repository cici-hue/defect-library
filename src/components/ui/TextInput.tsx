import React from 'react';
import { cn } from '../../lib/utils';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder = 'Enter text...',
  required = false,
  disabled = false,
  className,
  multiline = false,
  rows = 3,
}: TextInputProps) {
  const inputClasses = cn(
    'w-full px-3 py-2.5 bg-white border rounded-lg text-sm',
    'placeholder:text-[#94a3b8]',
    'focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20',
    'transition-all duration-150',
    disabled && 'bg-[#f1f5f9] cursor-not-allowed'
  );

  return (
    <div className={cn('relative', className)}>
      <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(inputClasses, 'resize-none min-h-[80px]')}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}
    </div>
  );
}
