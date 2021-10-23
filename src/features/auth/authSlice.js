import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    isPresent: false,
    connections: { received: [], sent: [], connected: [] },
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    signedIn: (state, action) => {
      state.user.uid = action.payload;
    },
    userUpdated: (state, action) => {
      return { ...state, user: { ...state.user, ...action.payload } };
    },
    userStatusUpdated: (state, action) => {
      state.user.isPresent = action.payload;
    },
    userConnectionsUpdated: (state, action) => {
      state.user.connections = action.payload;
    }
  },
});

export const { authenticate, userUpdated, signedIn, userStatusUpdated, userConnectionsUpdated } =
  authSlice.actions;

export const authenticateAsync = (isAuthenticated) => (dispatch) => {
  dispatch(authenticate(isAuthenticated));
};

export const userUpdatedAsync = (user) => (dispatch) => {
  dispatch(userUpdated(user));
};

export const signedInAsync = (userID) => (dispatch) => {
  dispatch(signedIn(userID));
};

export const userStatusUpdatedAsync = (status) => (dispatch) => {
  dispatch(userStatusUpdated(status));
};

export const userConnectionsUpdatedAsync = (connections) => (dispatch) => {
  dispatch(userConnectionsUpdated(connections));
}

export const selectAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserID = (state) => state.auth.user.uid;
export const selectIsUserPresent = (state) => state.auth.user.isPresent;
export const selectUser = (state) => {
  return {
    profilePicture: state.auth.user.profilePicture,
    firstName: state.auth.user.firstName,
    headline: state.auth.user.headline,
    github: state.auth.user.github,
    about: state.auth.user.about,
    education: state.auth.user.education,
    skills: state.auth.user.skills,
    connections: state.auth.user.connections,
  };
};
export const selectUserConnections = (state) => state.auth.user.connections;

export default authSlice.reducer;
