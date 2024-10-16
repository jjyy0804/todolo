/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#599BFF',
        secondary: '#9AC2F9',
        third: '#DFEDF9',
        darkgray: '#4b4b4b', //기본 폰트 컬러
        softgray: '#8F97A9',
        hoverprimary: '#257ada',
        hoversecondary: '#DFEDF9',
      },
    },
  },
  plugins: [],
};
