'use client'

import { createContext, useContext, useState } from "react";
import { Error, Info, PlusIcon, Success, Warning } from "@/utils/Icons";

interface Toast {
    id: number;
    component: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

interface ToastContextType {
    show: (component:string, type: 'info' | 'success' | 'error' | 'warning', timeout:number) => void;
    close: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => useContext(ToastContext)

function ToastProvider({children}: any) {
    const [toasts, setToasts] = useState<Toast[]>([])


    const show = (component:string, type: 'info' | 'success' | 'error' | 'warning' = 'info', timeout:number = 5000) => {
        const id = Date.now()
        setToasts(prevToasts => [...prevToasts, {id, component, type}])
    
        setTimeout(() => close(id), timeout)
    }

    const close = (id:number) => {
        setToasts ((toasts) => toasts.filter((toasts) => toasts.id !== id))
    }
    
    const getToastStyle = (type:string) => {
        switch (type) {
            case "success":
                return (<Success /> )
            case "error":
                return (<Error />);
            case "warning":
                return (<Warning />);
            default:
                return (<Info />);
        }
    };

    return (
        <ToastContext.Provider value={{show, close}}>
            {children}
            {(toasts.length > 0) && <div className="fixed bg-gray-400/50 inset-0 cursor-not-allowed z-[103]"></div>}
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 space-y-1 z-[104]">
                {toasts.map(({id, component, type}) => (
                    <div key={id} className={`toast_in delay-100 transition-all duration-300 ease-in-out md:min-w-60 bg-field_color relative p-2 border border-border_active overflow-hidden rounded-md`}>
                        <div className="flex justify-between items-center gap-2">
                            {getToastStyle(type)}
                            <p className="md:text-xl text-text_color whitespace-nowrap">{component}</p>
                            <button onClick={() => close(id)} className="w-6 h-6 transform rotate-45"><PlusIcon /></button>
                        </div>
                        <div className="progress active absolute bottom-0 left-0 w-full h-1 bg-field_hover"></div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
export default ToastProvider