import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authReducer";

const reducer = combineReducers({
  auth: authReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return reducer(state, action);
};
