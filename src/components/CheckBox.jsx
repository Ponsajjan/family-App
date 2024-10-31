import React from 'react';

const Checkbox = ({ 
  // checked,
  // value,
  // onChange,
  className = '',
  label = '',
  name,
  ...props
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        // checked={checked}
        // onChange={onChange}
        // value={value}
        name={name}
        className={`bg-main_background border border-border_active rounded-md ${className}`}
        {...props}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

export default Checkbox;
