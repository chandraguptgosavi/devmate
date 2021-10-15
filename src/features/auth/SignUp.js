import { Button, CircularProgress, TextField } from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  authenticateAsync,
  selectAuthenticated,
} from "./authSlice";
import {
  isValidFirstName,
  isValidEmail,
  isValidPassword,
  isValidSignUp,
  useStyle,
} from "./utils";
import { Redirect, Route, useHistory } from "react-router-dom";
import Routes from "routes/types";
import AuthBackground from "./AuthBackground";
import { doc, getFirestore, setDoc } from "firebase/firestore";

function Component() {
  const isAuthenticated = useSelector(selectAuthenticated);
  const style = useStyle();
  const history = useHistory();
  const [firstName, setfirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const onFirstNameChange = (element) => {
    const name = element.target.value.trim();
    setfirstName(name);
    if (!isValidFirstName(name)) {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
  };

  const onEmailChange = (element) => {
    const email = element.target.value.trim().toLowerCase();
    setEmail(email);
    if (!isValidEmail(email)) {
      setMailError(true);
    } else {
      setMailError(false);
    }
  };

  const onPasswordChange = (element) => {
    const password = element.target.value.trim();
    setPassword(password);
    if (!isValidPassword(password)) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const signUp = async (event) => {
    event.preventDefault();
    const valid = isValidSignUp(firstName, email, password);
    if (!valid) {
      setMailError(true);
      setFirstNameError(true);
      setPasswordError(true);
    }
    if (valid && !firstNameError && !mailError && !passwordError) {
      setIsLoading(true);
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(
          auth,
          email,             
          password
        );
        await updateProfile(auth.currentUser, {
          displayName: firstName,
        });
        await setDoc(doc(getFirestore(), "users", auth.currentUser.uid), {
          firstName: firstName,
        });
        setIsLoading(false);
        dispatch(
          authenticateAsync(true)
        );
      } catch (err) {
        console.log(`sign up error: ${err}`);
      }
    }
  };

  return (
    <div className="flex w-full overflow-y-auto md:w-1/2 flex-col items-center justify-center">
      <p className="text-2xl font-bold">Get Started</p>
      <p className="font-light">
        Already have account?{" "}
        <Button
          color="primary"
          onClick={() => {
            history.push(Routes.LOGIN);
          }}
          disableRipple
        >
          Sign In
        </Button>
      </p>
      <form
        action=""
        className="
            flex 
          flex-col 
          items-center 
          justify-around
          m-2
          w-4/5
          "
      >
        <TextField
          label="First Name"
          className={style.formField}
          fullWidth
          size="small"
          value={firstName}
          onChange={onFirstNameChange}
          error={firstNameError}
          helperText={firstNameError ? "Enter valid first name" : null}
          required
        />
        <TextField
          label="Email"
          className={style.formField}
          fullWidth
          size="small"
          value={email}
          onChange={onEmailChange}
          error={mailError}
          helperText={mailError ? "Enter valid email" : null}
          required
        />
        <TextField
          label="Password"
          className={style.formField}
          fullWidth
          size="small"
          value={password}
          type="password"
          onChange={onPasswordChange}
          error={passwordError}
          helperText={
            passwordError ? "Password must be at least 6 characters long" : null
          }
          required
        />
        <Button
          variant="contained"
          color="primary"
          className={`${style.formField} 
            ${style.button} 
            w-3/5 `}
          onClick={signUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress
              size="1.7em"
              color="primary"
            />
          ) : (
            <span> Sign Up </span>
          )}
        </Button>
      </form>
      <div className="flex justify-evenly w-4/5 items-center">
        <div className="bg-gray-300 h-px w-1/3"></div>
        <p className="text-sm text-center font-light mx-2">...</p>
        <div className="bg-gray-300 h-px w-1/3"></div>
      </div>
    </div>
  );
}

function SignUp() {
  return (
    <AuthBackground>
      <Component />
    </AuthBackground>
  );
}

export default SignUp;
