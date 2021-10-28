const { createSlice } = require("@reduxjs/toolkit");

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    userChats: [],
    messages: [],
    chatID: null,
    selectedChat: {},
  },
  reducers: {
    userChatsLoaded: (state, action) => {
      state.userChats = [...action.payload];
    },
    messagesLoaded: (state, action) => {
      state.messages = action.payload;
    },
    messaged: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    chatIDChanged: (state, action) => {
      state.chatID = action.payload;
    },
    selectedChatChanged: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { userChatsLoaded, messagesLoaded, messaged, chatIDChanged, selectedChatChanged } = chatSlice.actions;

export const userChatsLoadedAsync = (userChats) => (dispatch) => {
  dispatch(userChatsLoaded(userChats));
};

export const messagesLoadedAsync = (messages) => (dispatch) => {
  dispatch(messagesLoaded(messages));
};

export const messagedAsync = (messageData) => (dispatch) => {
  dispatch(messaged(messageData));
}

export const selectUserChats = (state) => state.chat.userChats;
export const selectMessages = (state) => state.chat.messages;
export const selectChatID = state => state.chat.chatID;
export const selectChat = state => state.chat.selectedChat;

export default chatSlice.reducer;
