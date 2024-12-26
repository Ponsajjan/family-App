import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  name?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  className = '',
  label = '',
  name = '',
  ...restProps
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        className={`bg-main_background border border-border_active rounded-md ${className}`}
        {...restProps}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

export default Checkbox;
