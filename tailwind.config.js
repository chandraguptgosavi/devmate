const colorPrimaryLight = "#D8FBE9";
const colorPrimary = "#20AB8A";
const colorPrimaryDark = "#007b5d";
const colorLightGrey = "#F1F2F6";
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        colorPrimary: colorPrimary,
        colorPrimaryLight: colorPrimaryLight,
        colorPrimaryDark: colorPrimaryDark,
        colorLightGrey: colorLightGrey,
      },
      fontFamily: {
        serif: ["Poppins", "Urbanist", "Roboto", "sans-serif"],
      },
      height: {
        "26%": "26%",
        "27%": "27%",
        "28%": "28%",
        "29%": "29%",
        "30%": "30%",
        "1/6vh": "16.666667vh",
        "10vh": "10vh",
        "12vh": "12vh",
        "1/12vh": "8.333333vh",
      },
      maxHeight: {
        "180px": "180px",
        "200px": "200px",
        "220px": "220px",
        "250px": "250px",
      },

    },
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
