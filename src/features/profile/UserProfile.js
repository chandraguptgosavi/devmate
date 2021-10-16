import { makeStyles } from "@material-ui/core";
import CoverImage from "assets/profile-cover-3.svg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUserID } from "./userSlice";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { LoadingIndicator } from "app/components";
import EditProfile from "./EditProfile";
import { Intro, MainSection } from "./ProfileSections";

const useStyle = makeStyles((theme) => {
  return {
    chip: {
      backgroundColor: theme.palette.primary.light,
    },
  };
});

function UserProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(
    window.innerWidth >= 640 ? 0 : -1
  );
  const [editIndex, setEditIndex] = useState(-1);
  const { uid } = useParams();
  const style = useStyle();
  const isEditable = useSelector(selectUserID) === uid;
  console.log(isEditable);

  window.onresize = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 640 && selectedIndex === -1) {
      setSelectedIndex(0);
    } else if (viewportWidth < 640 && selectedIndex !== -1) {
      setSelectedIndex(-1);
    }
  };

  const onSectionSelected = (event, index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    let unsubscribe = null;
    try {
      const db = getFirestore();
      getDoc(doc(db, "users", uid)).then((snapshot) =>
        setCurrentUser(snapshot.data())
      );
    } catch (err) {
      console.log(`error from user profile: ${err}`);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center h-screen">
      {currentUser ? (
        <>
          <div
            className="w-full
              flex
              justify-center
              h-1/4 
              overflow-hidden
            bg-colorPrimary"
          >
            <img
              className="w-full md:w-3/4 lg:w-2/3 object-cover"
              src={CoverImage}
              alt="cover"
            />
          </div>
          <Intro
            editIndex={editIndex}
            currentUser={currentUser}
            isEditable={isEditable}
            setEditIndex={setEditIndex}
          />
          <MainSection
            editIndex={editIndex}
            selectedIndex={selectedIndex}
            isEditable={isEditable}
            setEditIndex={setEditIndex}
            currentUser={currentUser}
            style={style}
            onSectionSelected={onSectionSelected}
          />
          <EditProfile
            editIndex={editIndex}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setEditIndex={setEditIndex}
            style={style}
          />
        </>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}

export default UserProfile;
