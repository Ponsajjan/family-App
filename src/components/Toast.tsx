'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useMemo } from "react";
import { Error, Info, PlusIcon, Success, Warning } from "@/utils/Icons";

interface Toast {
    id: number;
    component: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

interface ToastContextType {
    show: (component: string, type: Toast["type"], timeout?: number) => void;
    close: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    // if (!context) {
    //     throw Error("useToast must be used within a ToastProvider");
    // }
    return context;
};

function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

    // `close` is memoized
    const close = useCallback((id: number) => {
        clearTimeout(timeoutsRef.current[id]);
        delete timeoutsRef.current[id];
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    // `show` is memoized and will not change across renders
    const show = useCallback(
        (component: string, type: Toast["type"] = 'info', timeout: number = 5000) => {
            const id = Date.now();
            setToasts((prevToasts) => [...prevToasts, { id, component, type }]);

            const timeoutId = setTimeout(() => {
                close(id);
            }, timeout);
            timeoutsRef.current[id] = timeoutId;
        },
        [close] // Add `close` to the dependency array
    );

    // Memoized context value ensures that the value reference never changes
    const contextValue = useMemo(() => ({ show, close }), [show, close]);

    const toastIcons: { [key in Toast["type"]]: any } = {
        success: <Success />,
        error: <Error />,
        warning: <Warning />,
        info: <Info />,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div
                className="fixed top-24 left-1/2 transform -translate-x-1/2 flex flex-col mx-auto items-center justify-center space-y-1 z-[104] w-full px-4"
                aria-live="polite"
            >
                {toasts.map(({ id, component, type }) => (
                    <div
                        key={id}
                        role="alert"
                        aria-live="assertive"
                        className="toast_in delay-100 transition-all duration-300 ease-in-out w-full md:min-w-60 max-w-96 bg-field_color relative p-2 border border-border_active overflow-hidden rounded-md"
                    >
                        <div className="flex justify-between gap-2">
                            {toastIcons[type]}
                            <p className="md:text-xl text-text_color w-72">{component}</p>
                            <button onClick={() => close(id)} className="w-6 h-6 transform rotate-45">
                                <PlusIcon />
                            </button>
                        </div>
                        <div className="progress active absolute bottom-0 left-0 w-full h-1 bg-field_hover"></div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
