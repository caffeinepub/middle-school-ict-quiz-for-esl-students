/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["'Cinzel'", "serif"],
        "cinzel-decorative": ["'Cinzel Decorative'", "serif"],
        garamond: ["'EB Garamond'", "Georgia", "serif"],
        sans: ["'EB Garamond'", "Georgia", "serif"],
      },
      colors: {
        "egyptian-gold": "oklch(0.75 0.18 75)",
        "egyptian-gold-dark": "oklch(0.60 0.16 70)",
        "egyptian-turquoise": "oklch(0.65 0.15 200)",
        "egyptian-sand": "oklch(0.85 0.08 80)",
        "egyptian-lapis": "oklch(0.35 0.14 260)",
        "egyptian-crimson": "oklch(0.50 0.20 25)",
        "egyptian-dark": "oklch(0.10 0.02 55)",
        "egyptian-panel": "oklch(0.16 0.04 55)",
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        gold: "0 0 20px oklch(0.75 0.18 75 / 0.4)",
        "gold-lg": "0 0 40px oklch(0.75 0.18 75 / 0.5)",
        turquoise: "0 0 20px oklch(0.65 0.15 200 / 0.4)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
