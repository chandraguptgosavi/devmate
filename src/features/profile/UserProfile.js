import {useIsComponentMounted, useStyle} from "app/hooks";
import CoverImage from "assets/profile-cover-3.svg";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {selectIsUserPresent, selectUserConnections, selectUserID, userUpdatedAsync} from "features/auth/authSlice";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {AppBar, CustomSnackbar, LoadingIndicator} from "app/components";
import EditProfile from "./EditProfile";
import {Intro, MainSection} from "./ProfileSections";
import {currentProfileConnectionStatusUpdatedAsync} from "./profileSlice";

function UserProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(
      window.innerWidth >= 640 ? 0 : -1
  );
  const [editIndex, setEditIndex] = useState(-1);
  const userConnections = useSelector(selectUserConnections);
  const userID = useSelector(selectUserID);
  const isUserPresent = useSelector(selectIsUserPresent);
  const [isOpen, setIsOpen] = useState(false);
  const {profileID} = useParams();
  const style = useStyle();
  const dispatch = useDispatch();
  const isComponentMounted = useIsComponentMounted();
  const isEditable = userID === profileID;

  // change layout if device width changes
  const onWindowResize = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 640 && selectedIndex === -1) {
      setSelectedIndex(0);
    } else if (viewportWidth < 640 && selectedIndex !== -1) {
      setSelectedIndex(-1);
    }
  }

  window.addEventListener("resize", onWindowResize);

  const onSectionSelected = (event, index) => {
    setSelectedIndex(index);
  };

  const loadProfile = async () => {
    try {
      const db = getFirestore();
      const snapshot = await getDoc(doc(db, "users", profileID));
      if (!isEditable) {
        if (isUserPresent) {
          if (isComponentMounted.current) {
            if (userConnections.connected.some((uid) => uid === profileID)) {
              dispatch(currentProfileConnectionStatusUpdatedAsync("connected"));
            } else if (
              userConnections.received.some((uid) => uid === profileID)
            ) {
              dispatch(
                currentProfileConnectionStatusUpdatedAsync("request_received")
              );
            } else if (userConnections.sent.some((uid) => uid === profileID)) {
              dispatch(
                currentProfileConnectionStatusUpdatedAsync("request_sent")
              );
            }
          }
        } else {
          const userSnapshot = await getDoc(doc(db, "users", userID));
          if (isComponentMounted.current) {
            if (
              userSnapshot
                .data()
                .connections.connected.some((uid) => uid === profileID)
            ) {
              dispatch(currentProfileConnectionStatusUpdatedAsync("connected"));
            } else if (
              userSnapshot
                .data()
                .connections.received.some((uid) => uid === profileID)
            ) {
              dispatch(
                currentProfileConnectionStatusUpdatedAsync("request_received")
              );
            } else if (
              userSnapshot
                .data()
                .connections.sent.some((uid) => uid === profileID)
            ) {
              dispatch(
                  currentProfileConnectionStatusUpdatedAsync("request_sent")
              );
            }
            dispatch(
                userUpdatedAsync({...userSnapshot.data(), isPresent: true})
            );
          }
        }
      }
      if (isComponentMounted.current) {
        setCurrentUser(snapshot.data());
      }
    } catch (err) {
      if (isComponentMounted.current) {
        setIsOpen(true);
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="relative flex flex-col items-center h-screen">
      {currentUser ? (
        <>
          <AppBar showSearchOption={false} showProfileOption={false} />
          <div
            className="w-full
              flex
              justify-center
              h-1/4 
              overflow-hidden
            bg-colorPrimaryDark"
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
            profileID={profileID}
            isEditable={isEditable}
            setCurrentUser={setCurrentUser}
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
      <CustomSnackbar isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  );
}

export default UserProfile;
