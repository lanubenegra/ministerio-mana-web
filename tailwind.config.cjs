
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
        brand: {
          DEFAULT: '#293C74',
          dark: '#1A255C',
          medium: '#3F58A1',
          light: '#E7ECFF',
          teal: '#28A6BD'
        },
        accent: {
          DEFAULT: '#F6519B',
          soft: '#FF8AB8'
        },
        neutral: {
          50: '#F8F9FB',
          100: '#F1F3F8',
          200: '#E3E6EF',
          500: '#6C748C',
          700: '#3B4258',
          900: '#1C2130'
        }
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
        'mana-gradient': 'linear-gradient(135deg, #293C74 0%, #28A6BD 50%, #F6519B 100%)',
        'mana-accent': 'linear-gradient(135deg, rgba(41,60,116,0.12) 0%, rgba(246,81,155,0.18) 100%)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};
