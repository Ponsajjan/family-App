import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, CloseIcon } from '@/utils/Icons';

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    values: string[];
    onChange: (values: string[]) => void;
    className?: string;
}

export default function MultiSelectDropdown({ label, options, values, onChange, className = '' }: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

    const toggleOption = (opt: string) => {
        if (values.includes(opt)) {
            onChange(values.filter(v => v !== opt));
        } else {
            onChange([...values, opt]);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    const displayValue = values.length === 0
        ? `All ${label}s`
        : values.length === 1
            ? values[0]
            : `${values.length} Selected`;

    return (
        <div className={`block text-sm font-medium opacity-75 ${className}`} ref={dropdownRef}>
            <div className="pb-0.5">{label}</div>
            <div className="relative group text-text_color">
                <div
                    role="button"
                    tabIndex={0}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-label={`${label}: ${displayValue}`}
                    className="w-full p-2 pr-12 border border-border_color rounded-md bg-field_color text-sm focus-within:border-border_active outline-none cursor-pointer flex items-center min-h-[38px]"
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); } }}
                >
                    <span className="truncate">{displayValue}</span>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center z-10">
                    {values.length > 0 ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:field_hover rounded-full transition-colors flex items-center justify-center text-text_color/50 hover:text-text_color"
                            aria-label={`Clear ${label}`}
                        >
                            <div className="scale-75 origin-center">
                                <CloseIcon />
                            </div>
                        </button>
                    ) : (
                        <div className="pointer-events-none opacity-50 mr-1.5 transform transition-transform duration-200" style={{ rotate: isOpen ? '180deg' : '0deg' }}>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>

                {isOpen && (
                    <div
                        role="listbox"
                        aria-label={`${label} options`}
                        aria-multiselectable="true"
                        className="absolute z-50 w-full mt-1 bg-main_background border border-border_color rounded-md shadow-lg max-h-64 flex flex-col"
                    >
                        <div className="p-2 border-b border-border_color sticky top-0 bg-main_background z-10 rounded-t-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-1.5 pl-8 text-sm border border-border_color rounded-md bg-field_color outline-none focus:border-border_active"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Search ${label} options`}
                                />
                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 scale-75" aria-hidden="true">
                                    <SearchIcon />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-y-auto p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="p-2 text-center text-sm opacity-50">No options found</div>
                            ) : (
                                filteredOptions.map(opt => (
                                    <label
                                        key={opt}
                                        role="option"
                                        aria-selected={values.includes(opt)}
                                        className="flex items-center p-2 md:hover:bg-field_color rounded-md cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={values.includes(opt)}
                                            onChange={() => toggleOption(opt)}
                                            className="mr-2 rounded border-border_color text-border_active focus:ring-border_active accent-border_active"
                                            aria-label={opt}
                                        />
                                        <span className="truncate">{opt}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
