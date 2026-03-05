/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // Egyptian legacy tokens
        'egyptian-gold': 'var(--egyptian-gold)',
        'egyptian-gold-dark': 'var(--egyptian-gold-dark)',
        'egyptian-turquoise': 'var(--egyptian-turquoise)',
        'egyptian-sand': 'var(--egyptian-sand)',
        'egyptian-lapis': 'var(--egyptian-lapis)',
        'egyptian-crimson': 'var(--egyptian-crimson)',
        'egyptian-dark': 'var(--egyptian-dark)',
        'egyptian-panel': 'var(--egyptian-panel)',
        'egyptian-border': 'var(--egyptian-border)',

        // Dark Tactical / Iron Command tokens
        'deep-sand-dark': 'var(--deep-sand-dark)',
        'aged-bronze': 'var(--aged-bronze)',
        'ember-gold': 'var(--ember-gold)',
        'deep-lapis-dark': 'var(--deep-lapis-dark)',
        'command-panel': 'var(--command-panel-bg)',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        'cinzel-decorative': ['Cinzel Decorative', 'serif'],
        garamond: ['EB Garamond', 'Georgia', 'serif'],
        mono: ['"Roboto Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'egyptian-glow': '0 0 20px oklch(0.75 0.18 75 / 0.4)',
        'ember-glow': '0 0 20px oklch(0.78 0.18 78 / 0.4)',
        'bronze-glow': '0 0 12px oklch(0.48 0.10 65 / 0.4)',
        'turquoise-glow': '0 0 16px oklch(0.62 0.14 200 / 0.4)',
        'crimson-glow': '0 0 16px oklch(0.50 0.20 25 / 0.4)',
        'command-panel': 'inset 0 0 40px oklch(0.05 0.02 55 / 0.6), 0 4px 20px oklch(0.05 0.02 55 / 0.8)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'battle-flash': 'battle-flash 0.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px oklch(0.78 0.18 78 / 0.4)' },
          '50%': { boxShadow: '0 0 20px oklch(0.78 0.18 78 / 0.8), 0 0 40px oklch(0.78 0.18 78 / 0.3)' },
        },
        'battle-flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
