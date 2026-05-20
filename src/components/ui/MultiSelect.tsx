import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MultiSelectProps {
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  label,
  values,
  options,
  onChange,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 过滤选项
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 当打开下拉框时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  const handleRemove = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter((v) => v !== valueToRemove));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={cn(
          'relative flex items-center w-full min-h-[42px] px-3 py-2',
          'bg-white border rounded-lg cursor-pointer',
          'transition-all duration-150',
          isOpen
            ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/20'
            : 'border-[#e2e8f0] hover:border-[#94a3b8]',
          disabled && 'bg-[#f1f5f9] cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <div className="flex items-center flex-1 gap-2">
            <Search className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search options..."
              className="flex-1 bg-transparent outline-none text-sm text-[#1e293b] placeholder:text-[#94a3b8]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1 gap-2">
            <div className="flex flex-wrap gap-1 flex-1">
              {values.length > 0 ? (
                values.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#3b82f6]/10 text-[#3b82f6] text-xs rounded-full"
                  >
                    {value}
                    <button
                      onClick={(e) => handleRemove(value, e)}
                      className="hover:bg-[#3b82f6]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-sm text-[#94a3b8]">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {values.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-0.5 hover:bg-[#f1f5f9] rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-[#94a3b8]" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[#94a3b8] transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* 下拉选项列表 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg max-h-72 overflow-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => {
                const isSelected = values.includes(option);
                return (
                  <li
                    key={index}
                    onClick={() => handleToggle(option)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                        : 'text-[#1e293b] hover:bg-[#f1f5f9]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                        isSelected
                          ? 'bg-[#3b82f6] border-[#3b82f6]'
                          : 'border-[#cbd5e1]'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn(isSelected && 'font-medium')}>{option}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-4 text-sm text-[#94a3b8] text-center">
              No matching options
            </div>
          )}
          {values.length > 0 && (
            <div className="border-t border-[#e2e8f0] px-3 py-2 bg-[#f8fafc]">
              <span className="text-xs text-[#64748b]">
                {values.length} item{values.length > 1 ? 's' : ''} selected
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
