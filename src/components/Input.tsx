import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  showOptional?: boolean;
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  showOptional = false,
  label = "",
  type = "text",
  placeholder = "",
  className = "",
  error = "",
  ...restProps
}) => {
  return (
    <div className='w-full flex flex-col gap-1.5'>
      {(label || showOptional) && (
        <div className="flex items-center gap-2 px-1">
          {label && <span className="text-sm font-semibold text-text_color/80 tracking-tight">{label}</span>}
          {showOptional && <span className='text-xs font-normal opacity-40'>(Optional)</span>}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        name={label}
        className={`
            w-full h-11 px-4 text-sm rounded-xl outline-none transition-all duration-200
            glass border border-border_color/40
            focus:border-accent_color/50 focus:ring-4 focus:ring-accent_color/10
            placeholder:text-text_color/30
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 bg-red-50/10' : ''}
            ${className}
          `}
        {...restProps}
      />
      {error && <p className="text-red-500 text-xs font-medium px-1 mt-0.5 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  )
}

export default Input
