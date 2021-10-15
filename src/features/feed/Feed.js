import { selectUserID } from "features/profile/userSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authenticateAsync } from "features/auth/authSlice";
import { signedInAsync } from "features/profile/userSlice";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";

function AppBar() {
  const dispatch = useDispatch();

  const logOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(authenticateAsync(false));
      dispatch(signedInAsync(null));
    } catch (err) {
      console.log(`error from App bar: ${err}`);
    }
  };

  return (
    <div className="bg-colorPrimary w-full h-16 flex ">
      <span className="ml-auto" onClick={logOut}>Sign Out</span>
    </div>
  );
}

function Feed() {
  return (
    <div className="w-full">
      <AppBar />
    </div>
  );
}

export default Feed;
