
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Intro"', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['"Intro"', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        cosmic: {
          900: 'rgb(var(--cosmic-void) / <alpha-value>)',
          800: 'rgb(var(--cosmic-nebula) / <alpha-value>)',
        },
        starlight: {
          100: 'rgb(var(--text-main) / <alpha-value>)',
          300: 'rgb(var(--text-muted) / <alpha-value>)',
          500: 'rgb(var(--text-faint) / <alpha-value>)',
        },
        accent: {
          cyan: 'rgb(var(--accent-cyan) / <alpha-value>)',
          gold: 'rgb(var(--accent-gold) / <alpha-value>)',
        },
        // Legacy support
        brand: {
          DEFAULT: 'rgb(var(--cosmic-void) / <alpha-value>)',
          dark: '#0B0D17',
          medium: '#3F58A1',
          light: '#CBD9E6',
          teal: '#28A6BD'
        },
      },
      boxShadow: {
        brand: '0 14px 40px -18px rgba(41, 60, 116, 0.45)',
        brandHover: '0 24px 48px -16px rgba(246, 81, 155, 0.35)',
        brandInset: 'inset 0 1px 0 rgba(255,255,255,0.24)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      backgroundImage: {
        'mana-gradient': 'linear-gradient(135deg, #293C74 0%, #28A6BD 55%, #567C8D 100%)',
        'mana-accent': 'linear-gradient(135deg, rgba(41,60,116,0.12) 0%, rgba(86,124,141,0.16) 100%)'
      }
    },
    animation: {
      'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};
