import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#ff6b6b",
        },
        point: "#00d2d3",
        "point-hover": "#01a3a4",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
