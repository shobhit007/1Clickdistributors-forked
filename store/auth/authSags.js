import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  changeAuthStatus,
  checkAuthStatus,
  failedToAuthenticate,
  login,
  setAuthStatus,
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

    if (token) {
      // const response = yield call(validateToken, payload);
      // if (response.success) {
      //   yield put(login(response));
      // } else {
      //   yield put(failedToAuthenticate({ error: "Invalid token" }));
      //   router.push("/login");
      // }

      yield put(login({ role, email, token }));
      router.push("/Panel");
    } else {
      yield put(failedToAuthenticate({ error: "Token not found" }));
      router.push("/login");
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
