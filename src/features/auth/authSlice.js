import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const authSlice = createSlice({
    name:'auth',
    initialState: initialState,
    reducers: {
        authenticate: (state, action) => {
            return action.payload;
        },
    }
});

export const { authenticate, authLoading } = authSlice.actions;

export const authenticateAsync = (isAuthenticated) => (dispatch) => {
  dispatch(authenticate(isAuthenticated));
};

export const selectAuthenticated = state => state.auth;
export default authSlice.reducer;