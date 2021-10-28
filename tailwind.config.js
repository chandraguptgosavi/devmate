const colorPrimaryLight = "#D8FBE9";
const colorPrimary = "#20AB8A";
const colorPrimaryDark = "#007b5d";
const colorLightGrey = "#F1F2F6";
const colorLightGreyVariant = "#EBF4FB";
const colorSecondaryLight = "#ff8851";
const colorSecondary = "#fd5523";
const colorSecondaryDark = "#c21900";
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
        colorLightGreyVariant: colorLightGreyVariant,
        colorSecondary: colorSecondary,
        colorSecondaryLight: colorSecondaryLight,
        colorSecondaryDark: colorSecondaryDark,
      },
      fontFamily: {
        serif: ["Poppins", "Urbanist", "Roboto", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.6rem",
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
        "40vh": "40vh",
        "1/2vh": "50vh",
        "1/3vh": "33.333333vh",
        "2/3vh": "66.666667vh",
        "1/4vh": "25vh",
        "3/4vh": "75vh",
        "1/12vh": "8.333333vh",
        "10/12vh": "83.333333vh",
        "11/12vh": "91.666667vh",
        "1/12": "8.333333%",
        "11/12": "91.666667%",
      },
      maxHeight: {
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/2": "50%",
        "1/2vh": "50vh",
        "3/5vh": "60vh",
        "80px": "80px",
        "90px": "90px",
        "100px": "100px",
        "180px": "180px",
        "200px": "200px",
        "220px": "220px",
        "250px": "250px",
      },
      minHeight: {
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "2/5vh": "40vh",
        "1/2vh": "50vh",
        "40px": "40px",
        "180px": "180px",
        "200px": "200px",
        "220px": "220px",
        "250px": "250px",
      },
      minWidth: {
        2: "0.5rem",
        4: "1rem",
        16: "4rem",
        20: "5rem",
      },
      maxWidth: {
        "2/3": "66.666667%",
        "3/4": "75%",
        "4/5": "80%",
        "60px": "60px",
        "70px": "70px",
        "100px": "100px",
      },
      inset: { "1/12vh": "8.333333vh" },
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
