"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({ children }: { children: ReactNode }) {
    return (
        <nav className="bg-gray-400 text-white flex justify-center px-4">
            {children}
        </nav> 
    )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
    const pathName = usePathname()
    return (
        <Link {...props} className={`p-4 text-white hover:bg-slate-500 focus-visible:bg-slate-500 ${(pathName === props.href) ? "bg-slate-600" : "bg-gray-400" }`} />
    )
}