/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        comfortaa: ['Comfortaa', 'cursive'],
        oswald: ['Oswald', 'sans-serif'],
        pixelify: ['Pixelify Sans', 'cursive'],
        jersey: ['Jersey 10', 'sans-serif'],
      },
    },
  },
  plugins: [],
}