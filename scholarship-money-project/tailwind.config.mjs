/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lemon: {
          25: '#FFFEF2',
          50: '#FFF9DB',
          100: '#FFFBEB',
          200: '#FDE68A',
          300: '#FBBF24',
        },
      },
    },
  },
  plugins: [],
}