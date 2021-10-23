const { createSlice } = require("@reduxjs/toolkit");

const initialState = {connectionStatus:"normal"};

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        currentProfileLoaded: (state, action) => {
            return { ...state, ...action.payload };
        },
        currentProfileConnectionStatusUpdated: (state, action) => {
            state.connectionStatus = action.payload;
        }
    }
});

export const { currentProfileLoaded, currentProfileConnectionStatusUpdated } = profileSlice.actions;

export const currentProfileLoadedAsync = (profile) => (dispatch) => {
  dispatch(currentProfileLoaded(profile));
};

export const currentProfileConnectionStatusUpdatedAsync = (status) => (dispatch) => {
    dispatch(currentProfileConnectionStatusUpdated(status));
}

export const selectCurrentProfile = (state) => state.profile;
export const selectCurrentProfileConnectionStatus = (state) =>
  state.profile.connectionStatus;

export default profileSlice.reducer;