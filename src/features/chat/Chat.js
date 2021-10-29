import { AppBar } from "app/components";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import { useDispatch, useSelector } from "react-redux";
import {
  chatIDChanged,
  selectChat,
  selectChatID,
  selectedChatChanged,
} from "./chatSlice";
import ChatWindowPlaceholder from "assets/chat-window-placeholder.png";
import ProfileIcon from "assets/profile-icon.png";
import { Avatar } from "@material-ui/core";
import { MdArrowBack } from "react-icons/md";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Routes from "routes/types";
import { useIsComponentMounted } from "app/hooks";

function Chat() {
  const chatID = useSelector(selectChatID);
  const selectedChat = useSelector(selectChat);
  const [isSmallWidth, setIsSmallWidth] = useState(window.innerWidth < 640 ? true : false);
  const dispatch = useDispatch();
  const history = useHistory();
  const isComponentMounted = useIsComponentMounted();

  // change layout if device width is smaller than 640px
  window.addEventListener("resize", () => {
    if (window.innerWidth < 640) {
      if (!isSmallWidth && isComponentMounted.current) {
        setIsSmallWidth(true);
      }
    } else {
      if (isSmallWidth && isComponentMounted.current) {
        setIsSmallWidth(false);
      }
    }
  });

  return (
    <div className="w-full h-screen">
      {isSmallWidth && chatID ? (
        <div className={`w-full h-full`}>
          <div className="w-full h-1/12 min-h-40px border-b-2 flex items-center">
            <MdArrowBack
              className="ml-4 text-2xl"
              onClick={() => {
                dispatch(selectedChatChanged({}));
                dispatch(chatIDChanged(null));
              }}
            />
            <Avatar
              src={
                typeof selectedChat.profilePicture !== "undefined" &&
                selectedChat.profilePicture.length > 0
                  ? selectedChat.profilePicture
                  : ProfileIcon
              }
              style={{ marginLeft: ".5em" }}
              onClick={() => {
                history.push(`${Routes.PROFILE}/${selectedChat.uid}`)
              }}
            />
            <p className="ml-4 font-medium text-lg text-colorPrimaryDark">
              {typeof selectedChat.firstName !== "undefined" &&
                selectedChat.firstName}
            </p>
          </div>
          <div className="w-full h-11/12">
            <ChatWindow />
          </div>
        </div>
      ) : (
        <>
          <div className="z-50 shadow-2xl">
            <AppBar showSearchOption={false} showMessagesOption={false} />
          </div>
          <div className={`flex w-full h-11/12`}>
            <div className="w-full sm:w-1/3 h-full">
              <ChatList />
            </div>
            <div className="hidden sm:block w-2/3 h-full">
              {chatID ? (
                <ChatWindow />
              ) : (
                <div className="w-full h-full object-contain overflow-hidden flex items-center justify-center">
                  <img src={ChatWindowPlaceholder} alt="placeholder" />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
