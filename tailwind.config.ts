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
        main_background: "rgba(var(--main-background))",

        field_color: "rgba(var(--field-color))",
        field_hover: "rgba(var(--field-hover))",

        accent_color: "rgba(var(--accent-color), 0.8)",
        accent_color_hover: "rgba(var(--accent-color))",

        accent_contrast: "rgba(var(--accent-contrast))",
        text_color: "rgba(var(--text-color))",

        border_color: "rgba(var(--border-color), 0.6)",
        border_active: "rgba(var(--border-color))",
      },
    },
  },
  plugins: [],
};
export default config;
