'use client'

import Link from 'next/link';
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
        className={`bg-accent_color text-accent_contrast h-10 md:h-12 text-base md:text-lg shadow-md rounded-md font-medium whitespace-nowrap ${(isLoading || disabled) ? 'opacity-70 cursor-not-allowed' : ''} active:shadow-none cursor-pointer ${className}`}
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
        className={`min-w-[150px] h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg md:leading-none shadow-md rounded-md font-medium text-text_color bg-field_color border-2 border-accent_color whitespace-nowrap ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''} active:shadow-none cursor-pointer ${className}`}
        >
        {isLoading || pending ? loadingText : buttonText}
        </button>
    );
};

interface LinkButtonProps {
    buttonText: string;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    disabled?: boolean;
    linkto?: string;
    className?: string;
    loadingText?: string;
  }
  export const LinkButtonSolid = ({ buttonText, linkto='', className} : LinkButtonProps) => {
      return (
          <Link
          href={linkto}
          className={`block text-center min-w-[150px] bg-accent_color text-accent_contrast h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg shadow-md active:shadow-none rounded-md font-medium whitespace-nowrap ${className}`}
          >
          {buttonText}
          </Link>
      );
  };
  
  export const LinkButtonOutline = ({ buttonText, linkto='', className } : LinkButtonProps) => {
      return (
          <Link
          href={linkto}
          className={`block text-center min-w-[150px] h-10 md:h-12 px-2 md:px-4 py-2 md:py-3 text-base md:text-lg md:leading-none shadow-md active:shadow-none rounded-md font-medium text-text_color bg-field_color border-2 border-accent_color whitespace-nowrap ${className}`}
          >
          {buttonText}
          </Link>
      );
  };