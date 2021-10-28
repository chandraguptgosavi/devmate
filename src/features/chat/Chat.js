import { AppBar } from "app/components";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import { useSelector } from "react-redux";
import { chatIDChanged, selectChat, selectChatID, selectedChatChanged } from "./chatSlice";
import ChatWindowPlaceholder from "assets/chat-window-placeholder.png";
import ProfileIcon from 'assets/profile-icon.png';
import { useDispatch } from "react-redux";
import { Avatar } from "@material-ui/core";
import { MdArrowBack } from "react-icons/md";

function Chat() {
  const chatID = useSelector(selectChatID);
  const selectedChat = useSelector(selectChat);
  const dispatch = useDispatch();

  // change layout if device width is smaller than 640px
  window.addEventListener("resize", () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 640) {
      dispatch(selectedChatChanged({}));
      dispatch(chatIDChanged(null));
    }
  });

  return (
    <div className="w-full h-screen">
      <div className={`${chatID && "hidden"} sm:block z-50 shadow-2xl`}>
        <AppBar showSearchOption={false} showMessagesOption={false} />
      </div>
      <div className={`${chatID && "hidden"} sm:flex w-full h-11/12vh`}>
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
      <div
        className={`${
          chatID ? "block" : "hidden"
        } sm:hidden absolute top-0 bottom-0 left-0 right-0`}
      >
        <div className="w-full h-1/12vh border-b-2 flex items-center">
          <MdArrowBack className="ml-4 text-2xl" onClick={() => {
                  dispatch(selectedChatChanged({}));
                  dispatch(chatIDChanged(null));
          }}/>
          <Avatar
            src={
              typeof selectedChat.profilePicture !== "undefined" &&
              selectedChat.profilePicture.length > 0
                ? selectChat.profilePicture
                : ProfileIcon
            }
            style={{ marginLeft: ".5em" }}
          />
          <p className="ml-4 font-medium text-lg text-colorPrimaryDark">
            {typeof selectedChat.firstName !== "undefined" &&
              selectedChat.firstName}
          </p>
        </div>
        <div className="w-full h-11/12vh">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}

export default Chat;
