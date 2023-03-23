const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({addVariant}) {
      addVariant('no-hover', '@media (hover: none)');

      addVariant('pointer-coarse', '@media (pointer: coarse')
      addVariant('pointer-fine', '@media (pointer: fine)')
    })
  ],
}
