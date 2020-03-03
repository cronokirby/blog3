const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      colors: {
        main: {
          ...colors.blue,
        },
      },
      fontSize: {
        '8xl': '6rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
