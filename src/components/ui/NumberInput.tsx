import React from 'react';
import { cn } from '../../lib/utils';

interface NumberInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder = 'Enter number...',
  required = false,
  disabled = false,
  className,
  min,
  max,
  step = 1,
  suffix,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 允许空值或有效数字
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (value !== '') {
      let numValue = parseFloat(value as string);
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          numValue = min;
        }
        if (max !== undefined && numValue > max) {
          numValue = max;
        }
        onChange(numValue.toString());
      }
    }
  };

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2.5 bg-white border rounded-lg text-sm',
            'placeholder:text-[#94a3b8]',
            'focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20',
            'transition-all duration-150',
            disabled && 'bg-[#f1f5f9] cursor-not-allowed',
            suffix && 'pr-12'
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#94a3b8]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
