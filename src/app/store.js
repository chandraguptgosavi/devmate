import { configureStore } from '@reduxjs/toolkit';
import authSlice from 'features/auth/authSlice';
import feedSlice from 'features/feed/feedSlice';
import profileSlice from "features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    feed: feedSlice,
  },
});
