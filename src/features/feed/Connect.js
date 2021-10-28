import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress } from "@material-ui/core";
import {
  profilesLoaded,
  profilesLoadedAsync,
  requestProfilesLoaded,
  requestProfilesLoadedAsync,
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

export default function Connect({ devID, dev }) {
  const tabIndex = useSelector(selectTabIndex);
  const user = useSelector(selectUser);
  const userID = useSelector(selectUserID);
  const requestedProfiles = useSelector(selectRequestProfiles);
  const profiles = useSelector(selectProfiles);
  const dispatch = useDispatch();
  const isComponentMounted = useIsComponentMounted();

  const onClick = async () => {
    const db = getFirestore();
    if (tabIndex === 0) {
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
      }
    } else {
      if (dev.connectionStatus === "connected") {
        return;
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
      const userChatsSnapshot = await getDoc(doc(db, "user_chats", userID));
      await setDoc(doc(db, "user_chats", userID), {
        ...userChatsSnapshot.data(),
        [devID]: {
          firstName: user.firstName,
          profilePicture: user.profilePicture,
          lastMessage: "",
        },
      });
      const devChatsSnapshot = await getDoc(doc(db, "user_chats", devID));
      await setDoc(doc(db, "user_chats", devID), {
        ...devChatsSnapshot.data(),
        [userID]: {
          firstName: dev.firstName,
          profilePicture: dev.profilePicture,
          lastMessage: "",
        },
      });
      const newChatID = userID < devID ? `${userID}_${devID}` : `${devID}_${userID}`;
      await setDoc(doc(db, "chat_messages", newChatID));
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
    </div>
  );
}
