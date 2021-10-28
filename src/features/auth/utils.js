const { makeStyles } = require("@material-ui/core");

export const useStyle = makeStyles({
    formField: {
      margin: "0.5em",
    },
    button: {
      color: "white",
      marginTop: "1.5em",
    },
  });

export const isValidFirstName = (firstName) => {
  return firstName.trim().length >= 2;
};

export const isValidEmail = (email) => {
  const regExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(String(email).toLowerCase());
};

export const isValidPassword = (password) => {
  return password.length >= 6;
};

export const isValidSignUp = (firstName, email, password) => {
  return (
    isValidFirstName(firstName) &&
    isValidEmail(email) &&
    isValidPassword(password)
  );
};

export const isValidSignIn = (email, password) => {
  return isValidEmail(email) && isValidPassword(password);
};
