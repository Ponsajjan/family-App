import React, { useId } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: React.ReactNode;
  name?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className = '',
  label = '',
  name = '',
  id: propId,
  ...restProps
}) => {
  const generatedId = useId();
  const inputId = propId || generatedId;

  return (
    <label className="flex items-center space-x-2 cursor-pointer" htmlFor={inputId}>
      <input
        id={inputId}
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
