import { call, put, takeEvery } from "redux-saga/effects";
import { EVENTS } from "../../utils/constant";
import axios from "axios";
import { signupStart, signupSuccess, signupFailure } from "../slices/authSlice"; 

function* handleRegistration(action) {
  try {
    yield put(signupStart()); 
    const response = yield call(
      axios.post,
      "http://localhost:8000/api/v1/users/register",
      action.payload
    );

    if (response.status === 201) {
      yield put(signupSuccess(response.data.data));
    }
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.message || error.message);
    yield put(signupFailure(error.response?.data?.message || "Registration failed")); 
  }
}

function* authenticationSaga() {
  yield takeEvery(EVENTS.USER_SIGNUP, handleRegistration);
}

export default authenticationSaga;
