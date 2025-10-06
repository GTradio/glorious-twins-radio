import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        light: "#FEFEFE",
        dark: "#100c19",
        "light-text": "#1F2937",
        "dark-text": "#F9FAFB",
        shade: "#1f2937",
        primaryLight: "#7c3aed14",
      },
      fontFamily: {
        sans: ["Calibre", "sans-serif"],
        mono: ["SF Mono", "monospace"],
        calibre: ["Calibre", "sans-serif"],
        "sf-mono": ["SF Mono", "monospace"],
      },
    },
  },
};
export default config;
