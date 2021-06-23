/* eslint-disable global-require */
module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './slices/**/*.{js,jsx}',
    './app/**/*.{js,jsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        amazon_blue: {
          light: '#232F3E',
          DEFAULT: '#131921'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
