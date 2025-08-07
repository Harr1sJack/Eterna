import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        slabo: ['"Slabo 27px"', 'serif']
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark","forest","business","light","garden","bumblebee","emerald"]
  }
}

