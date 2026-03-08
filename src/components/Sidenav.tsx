"use client";

import { BurgerMenuIcon, CalendarIcon, CloseIcon, FamilyProfessionals, Moderator, RelativesIcon, Terms, TreeIcon } from "@/utils/Icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidenav() {
    const [showNav, setShowNav] = useState(false);
    const router = useRouter();

    const navigateTo = (link: string) => {
        router.push(link);
        setShowNav(false);
    };

    return (
        <>
            <span className="block xl:hidden fixed top-4 left-4 z-[99]">
                <button
                    onClick={() => setShowNav(prev => !prev)}
                    className="p-2 rounded-lg glass shadow-lg text-text_color transition-transform active:scale-95"
                >
                    {showNav ? <CloseIcon /> : <BurgerMenuIcon />}
                </button>
            </span>
            <div
                onClick={() => setShowNav(prev => !prev)}
                className={`fixed xl:hidden inset-0 z-[102] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${showNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            <nav className={`fixed top-0 left-0 z-[103] h-full transition-transform duration-500 xl:sticky xl:top-0 xl:translate-x-0 ${showNav ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className={`flex flex-col h-full w-64 xl:w-56 glass border-r border-border_color/20 p-6 gap-8`}>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-lg bg-accent_color flex items-center justify-center text-accent_contrast shadow-lg shadow-accent_color/30">
                            <CalendarIcon />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-text_color">Family App</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <NavLink linkName="Calendar" link="" onClick={() => navigateTo("/")} />
                        <NavLink linkName="Relatives" link="relatives" onClick={() => navigateTo("/relatives")} />
                        <NavLink linkName="Relations" link="tree" onClick={() => navigateTo("/tree")} />
                        <NavLink linkName="Add/Edit" link="add_edit" onClick={() => navigateTo("/add_edit")} />
                        <NavLink linkName="Moderator" link="moderator" onClick={() => navigateTo("/moderator")} />

                        <div className="my-4 border-t border-border_color/40" />

                        <NavLink linkName="Terms" link="terms" onClick={() => navigateTo("/terms")} />
                    </div>
                </div>
            </nav>
        </>
    );
}

export function NavLink({ link, linkName, onClick }: { link: string, linkName: string, onClick: () => void }) {
    const pathName = usePathname();
    const isActive = (pathName === '/' && link === '') || (link !== '' && pathName.startsWith(`/${link}`));

    return (
        <button
            onClick={onClick}
            className={`group py-3 px-4 rounded-xl flex gap-3 items-center text-sm font-medium transition-all duration-200 
                ${isActive
                    ? "bg-accent_color text-accent_contrast shadow-lg shadow-accent_color/20 scale-[1.02]"
                    : "text-text_color/70 hover:bg-field_hover hover:text-text_color"}`}
        >
            <div className={`transition-all duration-200 ${isActive ? "scale-110" : "group-hover:scale-110 opacity-70 group-hover:opacity-100"}`}>
                {linkName === 'Calendar' && <CalendarIcon />}
                {linkName === 'Relatives' && <RelativesIcon />}
                {linkName === 'Relations' && <TreeIcon />}
                {linkName === 'Add/Edit' && <FamilyProfessionals />}
                {linkName === 'Moderator' && <Moderator />}
                {linkName === 'Terms' && <Terms />}
            </div>
            <span>{linkName}</span>
        </button>
    );
}
