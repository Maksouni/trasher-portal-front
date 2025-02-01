import { Config } from "tailwindcss";
import { themeColors } from "./src/theme";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
      },
    },
  },
  plugins: [],
};

export default config;
