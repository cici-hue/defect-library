import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchableSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  allowCustomInput?: boolean;
}

export function SearchableSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  className,
  allowCustomInput = true,
}: SearchableSelectProps) {
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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allowCustomInput && searchQuery && filteredOptions.length === 0) {
      // 允许自定义输入
      onChange(searchQuery);
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
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
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-sm text-[#1e293b] placeholder:text-[#94a3b8]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <span
              className={cn(
                'text-sm truncate',
                value ? 'text-[#1e293b]' : 'text-[#94a3b8]'
              )}
            >
              {value || placeholder}
            </span>
            <div className="flex items-center gap-1">
              {value && (
                <button
                  onClick={handleClear}
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'px-3 py-2 text-sm cursor-pointer transition-colors',
                    option === value
                      ? 'bg-[#3b82f6]/10 text-[#3b82f6] font-medium'
                      : 'text-[#1e293b] hover:bg-[#f1f5f9]'
                  )}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-4 text-sm text-[#94a3b8] text-center">
              {allowCustomInput ? (
                <div>
                  <p>No matching options</p>
                  <p className="text-xs mt-1 text-[#3b82f6]">
                    Press Enter to use &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                'No matching options'
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
