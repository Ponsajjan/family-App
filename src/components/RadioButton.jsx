import React from 'react';

const Radio = ({
//   checked,
//   value,
//   onChange,
//   name,
  label = '',
  className = '',
  ...props
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        // checked={checked}
        // value={value}
        // onChange={onChange}
        // name={name}
        className={`border border-border_active rounded-full ${className}`}
        {...props}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

export default Radio;
