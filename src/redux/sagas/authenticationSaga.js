import { call, put, takeEvery } from "redux-saga/effects";
import authSlice from "../slices/authSlice";
import { EVENTS } from "../../utils/constant";
import axios from "axios";

function* handleRegistration(action) {
  try {
    const response = yield call(axios.post, "http://localhost:8000/api/v1/users/register", action.payload);

    if (response.status === 201) {
      yield put(authSlice.actions.loginSuccess({
        user: response.data.data, // Store user data from response
      }));
    }
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.message || error.message);
  }
}

function* authenticationSaga() {
  yield takeEvery(EVENTS.USER_SIGNUP, handleRegistration);
}

export default authenticationSaga;
