import React from 'react';

const Radio = ({
//   checked,
//   value,
//   onChange,
//   name,
  label = '',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`flex items-center space-x-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="radio"
        // checked={checked}
        // value={value}
        // onChange={onChange}
        // name={name}
        disabled={disabled}
        className={`border border-border_active rounded-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        {...props}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

export default Radio;
