import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    showOptional?: boolean;
    label?: string;
    error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    showOptional = false,
    label = "",
    placeholder = "",
    className = "",
    error = "",
    ...restProps
}) => {
    return (
        <>
            <label className='w-full'>
                {label && <span className="text-sm font-medium" >{label}</span>}
                {(label && showOptional) && <span className='font-normal opacity-45 pl-2 text-sm'>(Optional)</span>}
                <textarea
                    placeholder={placeholder}
                    name={label}
                    className={`p-2 border border-border_color outline-none focus:border-border_active text-sm rounded-md w-full bg-field_color disabled:cursor-not-allowed resize-vertical min-h-[5rem] ${className}`}
                    {...restProps}
                />
            </label>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </>
    )
}

export default TextArea
