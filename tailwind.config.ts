import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0D6E6E',
          light: '#1A9090',
          dark: '#0A5555',
          50: '#E8F4F4',
          100: '#C5E4E4',
          200: '#9ECFCF',
          300: '#6FBABA',
          400: '#3DA5A5',
          500: '#0D6E6E',
          600: '#0B5F5F',
          700: '#094F4F',
          800: '#073F3F',
          900: '#052E2E',
        },
        gold: {
          DEFAULT: '#C9963A',
          light: '#DBA84A',
          dark: '#A87A2A',
          50: '#FDF6EC',
          100: '#F9E9CC',
          200: '#F2D49F',
          300: '#EBBE72',
          400: '#DBA84A',
          500: '#C9963A',
          600: '#A87A2A',
          700: '#875E1E',
          800: '#664514',
          900: '#452D09',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F5F4F2',
          200: '#E8E6E3',
          300: '#D4D1CC',
          400: '#B8B3AC',
          500: '#9C968E',
          600: '#7A746C',
          700: '#5C5750',
          800: '#3E3A35',
          900: '#221F1B',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.08)',
        modal: '0 20px 60px -10px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}

export default config
