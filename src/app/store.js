import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'features/auth/authSlice';
import chatReducer from "features/chat/chatSlice";
import feedReducer from "features/feed/feedSlice";
import profileReducer from "features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    feed: feedReducer,
    chat: chatReducer,
  },
});
