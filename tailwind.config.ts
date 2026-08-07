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
          DEFAULT: "#0e141a",
          dim: "#0e141a",
          bright: "#333a40",
          "container-lowest": "#080f14",
          "container-low": "#161c22",
          container: "#1a2026",
          "container-high": "#242b31",
          "container-highest": "#2f353c",
        },
        on: {
          surface: "#dde3eb",
          "surface-variant": "#bccbb9",
        },
        outline: {
          DEFAULT: "#869585",
          variant: "#3d4a3d",
        },
        primary: {
          DEFAULT: "#4be277",
          on: "#003915",
          container: "#22c55e",
          "on-container": "#004b1e",
          fixed: "#6bff8f",
          "fixed-dim": "#4ae176",
        },
        secondary: {
          DEFAULT: "#ffb3ad",
          on: "#68000a",
          container: "#a40217",
          "on-container": "#ffaea8",
        },
        tertiary: {
          DEFAULT: "#ffba61",
          on: "#472a00",
          container: "#ef9900",
          "on-container": "#5c3800",
        },
        error: {
          DEFAULT: "#ffb4ab",
          on: "#690005",
          container: "#93000a",
          "on-container": "#ffdad6",
        },
        asset: {
          stocks: "#94a3b8",
          indices: "#818cf8",
          forex: "#60a5fa",
          crypto: "#c084fc",
          commodities: "#f59e0b",
          futures: "#2dd4bf",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
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
