/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#cc0000',
        'bg-dark': '#121212',
        'text-light': '#ffffff',
        'text-muted': '#999999',
      },
      fontFamily: {
        michroma: ['Michroma', 'sans-serif'],
        sans: ['"Electrolize"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
