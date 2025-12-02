"use client";
import { BurgerMenuIcon, CloseIcon, Login, LoginList, Logout } from "@/utils/Icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSidenav() {
    const [showNav, setShowNav] = useState(false);
    const router = useRouter();

    const navigateTo = (link: string) => {
        router.push(link);
        setShowNav(false);
    };

    const logout = async () => {
        try {
            const response = await fetch('/api/logout', { method: 'GET' });

            if (response.ok) {
                router.push('/login');
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
            <nav className={` ${showNav ? 'opacity-100 delay-500' : 'opacity-0 xl:opacity-100'} transition-all duration-300 ease-in-out xl:block fixed top-14 lg:sticky md:top-0 z-[102] h-[70vh] lg:h-full`}>
                <div className="h-12 border-b border-border_color w-full bg-field_color"></div>
                <div className={`flex-col justify-between ${showNav ? 'flex' : 'hidden xl:flex'} absolute xl:static top-0 left-2 md:left-0 bg-field_color md:bg-main_background border border-border_color md:border-y-0 md:border-l-0 w-40 min-h-[calc(100vh-10rem)] md:min-h-screen xl:min-h-[calc(100vh-3rem)] rounded-xl md:rounded-none overflow-hidden`}>
                    <div>
                        <AdminNavLink linkName="Login List" link="/admin" onClick={() => navigateTo("/admin")} />
                        <AdminNavLink linkName="New Login" link="/admin/new_login" onClick={() => navigateTo("/admin/new_login")} />
                    </div>
                    <button onClick={logout} className="py-2 flex gap-2 items-center justify-center border-t border-border_color">
                        <Logout />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
}

export function AdminNavLink({ link, linkName, onClick }: { link: string, linkName: string, onClick: () => void }) {
    const pathName = usePathname();

    return (
        <button
            onClick={onClick}
            className={`group py-2 px-4 w-full flex gap-3 items-end justify-start text-start hover:bg-accent_color_hover/75 hover:text-accent_contrast focus-visible:bg-field_hover ${(pathName === link) ? "bg-accent_color_hover text-accent_contrast" : "bg-transparent text-text_color"}`}
        >
            <p className={`group-hover:invert ${pathName === link ? "invert" : " "}`}>
                {linkName === 'New Login' && <Login />}
                {linkName === 'Login List' && <LoginList />}
            </p>
            <p>{linkName}</p>
        </button>
    );
}
