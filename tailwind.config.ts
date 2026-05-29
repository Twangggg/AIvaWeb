import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary-container": "#8a7772",
        "primary-fixed-dim": "#c3c6cf",
        "on-secondary-fixed": "#221b00",
        "tertiary-fixed": "#f5ddd7",
        "on-primary-fixed": "#181c22",
        "on-secondary": "#3a3000",
        background: "#111415",
        "surface-container-low": "#191c1d",
        "on-primary-container": "#787b83",
        "secondary-fixed": "#ffe16d",
        "inverse-on-surface`": "#2e3132",
        "inverse-surface": "#`e1e3e4",
        "primary-fixed": "#dfe2eb",
        "on-surface-variant": "#c6c6cb",
        "on-surface": "#e1e3e4",
        "secondary-container": "#ffdb3c",
        "on-primary": "#2d3137",
        "on-secondary-fixed-variant": "#544600",
        "on-tertiary": "#3b2d29",
        "surface-tint": "#c3c6cf",
        "on-primary-fixed-variant": "#43474e",
        "inverse-primary": "#5b5e66",
        "tertiary-container": "#160b08",
        "on-secondary-container": "#725f00",
        error: "#ffb4ab",
        "on-tertiary-fixed": "#251915",
        "outline-variant": "#45474b",
        "surface-container-highest": "#323536",
        surface: "#111415",
        "on-error": "#690005",
        "on-tertiary-fixed-variant": "#53433f",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "surface-dim": "#111415",
        secondary: "#fff9ef",
        "surface-container-high": "#282a2b",
        "tertiary-fixed-dim": "#d8c2bc",
        "on-background": "#e1e3e4",
        "surface-variant": "#323536",
        "surface-container": "#1d2021",
        "primary-container": "#0a0e14",
        primary: "#c3c6cf",
        outline: "#8f9095",
        "surface-container-lowest": "#0c0f10",
        "secondary-fixed-dim": "#e9c400",
        "surface-bright": "#373a3b",
        tertiary: "#d8c2bc",
        "brand-gold": "#FFD700"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "margin-mobile": "20px",
        "stack-lg": "32px",
        "margin-desktop": "80px",
        "container-max": "1440px",
        "stack-md": "16px",
        "stack-sm": "8px",
        "section-gap": "120px",
        gutter: "24px",
        base: "8px"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-md-mobile": ["Montserrat", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-md": ["Montserrat", "sans-serif"],
        "display-lg-mobile": ["Montserrat", "sans-serif"],
        "display-lg": ["Montserrat", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-md-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "display-lg-mobile": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "display-lg": ["64px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    }
  },
  plugins: []
};

export default config;
