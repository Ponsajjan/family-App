import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { SearchIcon, CloseIcon } from '@/utils/Icons';
import Radio from '@/components/RadioButton';

interface SingleSelectPopupProps {
    label: string;
    placeholder?: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
}

export default function SingleSelectPopup({ label, placeholder, options, value, onChange, className = '', disabled = false, loading = false }: SingleSelectPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalNode(document.getElementById('portal') as HTMLElement);
    }, []);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

    const handleSelectOption = (opt: string) => {
        onChange(opt);
        setIsOpen(false);
        setSearch(''); // Clear search on select
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className={`block text-sm font-medium ${className}`}>
            <div className="pb-0.5">{label}</div>
            <div className={`relative group text-text_color ${disabled ? 'pointer-events-none' : ''}`}>
                <div
                    className={`w-full p-2 pr-12 border border-border_color rounded-md bg-field_color text-sm focus-within:border-border_active outline-none flex items-center min-h-[38px] ${disabled ? 'bg-field_hover/35 cursor-not-allowed' : (!disabled && !loading && options.length === 0) ? 'bg-field_hover/35 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !disabled && (loading || options.length > 0) && setIsOpen(true)}
                >
                    {value === ''
                        ? <span className={`truncate ${disabled || (!disabled && !loading && options.length === 0) ? 'text-text_color/50' : 'text-text_color/70'}`}>
                            {!disabled && !loading && options.length === 0 ? 'No options available' : placeholder || `All ${label}s`}
                        </span>
                        : <span className="truncate">{value}</span>}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center z-10">
                    {value !== '' ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={disabled}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center text-text_color/50 hover:text-text_color disabled:opacity-50"
                            aria-label={`Clear ${label}`}
                        >
                            <div className="scale-75 origin-center">
                                <CloseIcon />
                            </div>
                        </button>
                    ) : (
                        <div className={`pointer-events-none ${disabled ? 'opacity-40' : 'opacity-80'} mr-1.5`}>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>

                {isOpen && portalNode && !disabled && ReactDom.createPortal(
                    <div className='fixed z-[110] inset-0 overflow-hidden'>
                        <div
                            onClick={() => setIsOpen(false)}
                            className={`xl:pl-40 xl:mt-12 bg-gray-500/60 absolute max-w-[162.5rem] mx-auto inset-0 backdrop-blur-sm`}
                        />
                        <div className="xl:pl-40 w-full h-full max-w-[162.5rem] px-2 mx-auto relative z-20 pointer-events-none">
                            <div className={`w-full h-full top-full left-0 right-0 static flex flex-col justify-center items-center transition-all duration-500 ease-in-out`}>
                                <div className={`
                                    w-full max-h-[80vh] md:max-h-[70%] text-text_color overflow-hidden cursor-default
                                    md:max-w-[28.125rem] mx-auto bg-main_background 
                                    rounded-lg text-left shadow-xl p-4 md:px-6 md:py-4 pointer-events-auto flex flex-col
                                `}>
                                    <div className="flex justify-between items-center mb-4 border-b border-border_color pb-1">
                                        <h2 className="text-xl font-semibold">{label}</h2>
                                        <div onClick={() => setIsOpen(false)} className='border border-border_color hover:bg-field_color rounded-md m-2 cursor-pointer'>
                                            <CloseIcon />
                                        </div>
                                    </div>

                                    <div className="mb-2 relative shrink-0">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full p-2 pl-8 text-sm border border-border_color rounded-md bg-field_color outline-none focus:border-border_active"
                                        />
                                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 scale-75">
                                            <SearchIcon />
                                        </div>
                                    </div>

                                    <div className="space-y-1 overflow-y-auto flex-1 min-h-0 pr-1 pb-4">
                                        {loading ? (
                                            <div className="text-center py-4 opacity-70">Loading...</div>
                                        ) : filteredOptions.length > 0 ? (
                                            filteredOptions.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`flex items-center p-2 md:p-2.5 rounded-md transition-all duration-200 cursor-pointer hover:bg-field_hover ${value === opt && 'bg-field_hover'}`}
                                                    onClick={() => handleSelectOption(opt)}
                                                >
                                                    <div className="pointer-events-none w-full">
                                                        <Radio
                                                            checked={value === opt}
                                                            readOnly={true}
                                                            label={opt}
                                                            className="w-full !justify-start"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 opacity-70">No options found.</div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>,
                    portalNode
                )}
            </div>
        </div>
    );
}
