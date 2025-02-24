import { call, put, takeEvery } from "redux-saga/effects";
import { EVENTS } from "../../utils/constant";
import axios from "axios";
import { signupStart, signupSuccess, signupFailure, loginStart, loginSuccess, loginFailure } from "../slices/authSlice"; 

function* handleRegistration(action) {
  try {
    yield put(signupStart());
    const response = yield call(axios.post, "http://localhost:8000/api/v1/users/register", action.payload);
    
    console.log("Registration response:", response); 

    if (response.status === 201 && response.data?.data) {
      yield put(signupSuccess(response.data.data));
      console.log("Registration successful, navigating...");
      
     
      yield call(action.navigate, "/signin");
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Registration error:", error.response || error.message);
    yield put(signupFailure(error.response?.data?.message || "Registration failed"));
  }
}


  

function* handleLogin(action) {
  try {
    yield put(loginStart());
    const response = yield call(axios.post, "http://localhost:8000/api/v1/users/login", action.payload);

    if (response.status === 200) {
      const { user, accessToken, refreshToken } = response.data.data;
      yield put(loginSuccess({ user, accessToken, refreshToken }));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      action.payload.navigate("/"); 
    }
  } catch (error) {
    yield put(loginFailure(error.response?.data?.message || "Login failed"));
  }
}
  

function* authenticationSaga() {
  yield takeEvery(EVENTS.USER_SIGNUP, handleRegistration);
  yield takeEvery(EVENTS.USER_SIGNIN, handleLogin);
}

export default authenticationSaga;
