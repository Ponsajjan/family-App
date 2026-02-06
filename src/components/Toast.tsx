'use client';

import React, { createContext, useContext, useCallback, useMemo, useEffect, useRef } from "react";
import { Error, Info, PlusIcon, Success, Warning } from "@/utils/Icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToast, removeToast, ToastState } from "@/store/slices/uiSlice";

interface ToastContextType {
    show: (component: string, type: ToastState["type"], timeout?: number) => void;
    close: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    return context;
};

function ToastProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const toasts = useAppSelector((state) => state.ui.toasts);
    const timeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

    const close = useCallback((id: string) => {
        if (timeoutsRef.current[id]) {
            clearTimeout(timeoutsRef.current[id]);
            delete timeoutsRef.current[id];
        }
        dispatch(removeToast(id));
    }, [dispatch]);

    const show = useCallback(
        (component: string, type: ToastState["type"] = 'info', timeout: number = 5000) => {
            // dispatch returns the action which doesn't have the generated ID directly
            // but we can handle auto-close by watching the 'toasts' state or generating ID here
            // However, the slice generates the ID.
            // Let's use an effect to handle auto-close for all toasts.
            dispatch(addToast({ message: component, type, duration: timeout }));
        },
        [dispatch]
    );

    // Auto-close logic
    useEffect(() => {
        toasts.forEach((toast) => {
            if (!timeoutsRef.current[toast.id]) {
                const timeoutId = setTimeout(() => {
                    close(toast.id);
                }, toast.duration || 5000);
                timeoutsRef.current[toast.id] = timeoutId;
            }
        });

        // Cleanup stale timeouts
        return () => {
            // Note: we only want to cleanup timeouts for toasts that are NO LONGER in the list
            // but for simplicity, we can let them run or do a more complex diff
        };
    }, [toasts, close]);

    const contextValue = useMemo(() => ({ show, close }), [show, close]);

    const toastIcons: { [key in ToastState["type"]]: any } = {
        success: <Success />,
        error: <Error />,
        warning: <Warning />,
        info: <Info />,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div
                className="fixed top-16 left-1/2 transform -translate-x-1/2 flex flex-col mx-auto items-center justify-center space-y-1 z-[104] w-full px-4 pointer-events-none overflow-hidden"
            >
                {toasts.map(({ id, message, type }) => (
                    <div
                        key={id}
                        role="alert"
                        className="toast_in delay-100 transition-all duration-300 ease-in-out w-full md:min-w-60 max-w-96 bg-field_color relative p-2 border border-border_active overflow-hidden rounded-md pointer-events-auto"
                    >
                        <div className="flex justify-between gap-2">
                            {toastIcons[type]}
                            <span className="md:text-xl text-text_color w-72" dangerouslySetInnerHTML={{ __html: message }} />
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
