import { DarkMode, LightMode } from '@/utils/Icons'
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="flex justify-center items-center py-2">
            <LightMode />
            <label className="relative inline-flex items-center cursor-pointer p-1">
                <input 
                    className="sr-only peer" 
                    type="checkbox" 
                    checked={theme === "dark"} 
                    onChange={toggleTheme} 
                />
                <div className="peer rounded-full outline-none duration-100 border border-border_color after:duration-500 w-[2.625rem] h-[1.125rem] bg-blue-300 peer-focus:outline-none after:absolute after:outline-none after:rounded-full after:h-4 after:w-4 after:bg-white after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-6 peer-checked:after:border-white">
                </div>
            </label>
            <DarkMode />
        </div>
    )
}
