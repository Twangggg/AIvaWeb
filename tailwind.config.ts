import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf9ff",
          100: "#d7f0ff",
          200: "#b9e7ff",
          300: "#8fd8ff",
          400: "#5ec3ff",
          500: "#29a5ff",
          600: "#0f86ed",
          700: "#106bc0",
          800: "#14599f",
          900: "#174b82"
        }
      }
    }
  },
  plugins: []
};

export default config;
