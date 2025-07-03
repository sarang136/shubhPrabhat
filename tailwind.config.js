/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        marathi: ['"Tiro Devanagari Marathi"', 'serif'],
      },
    },
  },
  plugins: [],
}