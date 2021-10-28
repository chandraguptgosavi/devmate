const { createSlice, current } = require("@reduxjs/toolkit");

const initialState = {
  isLoading: false,
  isSearchBoxVisible: false,
  tabIndex: 0,
  profiles: [],
  requestProfiles: [],
  filteredProfiles: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState: initialState,
  reducers: {
    profilesLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    profilesLoaded: (state, action) => {
      return {...state, profiles: action.payload};
    },
    requestProfilesLoaded: (state, action) => {
      return {...state, requestProfiles: action.payload};
    },
    filteredProfilesLoaded: (state, action) => {
      state.filteredProfiles = action.payload;
    },
    searchBoxRequested: (state) => {
      state.isSearchBoxVisible = true;
    },
    searchBoxClosed: (state) => {
      state.isSearchBoxVisible = false;
    },
    searched: (state, action) => {
      let filteredProfiles = [];
      const currentState = current(state);
      // search for developer profile based on skill in 'Discover' tab
      if (currentState.tabIndex === 0) {
        filteredProfiles = currentState.profiles.filter((profile) => {
          return typeof profile.skills !== "undefined"
            ? profile.skills.some((skill) => {
                return skill.toLowerCase().indexOf(action.payload) > -1;
              })
            : false;
        });
      }
      // search for developer profile based on skill in 'Requests' tab
      if (currentState.tabIndex === 1) {
        filteredProfiles = currentState.requestProfiles.filter((profile) => {
          return typeof profile.skills !== "undefined"
            ? profile.skills.some((skill) => {
                return skill.toLowerCase().indexOf(action.payload) > -1;
              })
            : false;
        });
      }
      state.filteredProfiles = filteredProfiles;
    },
    tabChanged: (state, action) => {
      state.tabIndex = action.payload;
    },
  },
});

export const {
  profilesLoading,
  profilesLoaded,
  requestProfilesLoaded,
  filteredProfilesLoaded,
  searchBoxRequested,
  searchBoxClosed,
  searched,
  tabChanged,
} = feedSlice.actions;

export const profilesLoadingAsync = (isLoading) => (dispatch) => {
  dispatch(profilesLoading(isLoading));
};

export const profilesLoadedAsync = (profiles) => (dispatch) => {
  dispatch(profilesLoaded(profiles));
};

export const requestProfilesLoadedAsync = (requestProfiles) => dispatch => {
  dispatch(requestProfilesLoaded(requestProfiles));
}

export const  filteredProfilesLoadedAsync = (filteredProfiles) => (dispatch) => {
  dispatch(filteredProfilesLoaded(filteredProfiles));
}

export const selectIsLoading = (state) => state.feed.isLoading;
export const selectProfiles = (state) => state.feed.profiles;
export const selectFilteredProfiles = (state) => state.feed.filteredProfiles;
export const selectIsSearchBoxVisible = (state) =>
  state.feed.isSearchBoxVisible;
export const selectTabIndex = state => state.feed.tabIndex;
export const selectRequestProfiles = state => state.feed.requestProfiles;

export default feedSlice.reducer;
