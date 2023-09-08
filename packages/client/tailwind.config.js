/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arcade: ['ArcadeClassic'],
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['lofi'],
  },
};
