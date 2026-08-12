import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        unsw: {
          yellow: "#FFE600",
          "yellow-dark": "#E6CE00",
          charcoal: "#231F20",
        },
        paper: "#F6F6F4",
        line: "#E4E2DC",
        muted: "#6B6862",
        ink: "#231F20",
        status: {
          approved: "#2F7D5C",
          "approved-bg": "#E7F3ED",
          pending: "#C97A1A",
          "pending-bg": "#FBEEDD",
          rejected: "#B23B2E",
          "rejected-bg": "#F8E9E7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        plate: "4px 4px 0 0 #231F20",
        brutal: "4px 4px 0 0 #231F20",
      },
    },
  },
  plugins: [],
};

export default config;
