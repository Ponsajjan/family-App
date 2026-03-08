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
    return (
        <button
            type={type}
            disabled={isLoading || disabled || pending}
            onClick={onClick}
            className={`bg-accent_color text-accent_contrast h-11 md:h-13 px-6 text-base shadow-lg shadow-accent_color/20 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] hover:brightness-110 active:shadow-sm ${(isLoading || disabled) ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'} ${className}`}
        >
            {(isLoading || pending) ? (
                <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-accent_contrast/30 border-t-accent_contrast rounded-full animate-spin" />
                    {loadingText}
                </div>
            ) : buttonText}
        </button>
    );
};

export const ButtonOutline = ({ buttonText, type, isLoading = false, disabled = false, onClick, className, loadingText = "Loading..." }: ButtonProps) => {
    const { pending } = useFormStatus()
    return (
        <button
            type={type}
            disabled={isLoading || disabled || pending}
            onClick={onClick}
            className={`min-w-[9.375rem] h-11 md:h-13 px-6 text-base font-semibold shadow-sm rounded-xl text-text_color glass-dark border border-border_color transition-all duration-200 active:scale-[0.98] hover:bg-field_hover active:shadow-none ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            {(isLoading || pending) ? loadingText : buttonText}
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
    const commonClasses = `flex items-center justify-center min-w-[9.375rem] bg-accent_color text-accent_contrast h-11 md:h-13 px-6 text-base shadow-lg shadow-accent_color/20 rounded-xl font-semibold transition-all duration-200 ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'active:scale-[0.98] hover:brightness-110 cursor-pointer'} ${className || ''}`;

    if (isDisabled) {
        return (
            <span className={commonClasses}>
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
    const commonClasses = `flex items-center justify-center min-w-[9.375rem] h-11 md:h-13 px-6 text-base font-semibold shadow-sm rounded-xl text-text_color glass-dark border border-border_color transition-all duration-200 ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'active:scale-[0.98] hover:bg-field_hover cursor-pointer'} ${className || ''}`;

    if (isDisabled) {
        return (
            <span className={commonClasses}>
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
