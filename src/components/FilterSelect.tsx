import React from 'react';
import { CloseIcon } from "@/utils/Icons";

function FilterSelect({ label, name, value, options, onChange, disabled = false, className }: any) {
    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onChange) {
            onChange({ target: { name, value: "" } } as any);
        }
    };

    return (
        <label className={`block text-sm font-medium opacity-75 ${className}`}>
            <div className="pb-0.5">{label}</div>
            <div className="relative group">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    aria-label={label}
                    className="w-full p-2 pr-12 border border-border_color rounded-md bg-field_color text-sm focus:border-border_active outline-none disabled:opacity-70 disabled:cursor-not-allowed appearance-none cursor-pointer"
                >
                    <option value="">All {label}s</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    {value && !disabled ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center text-text_color/50 hover:text-text_color"
                            aria-label={`Clear ${label}`}
                        >
                            <div className="scale-75 origin-center">
                                <CloseIcon />
                            </div>
                        </button>
                    ) : (
                        <div className="pointer-events-none opacity-50 mr-1.5">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </label>
    );
}

export default FilterSelect;
