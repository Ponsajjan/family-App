"use client";

import { BurgerMenuIcon, CalendarIcon, CloseIcon, FamilyProfessionals, Moderator, RelativesIcon, Terms, TreeIcon } from "@/utils/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Sidenav() {
    const [showNav, setShowNav] = useState(false);

    const closeNav = () => {
        setShowNav(false);
    };

    return (
        <>
            <span className="block xl:hidden fixed top-3 z-[99] m-0 p-0">
                <button onClick={() => setShowNav(prev => !prev)} className="absolute h-6 w-6 top-0 left-2">
                    {showNav ? <CloseIcon /> : <BurgerMenuIcon />}
                </button>
            </span>
            <div onClick={() => setShowNav(false)} className={`fixed xl:hidden ${showNav ? 'right-0 bg-gray-500/60' : 'left-full delay-500 bg-gray-300/5'} inset-0 z-[102] duration-500 ease-in-out`} />
            <nav className={`${showNav ? 'opacity-100 delay-500 pointer-events-auto' : 'opacity-0 xl:opacity-100 pointer-events-none xl:pointer-events-auto'} transition-all duration-300 ease-in-out xl:block fixed top-14 lg:sticky md:top-0 z-[103] h-[70vh] lg:h-full`}>
                <div className="h-12 border-b border-border_color w-full bg-field_color"></div>
                <div className={`flex-col justify-between ${showNav ? 'flex' : 'hidden xl:flex'} absolute xl:static top-0 md:pt-8 xl:pt-0 left-2 md:left-0 bg-field_color md:bg-main_background border border-border_color md:border-y-0 md:border-l-0 w-fit md:w-40 min-h-[calc(100vh-10rem)] md:min-h-screen xl:min-h-[calc(100vh-3rem)] rounded-xl md:rounded-none overflow-hidden`}>
                    <div>
                        <NavLink linkName="Calendar" link="" onClick={closeNav} />
                        <NavLink linkName="Relatives" link="relatives" onClick={closeNav} />
                        <NavLink linkName="Relations" link="tree" onClick={closeNav} />
                        <NavLink linkName="Add/Edit" link="add_edit" onClick={closeNav} />
                        <NavLink linkName="Moderator" link="moderator" onClick={closeNav} />
                        <span className="border-t border-border_color pt-2 mt-6 block mx-4"></span>
                        <NavLink linkName="Terms" link="terms" onClick={closeNav} />
                    </div>
                </div>
            </nav>
        </>
    );
}

export function NavLink({ link, linkName, onClick }: { link: string, linkName: string, onClick: () => void }) {
    const pathName = usePathname();
    const href = `/${link}`.replace("//", "/");

    return (
        <Link
            href={href}
            onClick={onClick}
            prefetch={true}
            className={`group py-2 px-4 w-full flex gap-3 items-end justify-start text-start hover:bg-accent_color_hover/75 hover:text-accent_contrast focus-visible:bg-field_hover ${(pathName.split('/')[1] === link) ? "bg-accent_color_hover text-accent_contrast" : "bg-transparent text-text_color"}`}
        >
            <p className={`group-hover:invert ${pathName.split('/')[1] === link ? "invert" : " "}`}>
                {linkName === 'Calendar' && <CalendarIcon />}
                {linkName === 'Relatives' && <RelativesIcon />}
                {linkName === 'Relations' && <TreeIcon />}
                {linkName === 'Add/Edit' && <FamilyProfessionals />}
                {linkName === 'Moderator' && <Moderator />}
                {linkName === 'Terms' && <Terms />}
            </p>
            <p>{linkName}</p>
        </Link>
    );
}
