import { Fragment, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  messagedAsync,
  messagesLoaded,
  selectChatID,
  selectMessages,
} from "./chatSlice";
import { selectUserID } from "features/auth/authSlice";
import { Skeleton } from "@material-ui/lab";
import { useIsComponentMounted } from "app/hooks";
import { FaCheck } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { CustomSnackbar } from "app/components";

/**
 * Component to show while actual chat loads
 * @returns {JSX.Element}
 */
function ChatWindowSkeleton() {
  const userID = useSelector(selectUserID);
  const placeholderMessages = [
    { massageID: "" },
    { massageID: userID },
    { massageID: "" },
    { massageID: userID },
    { massageID: "" },
    { massageID: userID },
    { massageID: "" },
    { massageID: userID },
    { massageID: "" },
    { massageID: userID },
  ];

  return (
    <>
      {placeholderMessages.map((message, index) => (
        <Skeleton
          key={`${index}`}
          varinat="text"
          width="60%"
          height="20%"
          className={`${message.massageID === userID && "self-end"} my-1`}
        />
      ))}
    </>
  );
}

function ChatWindow() {
  const messages = useSelector(selectMessages);
  const chatID = useSelector(selectChatID);
  const userID = useSelector(selectUserID);
  const unsubscribeRef = useRef(null);
  const chatContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isComponentMounted = useIsComponentMounted();
  const dispatch = useDispatch();

  /**
   * Check whether chat container scrolled to the bottom
   * if not, scroll to the bottom
   */
  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      if (
        !(
          chatContainer.current.scrollHeight -
            Math.abs(chatContainer.current.scrollTop) ===
          chatContainer.current.clientHeight
        )
      ) {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
      }
    });
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const unsubscribe = onSnapshot(
        doc(getFirestore(), "chat_messages", chatID),
        { includeMetadataChanges: true },
        (doc) => {
          if (doc.exists()) {
            if (!doc.metadata.hasPendingWrites) {
              const data = Object.entries(doc.data()).map(([key, val]) => {
                return {
                  ...val,
                  massageID: key,
                  time: val.time.toMillis(),
                  isPending: false,
                };
              });
              data.sort((a, b) => {
                if (a.time < b.time) {
                  return -1;
                } else if (a.time > b.time) {
                  return 1;
                } else {
                  return 0;
                }
              });
              if (isComponentMounted.current) {
                dispatch(messagesLoaded(data));
                scrollToBottom();
              }
            }
          } else if (isComponentMounted.current) {
            dispatch(messagesLoaded([]));
          }
          if (isComponentMounted.current) {
            setIsLoading(false);
          }
        }
      );
      if (unsubscribeRef.current === null) {
        unsubscribeRef.current = unsubscribe;
      }
    } catch (err) {
      if (isComponentMounted.current) {
        setIsLoading(false);
        setIsOpen(true);
      }
    }
  };

  const onSend = async () => {
    if (currentMessage.trim().length > 0) {
      try {
        const newMessageData = {
          message: currentMessage.trim(),
          sentBy: userID,
          time: Timestamp.fromMillis(Date.now()),
        };
        const messageID = `${messages.length + 1}_${chatID}`;
        dispatch(
          messagedAsync({
            ...newMessageData,
            messageID: messageID,
            time: newMessageData.time.toMillis(),
            isPending: true,
          })
        );
        setCurrentMessage("");
        scrollToBottom();
        await setDoc(
          doc(getFirestore(), "chat_messages", chatID),
          {
            [messageID]: newMessageData,
          },
          { merge: true }
        );
      } catch (err) {
        if (isComponentMounted.current) {
          setIsLoading(false);
          setIsOpen(true);
        }
      }
    }
  };

  useEffect(() => {
    if (chatID) {
      loadMessages();
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [chatID]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={chatContainer}
        className="p-4 w-full h-11/12 overflow-auto hide-scrollbar flex flex-col items-start"
      >
        {isLoading ? (
          <ChatWindowSkeleton />
        ) : (
          messages.map((messageData, index) => (
            <Fragment key={messageData.massageID}>
              {
                /**
                 * check whether current date is not same as previous
                 * if true, show the new day of chatting
                 */
                (index === 0 ||
                  `${new Date(messageData.time).getDate()}/${new Date(
                    messageData.time
                  ).getMonth()}/${new Date(messageData.time).getFullYear()}` !==
                    `${new Date(messages[index - 1].time).getDate()}/${new Date(
                      messages[index - 1].time
                    ).getMonth()}/${new Date(
                      messages[index - 1].time
                    ).getFullYear()}`) && (
                  <div className="my-1 px-2 py-1 rounded-lg bg-colorSecondary self-center">
                    <p className="text-white text-2xs">
                      {
                        // if date is today's show `Today` instead of date
                        new Intl.DateTimeFormat().format(
                          new Date(messageData.time)
                        ) === new Intl.DateTimeFormat().format(Date.now())
                          ? "Today"
                          : `${new Date(messageData.time).toLocaleString(
                              "default",
                              { month: "long" }
                            )} ${new Date(
                              messageData.time
                            ).getDate()}, ${new Date(
                              messageData.time
                            ).getFullYear()}`
                      }
                    </p>
                  </div>
                )
              }
              <div
                className={`${
                  messageData.sentBy === userID
                    ? "bg-colorPrimary self-end"
                    : "bg-colorPrimaryLight"
                } my-1 px-4 py-2 rounded-2xl max-w-3/4 flex flex-col`}
              >
                <p
                  className={`${
                    messageData.sentBy === userID ? "text-white" : ""
                  }  text-sm`}
                >
                  {messageData.message}
                </p>
                <span
                  className={`${
                    messageData.sentBy === userID ? "text-white" : ""
                  } text-2xs self-end justify-self-end flex items-center`}
                >
                  <p>
                    {`${new Date(messageData.time).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}`}
                  </p>
                  {messageData.isPending ? (
                    <IoTime className="ml-1 text-2xs text-white" />
                  ) : (
                    messageData.sentBy === userID && (
                      <FaCheck className="ml-1 text-2xs text-white" />
                    )
                  )}
                </span>
              </div>
            </Fragment>
          ))
        )}
      </div>
      <div className="w-full h-1/12 min-h-40px border-t-2 flex justify-items-stretch items-center">
        <input
          type="text"
          placeholder="Your message here..."
          value={currentMessage}
          className="ml-4 mr-2 w-full h-full border-0 focus:border-0
         focus:outline-none"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSend();
            }
          }}
        />
        <div
          className="ml-2 mr-4 p-2 cursor-pointer rounded-full shadow-2xl bg-colorPrimary flex items-center"
          onClick={onSend}
        >
          <FiSend className="text-white text-xl" />
        </div>
      </div>
      <CustomSnackbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default ChatWindow;
