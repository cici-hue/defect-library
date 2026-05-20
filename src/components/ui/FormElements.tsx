import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { ChevronDown, Calendar, Upload, X, Search } from 'lucide-react';

// Base Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#0f172a]">
            {label}
            {required && <span className="text-[#ef4444] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm rounded-lg border bg-white
            border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8]
            focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]
            transition-colors duration-150
            ${error ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Select Component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#0f172a]">
            {label}
            {required && <span className="text-[#ef4444] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-3 py-2 text-sm rounded-lg border bg-white appearance-none
              border-[#e2e8f0] text-[#0f172a]
              focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]
              transition-colors duration-150 cursor-pointer
              ${error ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// TextArea Component
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#0f172a]">
            {label}
            {required && <span className="text-[#ef4444] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm rounded-lg border bg-white
            border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8]
            focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]
            transition-colors duration-150 resize-none
            ${error ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';

// DatePicker Component
interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#0f172a]">
            {label}
            {required && <span className="text-[#ef4444] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="date"
            className={`
              w-full px-3 py-2 text-sm rounded-lg border bg-white
              border-[#e2e8f0] text-[#0f172a]
              focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]
              transition-colors duration-150
              ${error ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' : ''}
              ${className}
            `}
            {...props}
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';

// Search Input Component
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
        <input
          ref={ref}
          type="text"
          className={`
            w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-white
            border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8]
            focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]
            transition-colors duration-150
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

// File Upload Component
interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList | null) => void;
}

export function FileUpload({ label, accept, multiple, onChange }: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.files);
    }
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-[#0f172a]">{label}</label>}
      <label className="block border-2 border-dashed border-[#e2e8f0] rounded-lg p-6 text-center cursor-pointer hover:border-[#3b82f6] hover:bg-[#f0f4f8]/50 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
        <p className="text-sm text-[#64748b]">
          <span className="text-[#3b82f6] font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-[#94a3b8] mt-1">
          {accept ? `${accept.toUpperCase()} files` : 'All files'} (max 10MB)
        </p>
      </label>
    </div>
  );
}

// Tag Input Component
interface TagInputProps {
  label?: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

export function TagInput({ label, tags, onAdd, onRemove, placeholder = 'Add tag...' }: TagInputProps) {
  const [input, setInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-[#0f172a]">{label}</label>}
      <div className="min-h-[42px] px-3 py-2 text-sm rounded-lg border border-[#e2e8f0] bg-white focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:border-[#3b82f6] transition-colors">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0f4f8] text-[#0f172a] rounded text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="hover:text-[#ef4444] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[80px] bg-transparent outline-none placeholder-[#94a3b8]"
          />
        </div>
      </div>
    </div>
  );
}

// Checkbox Component
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="w-4 h-4 rounded border-[#e2e8f0] text-[#3b82f6] focus:ring-[#3b82f6]/20 cursor-pointer"
          {...props}
        />
        <span className="text-sm text-[#0f172a]">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// Radio Group Component
interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({ label, name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-[#0f172a]">{label}</label>}
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="w-4 h-4 border-[#e2e8f0] text-[#3b82f6] focus:ring-[#3b82f6]/20 cursor-pointer"
            />
            <span className="text-sm text-[#0f172a]">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}