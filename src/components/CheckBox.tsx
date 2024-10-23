import React, { useState } from "react";

interface CustomCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CustomCheckboxProps> = ({ checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleCheckboxChange = () => {
    const updatedChecked = !isChecked;
    setIsChecked(updatedChecked);
    if (onChange) {
      onChange(updatedChecked);
    }
  };

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div
        className={`w-4 h-4 border-2 border-border_color rounded-sm flex justify-center items-center ${
          isChecked ? "bg-accent_color" : "bg-main_background"
        }`}
        onClick={handleCheckboxChange}
      >
        {isChecked && (
          <svg className="w-3 h-3 text-accent_contrast" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
