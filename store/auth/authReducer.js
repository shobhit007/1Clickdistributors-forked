import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  authenticated: false,
  email: "",
  hierarchy: null,
  authenticationLoading: false,
  authenticationError: false,
  token: "",
  userDetails: null,
  logoutPopup: false,
};

const reducer = {
  changeAuthStatus(state, action) {},
  setAuthStatus(state, action) {
    state.authenticated = action.payload.authenticated;
    state.email = action.payload.email;
  },
  logout: (state) => {
    state.authenticated = false;
    state.email = "";
    state.role = null;
    state.authenticationLoading = false;
    state.token = "";
  },
  login: (state, action) => {
    state.authenticated = true;
    state.email = action.payload.email;
    state.hierarchy = action.payload.hierarchy;
    state.token = action.payload.token;
    state.userDetails = action.payload.userDetails;
    state.authenticationLoading = false;
  },
  checkAuthStatus: (state, action) => {
    state.authenticationLoading = true;
  },
  failedToAuthenticate: (state, action) => {
    state.authenticationLoading = false;
    state.authenticationError = action.payload.error;
  },
  setLogoutPopup: (state, action) => {
    state.logoutPopup = action.payload;
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: reducer,
});

export const {
  changeAuthStatus,
  setAuthStatus,
  logout,
  login,
  checkAuthStatus,
  failedToAuthenticate,
  setLogoutPopup,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
