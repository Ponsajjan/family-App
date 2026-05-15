"use client";

import { BurgerMenuIcon, CalendarIcon, CloseIcon, FamilyProfessionals, Moderator, RelativesIcon, Terms, TreeIcon } from "@/utils/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Sidenav() {
    const [showNav, setShowNav] = useState(false);
    const { anyAccountHasIssues } = useSelector((state: RootState) => state.terms);

    const closeNav = () => {
        setShowNav(false);
    };

    return (
        <>
            <span className="block xl:hidden fixed top-3 z-[100] m-0 p-0">
                <button onClick={() => setShowNav(prev => !prev)} className="absolute h-6 w-6 top-0 left-2">
                    {showNav ? <CloseIcon /> : <BurgerMenuIcon />}
                </button>
            </span>
            <div onClick={() => setShowNav(false)} className={`fixed xl:hidden ${showNav ? 'right-0 bg-gray-500/60' : 'left-full delay-500 bg-gray-300/5'} inset-0 z-[120] duration-500 ease-in-out`} />
            <nav className={`${showNav ? 'opacity-100 delay-500 pointer-events-auto' : 'opacity-0 xl:opacity-100 pointer-events-none xl:pointer-events-auto'} transition-all duration-300 ease-in-out xl:block fixed top-14 lg:sticky md:top-0 z-[130] h-[70vh] lg:h-full`}>
                <div className="h-12 border-b border-border_color w-full bg-field_color"></div>
                <div className={`flex-col justify-between ${showNav ? 'flex' : 'hidden xl:flex'} absolute xl:static top-0 md:pt-8 xl:pt-0 left-2 md:left-0 bg-field_color md:bg-main_background border border-border_color md:border-y-0 md:border-l-0 w-fit md:w-40 min-h-[calc(100vh-10rem)] md:min-h-screen xl:min-h-[calc(100vh-3rem)] rounded-xl md:rounded-none overflow-hidden`}>
                    <div>
                        <NavLink linkName="Calendar" link="" onClick={closeNav} />
                        <NavLink linkName="Relatives" link="relatives" onClick={closeNav} />
                        <NavLink linkName="Relations" link="tree" onClick={closeNav} />
                        <NavLink linkName="Add/Edit" link="add_edit" onClick={closeNav} />
                        <NavLink linkName="Moderator" link="moderator" onClick={closeNav} showDot={anyAccountHasIssues} />
                        <span className="border-t border-border_color pt-2 mt-6 block mx-4"></span>
                        <NavLink linkName="Terms" link="terms" onClick={closeNav} />
                    </div>
                </div>
            </nav>
        </>
    );
}

export function NavLink({ link, linkName, onClick, showDot }: { link: string, linkName: string, onClick: () => void, showDot?: boolean }) {
    const pathName = usePathname();
    const href = `/${link}`.replace("//", "/");
    const isActive = pathName.split('/')[1] === link;

    return (
        <Link
            href={href}
            onClick={onClick}
            prefetch={true}
            className={`group py-2 px-4 w-full flex gap-3 items-end justify-start text-start hover:bg-accent_color_hover/75 hover:text-accent_contrast focus-visible:bg-field_hover relative ${isActive ? "bg-accent_color_hover text-accent_contrast" : "bg-transparent text-text_color"}`}
        >
            <p className={`group-hover:invert relative ${isActive ? "invert" : " "}`}>
                {linkName === 'Calendar' && <CalendarIcon />}
                {linkName === 'Relatives' && <RelativesIcon />}
                {linkName === 'Relations' && <TreeIcon />}
                {linkName === 'Add/Edit' && <FamilyProfessionals />}
                {linkName === 'Moderator' && <Moderator />}
                {linkName === 'Terms' && <Terms />}
                {linkName === 'Moderator' && showDot && (
                    <span className="absolute bottom-0.5 -right-0.5 flex h-2.5 w-2.5 border rounded-full">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-black"></span>
                    </span>
                )}
            </p>
            <p>{linkName}</p>
        </Link>
    );
}
