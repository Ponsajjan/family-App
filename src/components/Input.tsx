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
    <>
      <label className='w-full'>
          {label && <span className="text-sm font-medium" >{label}</span>}
          {(label && showOptional) && <span className='font-normal opacity-45 pl-2 text-sm'>(Optional)</span>}
          <input
              type={type}
              placeholder={placeholder}
              name={label}
              className={`p-2 border border-border_color outline-none focus:border-border_active text-sm rounded-md w-full bg-field_color disabled:cursor-not-allowed ${className}`}
              {...restProps}
          />
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  )
}

export default Input
