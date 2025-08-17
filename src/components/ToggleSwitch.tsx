import React from 'react'

interface ToggleSwitchProps {
  isActive: boolean;
  onChange?: () => void;
  className?: string;
}

function ToggleSwitch({ isActive, onChange, className }: ToggleSwitchProps) {
  return (
    <label className={`relative inline-flex items-center cursor-pointer mx-4 ${className}`}>
      <input 
        className="sr-only peer p-4" 
        type="checkbox"
        readOnly={onChange === undefined}
        checked={isActive}
        onChange={onChange}
      />
      <div className={`
        peer ring-2 ring-gray-600 rounded-full outline-none duration-300 after:duration-500 
        w-6 h-2 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute
        after:outline-none after:h-4 after:w-4 after:bg-main_background after:top-1/2 
        after:-translate-y-1/2 after:-left-1 after:flex after:justify-center after:items-center 
        after:border-2 after:border-gray-600 
        ${isActive ? 'after:translate-x-4' : 'after:translate-x-0'}
      `} />
    </label>
  )
}

export default ToggleSwitch