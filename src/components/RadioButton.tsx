import React, { InputHTMLAttributes } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  label = '',
  disabled = false,
  className = '',
  ...restProps
}) => {
  return (
    <label className={`flex items-center justify-center space-x-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      <input
        type="radio"
        disabled={disabled}
        className={`appearance-none rounded-full w-3 h-3 outline outline-1 outline-[--text-color] outline-offset-2 bg-[--main-background] checked:bg-gray-900 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        {...restProps}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

export default Radio;
