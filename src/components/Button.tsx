'use client'

import Link from 'next/link';
import { useFormStatus } from 'react-dom';

interface ButtonProps {
    buttonText: string;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    loadingText?: string;
}
export const ButtonSolid = ({ buttonText, type = 'button', isLoading = false, disabled = false, onClick, className, loadingText = "Loading..." }: ButtonProps) => {
    const { pending } = useFormStatus()
    const isBusy = isLoading || pending;
    return (
        <button
            type={type}
            disabled={isBusy || disabled}
            onClick={onClick}
            aria-busy={isBusy}
            aria-disabled={isBusy || disabled}
            className={`bg-accent_color text-accent_contrast h-10 md:h-12 text-base md:text-lg shadow-md rounded-md font-medium  ${(isLoading || disabled) ? 'opacity-70 cursor-not-allowed' : ''} active:shadow-none cursor-pointer ${className}`}
        >
            {isBusy ? loadingText : buttonText}
        </button>
    );
};

export const ButtonOutline = ({ buttonText, type, isLoading = false, disabled = false, onClick, className, loadingText = "Loading..." }: ButtonProps) => {
    const { pending } = useFormStatus()
    const isBusy = isLoading || pending;
    return (
        <button
            type={type}
            disabled={isBusy || disabled}
            onClick={onClick}
            aria-busy={isBusy}
            aria-disabled={isBusy || disabled}
            className={`min-w-[9.375rem] h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg md:leading-none shadow-md rounded-md font-medium text-text_color bg-field_color border-2 border-accent_color  ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''} active:shadow-none cursor-pointer ${className}`}
        >
            {isBusy ? loadingText : buttonText}
        </button>
    );
};

interface LinkButtonProps {
    buttonText: string;
    isLoading?: boolean;
    disabled?: boolean;
    linkto?: string;
    className?: string;
    loadingText?: string;
}
export const LinkButtonSolid = ({ buttonText, linkto = '', isLoading = false, disabled = false, className, loadingText = "Loading..." }: LinkButtonProps) => {
    const isDisabled = isLoading || disabled;
    const commonClasses = `block text-center min-w-[9.375rem] bg-accent_color text-accent_contrast h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg shadow-md rounded-md font-medium ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none select-none' : 'active:shadow-none cursor-pointer'} ${className || ''}`;

    if (isDisabled) {
        return (
            <span className={commonClasses} aria-disabled="true" role="link">
                {isLoading ? loadingText : buttonText}
            </span>
        );
    }

    return (
        <Link
            href={linkto}
            className={commonClasses}
        >
            {buttonText}
        </Link>
    );
};

export const LinkButtonOutline = ({ buttonText, linkto = '', isLoading = false, disabled = false, className, loadingText = "Loading..." }: LinkButtonProps) => {
    const isDisabled = isLoading || disabled;
    const commonClasses = `block text-center min-w-[9.375rem] h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg md:leading-none shadow-md rounded-md font-medium text-text_color bg-field_color border-2 border-accent_color ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none select-none' : 'active:shadow-none cursor-pointer'} ${className || ''}`;

    if (isDisabled) {
        return (
            <span className={commonClasses} aria-disabled="true" role="link">
                {isLoading ? loadingText : buttonText}
            </span>
        );
    }

    return (
        <Link
            href={linkto}
            className={commonClasses}
        >
            {buttonText}
        </Link>
    );
};