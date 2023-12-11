import { nextui } from '@nextui-org/theme/plugin';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      addCommonColors:true
    })
  ],
}

