import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authReducer";

const reducer = combineReducers({
  auth: authReducer,
});

export const rootReducer = (state, action) => {
  console.log("action type is", action.type);
  if (action.type === "LOGOUT") {
    console.log("LOGOUT action disabled");
    state = undefined;
  }
  return reducer(state, action);
};
