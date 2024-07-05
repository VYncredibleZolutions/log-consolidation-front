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
        "primary": "#68F768",
        "second": "#4BA84B",
        "disabled": "#8CAA8C",

        "gray-6": "#191919",
        "gray-5": "#2c2c2c",
        "gray-4": "#3f3f3f",
        "gray-3": "#545454",
        "gray-2": "#6a6a6a",
        "gray-1": "#808080"
      }
    },
  },
  plugins: [],
};
export default config;
