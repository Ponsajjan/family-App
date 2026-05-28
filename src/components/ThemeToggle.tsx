import { useId } from 'react';
import { DarkMode, LightMode } from '@/utils/Icons'
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const inputId = useId();
    const isDark = theme === "dark";

    return (
        <div className="flex justify-center items-center py-2" role="group" aria-label="Theme toggle">
            <LightMode aria-hidden="true" />
            <label htmlFor={inputId} className="relative inline-flex items-center cursor-pointer p-1">
                <span className="sr-only">Toggle dark mode</span>
                <input
                    id={inputId}
                    className="sr-only peer"
                    type="checkbox"
                    role="switch"
                    aria-checked={isDark}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    checked={isDark}
                    onChange={toggleTheme}
                />
                <div className="peer rounded-full outline-none duration-100 border border-border_color after:duration-500 w-[2.625rem] h-[1.125rem] bg-blue-300 peer-focus:outline-none after:absolute after:outline-none after:rounded-full after:h-4 after:w-4 after:bg-white after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-6 peer-checked:after:border-white" aria-hidden="true">
                </div>
            </label>
            <DarkMode aria-hidden="true" />
        </div>
    )
}
