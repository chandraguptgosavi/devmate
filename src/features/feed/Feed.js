import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, getFirestore,} from "firebase/firestore";
import {AppBar, CustomSnackbar} from "app/components";
import {
  profilesLoadedAsync,
  profilesLoading,
  profilesLoadingAsync,
  requestProfilesLoadedAsync,
  selectFilteredProfiles,
  selectIsSearchBoxVisible,
  selectProfiles,
  selectRequestProfiles,
  selectTabIndex,
} from "./feedSlice";
import {userStatusUpdatedAsync, userUpdatedAsync} from "features/auth/authSlice";
import MainSection from "./MainSection";
import FeedTabs from "./Tabs";
import {getAuth} from "firebase/auth";
import {useIsComponentMounted} from "app/hooks";

function Feed() {
  const profiles = useSelector(selectProfiles);
  const requestProfiles = useSelector(selectRequestProfiles);
  const filteredProfiles = useSelector(selectFilteredProfiles);
  const isSearchBoxVisible = useSelector(selectIsSearchBoxVisible);
  const tabIndex = useSelector(selectTabIndex);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const isComponentMounted = useIsComponentMounted();

  const loadDeveloperProfiles = async () => {
    dispatch(profilesLoading(true));
    try {
      const db = getFirestore();
      const auth = getAuth();
      const profilesSnapshot = await getDocs(collection(db, "users"));
      const userID = auth.currentUser.uid;
      const requestProfilesSnapshot = await getDoc(
        doc(db, "users", userID)
      );
      const userConnections = requestProfilesSnapshot.data().connections;
      const profilesData = [];
      const requestProfilesData = [];
      profilesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== userID) {
          if (userConnections.received.some((uid) => uid === doc.id)) {
            requestProfilesData.push({
              uid: doc.id,
              profilePicture: data.profilePicture,
              firstName: data.firstName,
              headline: data.headline,
              github: data.github,
              about: data.about,
              education: data.education,
              skills: data.skills,
              connections: data.connections,
              connectionStatus: "normal",
            });
            return;
          }
          /**
           * add profile to show in feed if current developer is not present
           * in the 'sent connection request' list and 'received connection request' list
           * of currently logged user
           */
          if (
              !userConnections.sent.some((uid) => uid === doc.id) &&
              !userConnections.connected.some((uid) => uid === doc.id)
          ) {
            profilesData.push({
              uid: doc.id,
              profilePicture: data.profilePicture,
              firstName: data.firstName,
              headline: data.headline,
              github: data.github,
              about: data.about,
              education: data.education,
              skills: data.skills,
              connections: data.connections,
              connectionStatus: "normal",
            });
          }
        } else {
          if (isComponentMounted.current) {
            dispatch(
              userUpdatedAsync({
                profilePicture: data.profilePicture,
                firstName: data.firstName,
                headline: data.headline,
                github: data.github,
                about: data.about,
                education: data.education,
                skills: data.skills,
                connections: data.connections,
              })
            );
            dispatch(userStatusUpdatedAsync(true));
          }
        }
      });
      if (isComponentMounted.current) {
        dispatch(profilesLoadedAsync(profilesData));
        dispatch(profilesLoadingAsync(false));
        dispatch(requestProfilesLoadedAsync(requestProfilesData));
      }
    } catch (err) {
      if (isComponentMounted.current) {
        setIsOpen(true);
      }
    }
  };

  useEffect(() => {
    loadDeveloperProfiles();
  }, []);

  return (
    <div className="w-full min-h-screen">
      <div className="sticky top-0 z-50 bg-colorPrimary">
        <AppBar showHomeOption={false} />
        <FeedTabs />
      </div>
      <MainSection
          profiles={
            isSearchBoxVisible
                ? filteredProfiles
                : tabIndex === 0
                    ? profiles
                    : requestProfiles
          }
      />
      <CustomSnackbar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
      />
    </div>
  );
}

export default Feed;
