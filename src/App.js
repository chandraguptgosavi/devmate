import React, {Suspense, useEffect, useState} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SignUp from "features/auth/SignUp";
import SignIn from "features/auth/SignIn";
import PrivateRoute from "routes/PrivateRoute";
import {useDispatch} from "react-redux";
import {authenticate, signedIn} from "features/auth/authSlice";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import Routes from "routes/types";
import {CustomSnackbar, FallbackComponent, NotFound} from "app/components";
import {useIsComponentMounted} from "app/hooks";

const Feed = React.lazy(() => import("features/feed/Feed"));
const CreateProfile = React.lazy(() =>
    import("features/profile/CreateProfile")
);
const UserProfile = React.lazy(() => import("features/profile/UserProfile"));
const Chat = React.lazy(() => import("features/chat/Chat"));

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);
  const isComponentMounted = useIsComponentMounted();

  if (user) {
    dispatch(signedIn(user.uid));
    dispatch(authenticate(true));
  }

  useEffect(() => {
    let unsubscribe = null;
    try {
      const auth = getAuth();
      unsubscribe = onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: authUser.uid,
            })
          );
            dispatch(signedIn(authUser.uid));
        } else {
          localStorage.removeItem("user");
        }
      });
    } catch (error) {
      if (isComponentMounted.current) {
        setIsOpen(true);
      }
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path={Routes.FEED}>
          <Suspense fallback={<FallbackComponent />}>
            <Feed />
          </Suspense>
        </PrivateRoute>
        <PrivateRoute exact path={Routes.CREATE_PROFILE}>
          <Suspense fallback={<FallbackComponent />}>
            <CreateProfile />
          </Suspense>
        </PrivateRoute>
        <PrivateRoute exact path={`${Routes.PROFILE}/:profileID`}>
          <Suspense fallback={<FallbackComponent />}>
            <UserProfile />
          </Suspense>
        </PrivateRoute>
        <PrivateRoute exact path={Routes.CHAT}>
          <Suspense fallback={<FallbackComponent />}>
            <Chat />
          </Suspense>
        </PrivateRoute>
        <Route exact path={Routes.LOGIN}>
          <SignIn />
        </Route>
        <Route exact path={Routes.SIGNUP}>
          <SignUp />
        </Route>
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
      <CustomSnackbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </BrowserRouter>
  );
}

export default App;
