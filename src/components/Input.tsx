import React, { InputHTMLAttributes, useId } from 'react';

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
    id: propId,
    required,
    ...restProps
}) => {
  const generatedId = useId();
  const inputId = propId || (label ? generatedId : undefined);
  const errorId = error ? `${generatedId}-error` : undefined;

  return (
    <>
      <label className='w-full' htmlFor={inputId}>
          {label && <span className="text-sm font-medium">{label}</span>}
          {(label && showOptional) && <span className='font-normal opacity-45 pl-2 text-sm'>(Optional)</span>}
          <input
              id={inputId}
              type={type}
              placeholder={placeholder}
              name={label || restProps.name}
              required={required}
              aria-required={required}
              aria-invalid={!!error}
              aria-describedby={errorId}
              className={`p-2 border border-border_color outline-none focus:border-border_active text-sm rounded-md w-full bg-field_color disabled:cursor-not-allowed ${className}`}
              {...restProps}
          />
      </label>
      {error && <p id={errorId} role="alert" className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  )
}

export default Input
