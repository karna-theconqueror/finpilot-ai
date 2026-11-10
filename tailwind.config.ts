import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080D1A',
          secondary: '#111C32',
          card: '#151F35',
        },
        brand: {
          blue: '#1677FF',
          violet: '#795BFF',
          green: '#19C7A1',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A7B2C4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.25)',
        glow: '0 0 0 1px rgba(22,119,255,0.25), 0 8px 30px rgba(22,119,255,0.15)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
