"use client";

import { BurgerMenuIcon, CloseIcon, DarkMode, FamilyProfessionals, LightMode, NavIconVerified } from "@/utils/Icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import HoldButton from "./HoldButton";

export default function ModeratorSidenav() {
    const [showNav, setShowNav] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const navigateTo = (link: string) => {
        router.push(link);
        setShowNav(false);
    };

    const logout = async () => {
        try {
          const response = await fetch('/api/logout', { method: 'GET' });
      
          if (response.ok) {
            window.location.href = '/login';
          } else {
            console.error("Logout failed");
          }
        } catch (error) {
          console.error("Error logging out:", error);
        }
    };

    return (
        <>
            <span className="block xl:hidden fixed top-3 z-[99] m-0 p-0">
                <button onClick={() => setShowNav(prev => !prev)} className="absolute h-6 w-6 top-0 left-2">
                    {showNav ? <CloseIcon /> : <BurgerMenuIcon />}
                </button>
            </span>
            <div onClick={() => setShowNav(false)} className={`fixed xl:hidden ${showNav ? 'right-0 bg-gray-500/60' : 'left-full delay-500 bg-gray-300/5'} inset-0 z-[102] duration-500 ease-in-out`} />
            <nav className={` ${showNav ? 'opacity-100 delay-500' : 'opacity-0 xl:opacity-100'} transition-all duration-300 ease-in-out xl:block sticky top-14 md:top-0 z-[102] h-[70vh] lg:h-full`}>
                <div className="h-12 border-b border-border_color w-full bg-field_color"></div>
                <div className={`flex-col justify-between ${showNav ? 'flex' : 'hidden xl:flex'} absolute xl:static top-0 left-2 md:left-0 bg-field_color md:bg-main_background border border-border_color md:border-y-0 md:border-l-0 w-fit md:w-40 min-h-[calc(100vh-4rem)] md:min-h-screen xl:min-h-[calc(100vh-3rem)] rounded-xl md:rounded-none overflow-hidden`}>
                    <div>
                        <ModeratorNavLink linkName="Verify Member" link={undefined} onClick={() => navigateTo("/moderator")} />
                        <ModeratorNavLink linkName="Verify Changes" link="verify_changes" onClick={() => navigateTo("/moderator/verify_changes")} />
                        <ModeratorNavLink linkName="Add/Edit" link="add_edit" onClick={() => navigateTo("/moderator/add_edit")} />
                    </div>
                    <div>
                        <div onClick={logout} className="py-2 px-2 w-full flex gap-1 items-center justify-center cursor-pointer text-text_color" >
                            Logout
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
                </div>
            </nav>
        </>
    );
}

export function ModeratorNavLink({ link, linkName, onClick }: { link: string | undefined, linkName: string, onClick: () => void }) {
    const pathName = usePathname();

    return (
        <button 
            onClick={onClick}
            className={`group py-2 px-2 w-full flex gap-2 items-center justify-start text-start hover:bg-accent_color_hover hover:opacity-80 hover:text-accent_contrast focus-visible:bg-field_hover ${(pathName?.split('/')[2] === link) ? "bg-accent_color_hover text-accent_contrast" : "bg-transparent text-text_color"}`}
        >
            <p className={`group-hover:invert ${(pathName?.split('/')[2] === link) ? "invert" : " "}`}>
                {/* {linkName === 'New Member' && <NavIconNew />} */}
                {linkName === 'Verify Member' && <NavIconVerified />}
                {linkName === 'Verify Changes' && <NavIconVerified />}
                {linkName === 'Add/Edit' && <FamilyProfessionals />}
            </p>
            <div className="flex items-center justify-between w-full">
                <p className="text-base">{linkName}</p>
                {/* <span>(999)</span> */}
            </div>
        </button>
    );
}
