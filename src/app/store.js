import { configureStore } from '@reduxjs/toolkit';
import authSlice from 'features/auth/authSlice';
import userSlice from "features/profile/userSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
  },
});
