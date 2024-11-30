"use client";
import { BurgerMenuIcon, CalenderIcon, CloseIcon, Community, DarkMode, FamilyProfessionals, LightMode, RelativesIcon, Terms, TreeIcon } from "@/utils/Icons";
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
            <span className="block xl:hidden fixed top-3 z-[99] m-0 p-0">
                <button onClick={() => setShowNav(prev => !prev)} className="absolute h-6 w-6 top-0 left-2">
                    {showNav ? <CloseIcon /> : <BurgerMenuIcon />}
                </button>
            </span>
            <div onClick={() => setShowNav(false)} className={`fixed xl:hidden ${showNav ? 'right-0 bg-gray-500/60' : 'left-full delay-500 bg-gray-300/5'} inset-0 z-[100] duration-500 ease-in-out`} />
            <nav className={` ${showNav ? 'opacity-100 delay-500' : 'opacity-0 xl:opacity-100'} transition-all duration-300 ease-in-out xl:block sticky top-14 md:top-0 z-[102] h-[70vh] lg:h-full`}>
                <div className="h-12 border-b border-border_color w-full bg-field_color"></div>
                <div className={`flex-col justify-between ${showNav ? 'flex' : 'hidden xl:flex'} absolute xl:static top-0 left-2 md:left-0 bg-field_color md:bg-main_background border border-border_color md:border-y-0 md:border-l-0 w-fit md:w-40 min-h-[calc(100vh-4rem)] md:min-h-screen xl:min-h-[calc(100vh-3rem)] rounded-xl md:rounded-none overflow-hidden`}>
                    <div>
                        <NavLink linkName="Calender" link="" onClick={() => navigateTo("/")} />
                        <NavLink linkName="Relatives" link="relatives" onClick={() => navigateTo("/relatives")} />
                        <NavLink linkName="Relation" link="tree" onClick={() => navigateTo("/tree")} />
                        <NavLink linkName="Add/Edit" link="add_edit" onClick={() => navigateTo("/add_edit")} />
                        {/* <NavLink linkName="Community" link="community" onClick={() => navigateTo("/community")} /> */}
                        <span  className="border-t border-border_color pt-2 mt-6 block mx-4"></span>
                        <NavLink linkName="Terms" link="terms" onClick={() => navigateTo("/terms")} />
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
            className={`group py-2 px-4 w-full flex gap-3 items-end justify-start text-start hover:bg-accent_color_hover hover:opacity-80 hover:text-accent_contrast focus-visible:bg-field_hover ${(pathName.split('/')[1] === link) ? "bg-accent_color_hover text-accent_contrast" : "bg-transparent text-text_color"}`}
        >
            <p className={`group-hover:invert ${pathName.split('/')[1] === link ? "invert" : " "}`}>
                {linkName === 'Calender' && <CalenderIcon />}
                {linkName === 'Relatives' && <RelativesIcon />}
                {linkName === 'Relation' && <TreeIcon />}
                {linkName === 'Add/Edit' && <FamilyProfessionals />}
                {/* {linkName === 'Community' && <Community />} */}
                {linkName === 'Terms' && <Terms />}
            </p>
            <p>{linkName}</p>
        </button>
    );
}
