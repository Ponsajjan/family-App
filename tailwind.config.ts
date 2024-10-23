import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        main_background: "rgba(var(--main_background))",

        field_color: "rgba(var(--field_color))",
        field_hover: "rgba(var(--field_hover))",

        accent_color: "rgba(var(--accent_color), 0.8)",
        accent_color_hover: "rgba(var(--accent_color))",

        accent_contrast: "rgba(var(--accent_contrast))",
        text_color: "rgba(var(--text_color))",
        
        border_color: "rgba(var(--border_color), 0.4)",
        border_active: "rgba(var(--border_color))",
      },
    },
  },
  plugins: [],
};
export default config;
