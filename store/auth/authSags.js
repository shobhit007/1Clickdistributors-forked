import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  changeAuthStatus,
  checkAuthStatus,
  failedToAuthenticate,
  login,
  setAuthStatus,
  setLogoutPopup,
} from "./authReducer";
import { validateToken } from "./api";

function* handleChangeAuthStatus({ payload }) {
  try {
    console.log("payload in auth saga is", payload);
    yield put(
      setAuthStatus({
        authenticated: payload.authenticated,
        email: "changed@gmail.com",
      })
    );
  } catch (error) {
    yield put(ClasseRecordingRequestFailure());
  }
}

function* handleCheckAuthStatus({ payload }) {
  try {
    let token = localStorage.getItem("authToken");
    let role = localStorage.getItem("role");
    let email = localStorage.getItem("email");

    const router = payload.router;
    const toast = payload.toast;

    if (token) {
      const response = yield call(validateToken, token);

      if (response.success && response.data) {
        yield put(login({ role, email, token, userDetails: response.data }));
        router.push("/board");
      } else if (
        !response.success &&
        response.message?.toLowerCase() == "jwt expired"
      ) {
        yield put(failedToAuthenticate({ error: "Your session has expired" }));
        yield put(setLogoutPopup(true));
        // toast?.error("Your token has expired. we are logging you out.");
      } else {
        yield put(
          failedToAuthenticate({ error: "Token could not be verified" })
        );
        setLogoutPopup(true);
        // toast?.error(
        //   "Your token could not be verified. we are logging you out."
        // );
      }
    } else {
      yield put(failedToAuthenticate({ error: "Token not found" }));
      setLogoutPopup(true);
    }
  } catch (error) {
    console.log("error in handleCheckAuthStatus saga is", error.message);
    yield put(failedToAuthenticate({ error: error.message }));
  }
}

function* changeAuthStatusListner() {
  yield takeLatest(changeAuthStatus.type, handleChangeAuthStatus);
}

function* checkAuthStatusListner() {
  yield takeLatest(checkAuthStatus.type, handleCheckAuthStatus);
}

// main saga
export function* authSaga() {
  yield all([call(changeAuthStatusListner), call(checkAuthStatusListner)]);
}
