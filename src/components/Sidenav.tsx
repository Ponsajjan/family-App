"use client";
import { BurgerMenuIcon, CalenderIcon, CloseIcon, DarkMode, FamilyProfessionals, LightMode, RelativesIcon, TreeIcon } from "@/utils/Icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Topnav from "./Topnav";

export function Sidenav() {
    const [showNav, setShowNav] = useState(false);
    const [theme, setTheme] = useState<string>("light");
    const router = useRouter();

    useEffect(() => {
        // Update theme in localStorage and class on <div>
        const element = document.getElementById("MainDiv");
        if (element) {
            element.classList.remove("light", "dark");
            element.classList.add(theme);
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
    };

    const navigateTo = (link: string) => {
        router.push(link);
        setShowNav(false);
    };

    return (
        <>
            <span className="block xl:hidden fixed top-3 z-[901] m-0 p-0">
                <button onClick={() => setShowNav(prev => !prev)} className="absolute h-6 w-6 top-0 left-2">
                    {showNav ? <CloseIcon /> : <BurgerMenuIcon />}
                </button>
            </span>
            <div onClick={() => setShowNav(false)} className={` ${showNav ? 'block' :'hidden'} xl:hidden absolute z-[900] inset-0 w-full bg-gray-400 bg-opacity-65 transition-opacity`} />
            <nav className={` ${showNav ? 'block' : 'hidden'} xl:block sticky top-14 md:top-0 z-[901] h-[70vh] lg:h-full`}>
                <div className="h-12 border-b border-border_color w-full bg-field_color"></div>
                <div className="flex flex-col justify-between absolute xl:static top-0 left-2 md:left-0 bg-field_color md:bg-main_background border border-border_color md:border-y-0 md:border-l-0 w-40 min-h-[calc(100vh-4rem)] md:min-h-screen xl:min-h-[calc(100vh-3rem)] rounded-xl md:rounded-none overflow-hidden">
                    <div>
                        <NavLink linkName="Calender" link="" onClick={() => navigateTo("/")} />
                        <NavLink linkName="Relatives" link="relatives" onClick={() => navigateTo("/relatives")} />
                        <NavLink linkName="Relation" link="tree" onClick={() => navigateTo("/tree")} />
                        <NavLink linkName="Add/Edit" link="add_edit" onClick={() => navigateTo("/add_edit")} />
                    </div>
                    <div className="flex justify-center items-center py-2">
                        <LightMode />
                        <label className="relative inline-flex items-center cursor-pointer p-1">
                            <input 
                                className="sr-only peer" 
                                type="checkbox" 
                                checked={theme === "dark"} 
                                onChange={toggleTheme} 
                            />
                            <div className="peer rounded-full outline-none duration-100 border border-border_color after:duration-500 w-[42px] h-[18px] bg-blue-300 peer-focus:outline-none after:absolute after:outline-none after:rounded-full after:h-4 after:w-4 after:bg-white after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-6 peer-checked:after:border-white">
                            </div>
                        </label>
                        <DarkMode />
                    </div>
                </div>
            </nav>
        </>
    );
}

export function NavLink({ link, linkName, onClick }: { link: string, linkName: string, onClick: () => void }) {
    const pathName = usePathname();

    return (
        <button 
            onClick={onClick}
            className={`group py-2 px-3 w-full flex gap-3 items-end justify-start text-start hover:bg-accent_color_hover hover:opacity-80 hover:text-accent_contrast focus-visible:bg-field_hover ${(pathName.split('/')[1] === link) ? "bg-accent_color_hover text-accent_contrast" : "bg-transparent text-text_color"}`}
        >
            <p className={`group-hover:invert ${pathName.split('/')[1] === link ? "invert" : " "}`}>
                {linkName === 'Calender' && <CalenderIcon />}
                {linkName === 'Relatives' && <RelativesIcon />}
                {linkName === 'Relation' && <TreeIcon />}
                {linkName === 'Add/Edit' && <FamilyProfessionals />}
            </p>
            <p>{linkName}</p>
        </button>
    );
}
