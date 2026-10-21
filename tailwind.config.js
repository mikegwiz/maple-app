/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        brand: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
