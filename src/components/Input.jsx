import React from 'react'

function Input({
    label = "",
    // value,
    type = "text",
    placeholder = "",
    // onChange,
    className = "",
    ...props
}) {
  return (
    <label className='w-full'>
        {label && <span className="text-sm font-medium" >{label}</span>}
        <input
            type={type}
            placeholder={placeholder}
            name={label}
            // value={value}
            // onChange={onChange}
            className={`p-2 border border-border_color outline-none focus:border-border_active text-sm rounded-md w-full bg-field_color ${className}`}
            {...props}
        />
    </label>
  )
}

export default Input
