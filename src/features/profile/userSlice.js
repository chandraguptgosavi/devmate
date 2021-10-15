const { createSlice } = require("@reduxjs/toolkit");

const initialState = {};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        userCreated: (state, action) => {
            return action.payload;
        },
        signedIn: (state, action) => {
            state.uid = action.payload;
        }
    }
});

export const { userCreated, signedIn } = userSlice.actions;

export const userCreatedAsync = (user) => (dispatch) => {
  dispatch(userCreated(user));
};

export const signedInAsync = (userID) => (dispatch) => {
    dispatch(signedIn(userID));
}

export const selectUserID = state => state.user.uid;
export const selectUser = state => state.user;
export default userSlice.reducer;