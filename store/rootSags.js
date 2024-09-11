import { all, call } from "redux-saga/effects";

import { authSaga } from "./auth/authSags";

export function* rootSaga() {
  yield all([call(authSaga)]);
}
