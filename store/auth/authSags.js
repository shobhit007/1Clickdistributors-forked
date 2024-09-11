import { all, call, put, takeLatest } from "redux-saga/effects";
import { changeAuthStatus, setAuthStatus } from "./authReducer";

function* handleChangeAuthStatus({ payload }) {
  try {
    console.log("payload in auth saga is", payload);
    yield put(
      setAuthStatus({
        authenticated: payload.authenticated,
        userId: "changed@gmail.com",
      })
    );
  } catch (error) {
    yield put(ClasseRecordingRequestFailure());
  }
}

function* changeAuthStatusHandler() {
  yield takeLatest(changeAuthStatus.type, handleChangeAuthStatus);
}

// main saga
export function* authSaga() {
  yield all([call(changeAuthStatusHandler)]);
}
