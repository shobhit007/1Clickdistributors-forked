import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  authenticated: true,
  userId: "abhishekrauthan733@gmail.com",
};

const reducer = {
  changeAuthStatus(state, action) {},
  setAuthStatus(state, action) {
    state.authenticated = action.payload.authenticated;
    state.userId = action.payload.userId;
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: reducer,
});

export const { changeAuthStatus, setAuthStatus } = authSlice.actions;
export const authReducer = authSlice.reducer;
