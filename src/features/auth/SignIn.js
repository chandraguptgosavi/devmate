import {getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from "@firebase/auth";
import {Button, CircularProgress, TextField} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {CustomSnackbar} from "app/components";
import {useIsComponentMounted} from "app/hooks";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, Route, useHistory,} from "react-router-dom";
import Routes from "routes/types";
import AuthBackground from "./AuthBackground";
import {authenticateAsync, selectAuthenticated,} from "./authSlice";
import {isValidEmail, isValidPassword, isValidSignIn, useStyle} from "./utils";

function Component() {
  const isAuthenticated = useSelector(selectAuthenticated);
  const style = useStyle();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [resetMailSent, setResetMailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const isComponentMounted = useIsComponentMounted();

  /**
   * if user is logged in, redirect to home page
   */
  if (isAuthenticated) {
    return <Route render={() => {
      return <Redirect to={Routes.FEED}/>
    }}/>
  }

  const onEmailChange = (element) => {
    const email = element.target.value.trim();
    setEmail(email);
    const validMail = isValidEmail(email);
    if (!validMail) {
      setMailError(true);
    } else {
      setMailError(false);
    }
  };

  const onPasswordChange = (element) => {
    const password = element.target.value.trim();
    setPassword(password);
    const validPassword = isValidPassword(password);
    if (!validPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };
  
  const signIn = async (event) => {
    event.preventDefault();
    const valid = isValidSignIn( email, password);
    if (!valid) {
      setMailError(true);
      setPasswordError(true);
    }
    if (valid && !mailError && !passwordError) {
      setIsLoading(true);
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (isComponentMounted.current) {
          setIsLoading(false);
          dispatch(authenticateAsync(true));
          history.push(Routes.FEED);
        }
      } catch (err) {
        if (isComponentMounted.current) {
          setIsLoading(false);
          setMessage(err.message);
          setIsOpen(true);
        }
      }
    }
  };

  const resetPassword = async () => {
    if (isValidEmail(email)) {
      setMailError(false);
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        setResetMailSent(true);
      } catch (error) {
        if (isComponentMounted.current) {
          setIsOpen(true);
        }
      }
    } else {
      setMailError(true);
    }
  }

  return (
    <div className="flex w-full md:w-1/2 h-full overflow-auto flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="text-2xl font-bold">Welcome Back</p>
        <p className="font-light">
          New to DevMate?{" "}
          <Button
            color="primary"
            onClick={() => {
              history.push(Routes.SIGNUP);
            }}
            disableRipple
          >
            Sign Up
          </Button>
        </p>
      </div>
      <form
        className="
              flex 
            flex-col 
            items-center 
            justify-around
            m-2
            w-4/5`
            "
      >
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
          type="password"
          value={password}
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
          className={`${style.formField} ${style.button} w-3/5`}
          onClick={signIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size="1.7em" color="primary" />
          ) : (
            <span>Sign In</span>
          )}
        </Button>
      </form>
      <div className="flex justify-evenly w-4/5 items-center">
        <p className="font-light text-sm">
          Forgot your Password?
          <Button
            color="primary"
            onClick={resetPassword}
            disableRipple
            disabled={resetMailSent}
          >
            Reset Password
          </Button>
        </p>
      </div>
      {resetMailSent && (
          <Alert severity="success">Password reset mail sent successfully!</Alert>
      )}
      <CustomSnackbar isOpen={isOpen} setIsOpen={setIsOpen} message={message.length > 0 && message}/>
    </div>
  );
}

function SignIn() {
  return (
    <AuthBackground>
      <Component />
    </AuthBackground>
  );
}
export default SignIn;
