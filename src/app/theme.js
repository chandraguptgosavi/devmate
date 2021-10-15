import { createTheme } from "@material-ui/core";
import { colorPrimary, colorPrimaryDark, colorPrimaryLight } from "./colors";

const theme = createTheme({
  palette: {
    primary: {
      light: colorPrimaryLight,
      main: colorPrimary,
      dark: colorPrimaryDark,
    },
    action: {
      disabledBackground: "#D8FBE9",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Urbanist', 'Roboto', sans-serif",
    button: {
        textTransform: "none",
        color: "white"
    },
  },
});

export default theme;