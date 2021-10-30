import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress } from "@material-ui/core";
import {
  filteredProfilesLoaded,
  filteredProfilesLoadedAsync,
  profilesLoaded,
  profilesLoadedAsync,
  requestProfilesLoaded,
  requestProfilesLoadedAsync,
  selectFilteredProfiles,
  selectIsSearchBoxVisible,
  selectProfiles,
  selectRequestProfiles,
  selectTabIndex,
} from "./feedSlice";
import {
  selectUser,
  selectUserID,
  userUpdatedAsync,
} from "features/auth/authSlice";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useIsComponentMounted } from "app/hooks";
import { CustomSnackbar } from "app/components";
import { useState } from "react";
import Routes from "../../routes/types";
import { useHistory } from "react-router-dom";
import { chatIDChanged, selectedChatChanged } from "features/chat/chatSlice";

/**
 * Handles request when developer wants to connect with other developer
 * @param {String} devID - id for current developer
 * @param {Object} dev - current user info
 * @returns {JSX.Element}
 */
export default function Connect({ devID, dev }) {
  const tabIndex = useSelector(selectTabIndex);
  const user = useSelector(selectUser);
  const userID = useSelector(selectUserID);
  const requestedProfiles = useSelector(selectRequestProfiles);
  const profiles = useSelector(selectProfiles);
  const filteredProfiles = useSelector(selectFilteredProfiles);
  const isSearchBoxVisible = useSelector(selectIsSearchBoxVisible);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const isComponentMounted = useIsComponentMounted();

  const onClick = async () => {
    const db = getFirestore();
    try {
      // connect with unknown developers
      if (tabIndex === 0) {
        // return if request has already been sent
        if (dev.connectionStatus === "request_sent") {
          return;
        }
        dispatch(
          profilesLoaded(
            profiles.map((profile) => {
              if (profile.uid === devID) {
                return {
                  ...profile,
                  connectionStatus: "sending_request",
                };
              }
              return profile;
            })
          )
        );
        if (isSearchBoxVisible) {
          dispatch(
            filteredProfilesLoaded(
              filteredProfiles.map((profile) => {
                if (profile.uid === devID) {
                  return {
                    ...profile,
                    connectionStatus: "sending_request",
                  };
                }
                return profile;
              })
            )
          );
        }
        // add developer to 'sent connection request' list of currently logged user
        const updatedUser = {
          ...user,
          connections: {
            ...user.connections,
            sent: [...user.connections.sent, devID],
          },
        };
        await setDoc(doc(db, "users", userID), updatedUser);
        if (isComponentMounted.current) {
          dispatch(userUpdatedAsync(updatedUser));
        }
        // add currently logged user to 'received connection request' list of developer
        const newDev = { ...dev };
        delete newDev.connectionStatus;
        await setDoc(doc(db, "users", devID), {
          ...newDev,
          connections: {
            ...newDev.connections,
            received: [...newDev.connections.received, userID],
          },
        });
        if (isComponentMounted.current) {
          dispatch(
            profilesLoadedAsync(
              profiles.map((profile) => {
                if (profile.uid === devID) {
                  return { ...profile, connectionStatus: "request_sent" };
                }
                return profile;
              })
            )
          );
          dispatch(
            filteredProfilesLoadedAsync(
              filteredProfiles.map((profile) => {
                if (profile.uid === devID) {
                  return { ...profile, connectionStatus: "request_sent" };
                }
                return profile;
              })
            )
          );
        }
      }
      // connect with developers who are interested in currently logged user's profile
      else {
        if (dev.connectionStatus === "connected") {
          dispatch(
            selectedChatChanged({
              uid: devID,
              firstName: dev.firstName,
              profilePicture: dev.profilePicture,
            })
          );
          dispatch(
            chatIDChanged(
              userID < devID ? `${userID}_${devID}` : `${devID}_${userID}`
            )
          );
          history.push(Routes.CHAT);
        }
        dispatch(
          requestProfilesLoaded(
            requestedProfiles.map((profile) => {
              if (profile.uid === devID) {
                return { ...profile, connectionStatus: "connecting" };
              }
              return profile;
            })
          )
        );
        dispatch(
          filteredProfilesLoaded(
            filteredProfiles.map((profile) => {
              if (profile.uid === devID) {
                return { ...profile, connectionStatus: "connecting" };
              }
              return profile;
            })
          )
        );
        // add developer to 'connected' list of currently logged user
        const updatedUser = {
          ...user,
          connections: {
            ...user.connections,
            received: user.connections.received.filter((id) => id !== devID),
            connected: [...user.connections.connected, devID],
          },
        };
        await setDoc(doc(db, "users", userID), updatedUser);
        if (isComponentMounted.current) {
          dispatch(userUpdatedAsync(updatedUser));
        }
        // add currently logged user to 'connected' list of developer
        const newDev = { ...dev };
        delete newDev.connectionStatus;
        await setDoc(doc(db, "users", devID), {
          ...newDev,
          connections: {
            ...newDev.connections,
            sent: newDev.connections.sent.filter((id) => id !== userID),
            connected: [...newDev.connections.connected, userID],
          },
        });
        // add developer to 'chat list' of currently logged user
        const userChatsSnapshot = await getDoc(doc(db, "user_chats", userID));
        await setDoc(doc(db, "user_chats", userID), {
          ...userChatsSnapshot.data(),
          [devID]: {
            firstName: dev.firstName,
            profilePicture: dev.profilePicture,
            lastMessage: "",
          },
        });
        // add currently logged user to 'chat list' of developer
        const devChatsSnapshot = await getDoc(doc(db, "user_chats", devID));
        await setDoc(doc(db, "user_chats", devID), {
          ...devChatsSnapshot.data(),
          [userID]: {
            firstName: user.firstName,
            profilePicture: user.profilePicture,
            lastMessage: "",
          },
        });
        if (isComponentMounted.current) {
          dispatch(
            requestProfilesLoadedAsync(
              requestedProfiles.map((profile) => {
                if (profile.uid === devID) {
                  return { ...profile, connectionStatus: "connected" };
                }
                return profile;
              })
            )
          );
          dispatch(
            filteredProfilesLoadedAsync(
              filteredProfiles.map((profile) => {
                if (profile.uid === devID) {
                  return { ...profile, connectionStatus: "connected" };
                }
                return profile;
              })
            )
          );
        }
      }
    } catch (err) {
      console.log(err.message);
      if (isComponentMounted.current) {
        setIsOpen(true);
      }
    }
  };

  return (
    <div style={{ boxShadow: "1px -0.4em 0.4em #949494" }} className="mt-auto">
      <Button
        color="primary"
        variant="contained"
        className="w-full"
        disabled={
          dev.connectionStatus === "sending_request" ||
          dev.connectionStatus === "connecting"
        }
        onClick={onClick}
      >
        {dev.connectionStatus === "normal" && (
          <span className="text-white">Connect With {dev.firstName}</span>
        )}
        {(dev.connectionStatus === "sending_request" ||
          dev.connectionStatus === "connecting") && (
          <CircularProgress size="1.7em" color="primary" />
        )}
        {dev.connectionStatus === "request_sent" && (
          <span className="text-white">Request Sent</span>
        )}
        {dev.connectionStatus === "connected" && (
          <span className="text-white">Message {dev.firstName}</span>
        )}
      </Button>
      <CustomSnackbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
