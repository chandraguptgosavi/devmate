import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { selectUserID } from "features/auth/authSlice";
import { Fragment, useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useIsComponentMounted } from "app/hooks";
import {
  chatIDChanged,
  selectChat,
  selectedChatChanged,
  selectUserChats,
  userChatsLoadedAsync,
} from "./chatSlice";
import ProfileIcon from "assets/profile-icon.png";
import { Skeleton } from "@material-ui/lab";
import { ListItemButton } from "@mui/material";
import { colorSecondary } from "app/colors";

function ChatListSkeleton({ isLastRow }) {
  const placeholderUserChats = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  return (
    <Fragment>
      {placeholderUserChats.map((_, index) => (
        <Fragment key={`${index}`}>
          <ListItem>
            <ListItemAvatar>
              <Skeleton
                varinat="circular"
                width="35px"
                height="60px"
                style={{ borderRadius: "50%" }}
              >
                <Avatar />
              </Skeleton>
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton varinat="text" width="60%" />}
              secondary={<Skeleton varinat="text" />}
            />
          </ListItem>
          {placeholderUserChats.length - 1 === index ? null : <Divider />}
        </Fragment>
      ))}
    </Fragment>
  );
}

function ChatList() {
  const userID = useSelector(selectUserID);
  const userChats = useSelector(selectUserChats);
  const isComponentMounted = useIsComponentMounted();
  const [isLoading, setIsLoading] = useState(true);
  const selectedChat = useSelector(selectChat);
  const dispatch = useDispatch();

  const loadUserChats = async () => {
    const setLoadedData = (snapshot) => {
      const data = snapshot.data();
      if (isComponentMounted.current) {
        dispatch(
          userChatsLoadedAsync(
            Object.entries(data).map(([uid, info]) => {
              return {
                ...info,
                uid: uid,
              };
            })
          )
        );
        setIsLoading(false);
      }
    };

    try {
      setIsLoading(true);
      const auth = getAuth();
      const db = getFirestore();
      if (userID) {
        const snapshot = await getDoc(doc(db, "user_chats", userID));
        setLoadedData(snapshot);
      } else {
        const snapshot = await getDoc(
          doc(db, "user_chats", auth.currentUser.uid)
        );
        setLoadedData(snapshot);
      }
    } catch (err) {
      console.log(`error from ChatList: ${err}`);
    }
  };

  useEffect(() => {
    loadUserChats();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar bg-colorLightGrey flex flex-col">
      <List>
        {isLoading ? (
          <ChatListSkeleton />
        ) : (
          userChats.map((contact, index) => (
            <Fragment key={contact.uid}>
              <ListItemButton
                selected={selectedChat.uid === contact.uid}
                style={{
                  borderLeft:
                    selectedChat.uid === contact.uid
                      ? `0.25em solid ${colorSecondary}`
                      : "",
                }}
                onClick={() => {
                  dispatch(selectedChatChanged({ ...contact }));
                  dispatch(
                    chatIDChanged(
                      userID < contact.uid
                        ? `${userID}_${contact.uid}`
                        : `${contact.uid}_${userID}`
                    )
                  );
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={
                      contact.profilePicture.length > 0
                        ? contact.profilePicture
                        : ProfileIcon
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={contact.firstName}
                  secondary={
                    <span
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {contact.lastMessage}
                    </span>
                  }
                />
              </ListItemButton>
              {index !== userChats.length - 1 ? <Divider /> : null}
            </Fragment>
          ))
        )}
      </List>
    </div>
  );
}

export default ChatList;
