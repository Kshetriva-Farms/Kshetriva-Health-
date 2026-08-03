/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F9F5',
          100: '#E0F3EC',
          200: '#BDE4D7',
          300: '#8ECDBC',
          400: '#53AE99',
          500: '#1B4D3E', // Primary Organic Emerald
          600: '#164034',
          700: '#12332A',
          800: '#0E261F',
          900: '#0A1A15',
        },
        harvest: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706', // Sunlight Amber
          600: '#B45309',
        },
        surface: {
          light: '#F4F7F5',
          dark: '#0B1612',
          'card-light': '#FFFFFF',
          'card-dark': '#13231D',
          'glass-light': 'rgba(255, 255, 255, 0.75)',
          'glass-dark': 'rgba(19, 35, 29, 0.75)',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(27, 77, 62, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'md3-1': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        'md3-2': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        'md3-3': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
