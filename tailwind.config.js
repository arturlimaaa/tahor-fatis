/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Cinzel Decorative"', 'cursive'],
        body: ['"IM Fell English"', 'serif'],
      },
    },
  },
  plugins: [],
}