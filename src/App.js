import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignUp from "features/auth/SignUp";
import SignIn from "features/auth/SignIn";
import PrivateRoute from "routes/PrivateRoute";
import { useDispatch } from "react-redux";
import { authenticate } from "features/auth/authSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Routes from "routes/types";
import { FallbackComponent, NotFound } from "app/components";

const CreateProfile = React.lazy(() =>
  import("features/profile/CreateProfile")
);
const UserProfile = React.lazy(() => import("features/profile/UserProfile"));

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
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
          dispatch(authenticate(true));
        } else {
          localStorage.removeItem("user");
        }
      });
    } catch (error) {
      console.log(error);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path={Routes.CREATEPROFILE}>
          <Suspense fallback={<FallbackComponent />}>
            <CreateProfile />
          </Suspense>
        </PrivateRoute>
        <PrivateRoute exact path={`${Routes.PROFILE}/:uid`}>
          <Suspense fallback={<FallbackComponent />}>
            <UserProfile />
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
    </BrowserRouter>
  );
}

export default App;
