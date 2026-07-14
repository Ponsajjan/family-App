import React, { useState, useEffect, useId, useRef } from 'react';
import ReactDom from 'react-dom';
import { SearchIcon, CloseIcon } from '@/utils/Icons';
import Checkbox from '@/components/CheckBox';
import { ButtonSolid } from '@/components/Button';
import { useInfiniteScroll } from '@/utils/useInfiniteScroll';

interface MultiSelectPopupProps {
    label: string;
    options: string[];
    values: string[];
    onChange: (values: string[]) => void;
    className?: string;
    loading?: boolean;
    hasMore?: boolean;
    loadingMore?: boolean;
    loadMoreError?: boolean;
    onLoadMore?: () => void;
    onSearchChange?: (search: string) => void;
}

export default function MultiSelectPopup({ label, options, values, onChange, className = '', loading = false, hasMore = false, loadingMore = false, loadMoreError = false, onLoadMore, onSearchChange }: MultiSelectPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
    const titleId = useId();
    const searchId = useId();
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setPortalNode(document.getElementById('portal') as HTMLElement);
    }, []);

    // When onSearchChange is provided, the parent already filters options server-side.
    const filteredOptions = onSearchChange ? options : options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onSearchChange?.(value);
    };

    useInfiniteScroll(listRef, loading || loadingMore, hasMore && !loadMoreError, () => onLoadMore?.(), 100);

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

    const handleRemoveOption = (e: React.MouseEvent, opt: string) => {
        e.stopPropagation();
        onChange(values.filter(v => v !== opt));
    };

    return (
        <div className={`block text-sm font-medium ${className}`}>
            <div className="pb-0.5">{label}</div>
            <div className="relative group text-text_color">
                <div
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    aria-label={`Select ${label}${values.length > 0 ? `, ${values.length} selected` : ''}`}
                    className="w-full p-1.5 pr-10 border border-border_color rounded-md bg-field_color text-sm focus-within:border-border_active outline-none cursor-pointer flex flex-wrap items-center gap-1.5 min-h-[38px]"
                    onClick={() => setIsOpen(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(true); } }}
                >
                    {values.length === 0 ? (
                        <span className="px-1 truncate text-text_color/70">All {label}s</span>
                    ) : (
                        values.map(opt => (
                            <span
                                key={opt}
                                className="flex items-center gap-1 pl-2 pr-1 py-1 bg-main_background border border-border_color rounded-md text-xs font-medium truncate max-w-full shadow-sm"
                            >
                                <span className="truncate max-w-[150px]">{opt}</span>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => handleRemoveOption(e, opt)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRemoveOption(e as any, opt); } }}
                                    className="hover:bg-black/10 rounded-full p-0.5 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                                    aria-label={`Remove ${opt}`}
                                >
                                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </span>
                        ))
                    )}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center z-10">
                    {values.length > 0 ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center text-text_color/50 hover:text-text_color"
                            aria-label={`Clear all ${label} selections`}
                        >
                            <div className="scale-75 origin-center" aria-hidden="true">
                                <CloseIcon />
                            </div>
                        </button>
                    ) : (
                        <div className="pointer-events-none opacity-80 mr-1.5" aria-hidden="true">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>

                {isOpen && portalNode && ReactDom.createPortal(
                    <div className='fixed z-[110] inset-0 overflow-hidden' role="dialog" aria-modal="true" aria-labelledby={titleId}>
                        <div
                            onClick={() => setIsOpen(false)}
                            className={`xl:pl-40 xl:mt-12 bg-gray-500/60 absolute max-w-[162.5rem] mx-auto inset-0 backdrop-blur-sm`}
                            aria-hidden="true"
                        />
                        <div className="xl:pl-40 w-full h-full max-w-[162.5rem] px-2 mx-auto relative z-20 pointer-events-none">
                            <div className={`w-full h-full top-full left-0 right-0 static flex flex-col justify-center items-center transition-all duration-500 ease-in-out`}>
                                <div className={`
                                    w-full max-h-[80vh] md:max-h-[70%] text-text_color overflow-hidden cursor-default
                                    md:max-w-[28.125rem] mx-auto bg-main_background
                                    rounded-lg text-left shadow-xl p-4 md:px-6 md:py-4 pointer-events-auto flex flex-col
                                `}>
                                    <div className="flex justify-between items-center mb-4 border-b border-border_color pb-1">
                                        <h2 id={titleId} className="text-xl font-semibold">{label}</h2>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            aria-label={`Close ${label} selection`}
                                            className='border border-border_color hover:bg-field_color rounded-md m-2 cursor-pointer'
                                        >
                                            <CloseIcon aria-hidden="true" />
                                        </button>
                                    </div>

                                    <div className="mb-2 relative shrink-0">
                                        <label htmlFor={searchId} className="sr-only">Search {label}</label>
                                        <input
                                            id={searchId}
                                            type="text"
                                            placeholder="Search..."
                                            value={search}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="w-full p-2 pl-8 text-sm border border-border_color rounded-md bg-field_color outline-none focus:border-border_active"
                                            aria-label={`Search ${label} options`}
                                        />
                                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 scale-75" aria-hidden="true">
                                            <SearchIcon />
                                        </div>
                                    </div>

                                    <div
                                        ref={listRef}
                                        role="listbox"
                                        aria-label={`${label} options`}
                                        aria-multiselectable="true"
                                        className="space-y-1 overflow-y-auto flex-1 min-h-0 pr-1"
                                    >
                                        {loading ? (
                                            <div role="status" aria-live="polite" className="text-center py-4 opacity-70">Loading...</div>
                                        ) : (
                                            <>
                                                {filteredOptions.map(opt => (
                                                    <div
                                                        key={opt}
                                                        role="option"
                                                        aria-selected={values.includes(opt)}
                                                        className={`flex items-center p-2 md:p-2.5 rounded-md transition-all duration-200 cursor-pointer ${values.includes(opt) ? 'bg-field_hover' : 'hover:bg-field_hover'
                                                            }`}
                                                        onClick={() => toggleOption(opt)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOption(opt); } }}
                                                        tabIndex={0}
                                                    >
                                                        <div className="pointer-events-none w-full">
                                                            <Checkbox
                                                                checked={values.includes(opt)}
                                                                readOnly={true}
                                                                label={opt}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                {filteredOptions.length === 0 && !loadingMore && !loadMoreError && (
                                                    <div className="text-center py-4 opacity-70">No options found.</div>
                                                )}
                                                {loadingMore && (
                                                    <div role="status" aria-live="polite" className="text-center py-3 opacity-70 text-xs">Loading...</div>
                                                )}
                                                {loadMoreError && (
                                                    <div className="flex items-center justify-between gap-2 px-2 py-2 text-xs text-red-500">
                                                        <span>Failed to load {filteredOptions.length === 0 ? '' : 'more '}options.</span>
                                                        <button type="button" onClick={() => onLoadMore?.()} className="underline shrink-0">Retry</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-2 pt-4 border-t border-border_color flex justify-between items-center shrink-0">
                                        <ButtonSolid onClick={() => setIsOpen(false)} buttonText={values.length > 0 ? `${values.length} Selected` : 'Cancel'} className='w-full' />
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
