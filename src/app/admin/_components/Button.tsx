import React from 'react';
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
export const ButtonSolid = ({ buttonText, type='button', isLoading = false, disabled = false, onClick, className, loadingText="Loading..."} : ButtonProps) => {
    const { pending } = useFormStatus()
    return (
        <button
        type={type}
        disabled={isLoading || disabled || pending}
        onClick={onClick}
        className={`min-w-[150px] bg-accent_color md:hover:bg-accent_color_hover text-accent_contrast h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-sm md:text-base hover:shadow-lg rounded-md font-medium whitespace-nowrap ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : 'active:shadow-none'} ${className}`}
        >
        {isLoading || pending ? loadingText : buttonText}
        </button>
    );
};

export const ButtonOutline = ({ buttonText, type, isLoading = false, disabled = false, onClick, className, loadingText="Loading..." } : ButtonProps) => {
    const { pending } = useFormStatus()
    return (
        <button
        type={type}
        disabled={isLoading || disabled || pending}
        onClick={onClick}
        className={`min-w-[150px] h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-sm md:text-base md:leading-none hover:shadow-lg rounded-md font-medium text-accent_color border-2 border-accent_color md:hover:bg-field_hover whitespace-nowrap ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : 'active:shadow-none'} ${className}`}
        >
        {isLoading || pending ? loadingText : buttonText}
        </button>
    );
};