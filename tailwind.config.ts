import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0c0f",
          dim: "#0a0c0f",
          bright: "#2a3038",
          "container-lowest": "#060809",
          "container-low": "#12151a",
          container: "#171b21",
          "container-high": "#222830",
          "container-highest": "#2c333d",
        },
        on: {
          surface: "#e8ecf1",
          "surface-variant": "#8b95a5",
        },
        outline: {
          DEFAULT: "#4a5568",
          variant: "#2d3540",
        },
        primary: {
          DEFAULT: "#3ecf8e",
          on: "#042818",
          container: "#1a9d6a",
          "on-container": "#d4f5e6",
          fixed: "#5ee0a8",
          "fixed-dim": "#3ecf8e",
        },
        secondary: {
          DEFAULT: "#f07178",
          on: "#3d0a0e",
          container: "#c43d45",
          "on-container": "#ffd8da",
        },
        tertiary: {
          DEFAULT: "#d4a853",
          on: "#2a1f08",
          container: "#b8892e",
          "on-container": "#f5e6c4",
        },
        error: {
          DEFAULT: "#ffb4ab",
          on: "#690005",
          container: "#93000a",
          "on-container": "#ffdad6",
        },
        asset: {
          stocks: "#94a3b8",
          indices: "#7c8db5",
          forex: "#6b9bc3",
          crypto: "#9b8ec4",
          commodities: "#c4a05a",
          futures: "#5aab9e",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "1.4", fontWeight: "500" }],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        "data-lg": ["16px", { lineHeight: "1.2", fontWeight: "500" }],
        "data-md": ["14px", { lineHeight: "1.2", fontWeight: "500" }],
        "data-sm": ["12px", { lineHeight: "1.2", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      maxWidth: {
        page: "1440px",
      },
      spacing: {
        "stack-xs": "0.25rem",
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "1.5rem",
        "page-margin": "1.5rem",
        sidebar: "240px",
      },
      boxShadow: {
        modal: "0 10px 30px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
