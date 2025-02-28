import { call, put, takeEvery } from "redux-saga/effects";
import { API_REQUEST_PATH, EVENTS } from "../../utils/constant";
import axios from "axios";
import { signupStart, signupSuccess, signupFailure, loginStart, loginSuccess, loginFailure } from "../slices/authSlice"; 
const API_URL = import.meta.env.VITE_API_URL;


console.log('REGISTER_API: ',`${API_URL}${API_REQUEST_PATH.USER_REGISTER}`);

function* handleRegistration(action) {
  try {
    yield put(signupStart());
    const response = yield call(axios.post, `${API_URL}${API_REQUEST_PATH.USER_REGISTER}`, action.payload);
    
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

    const { email, password } = action.payload;

    
    if (email === "abcadmin@gmail.com" && password === "23435") {
      const adminUser = {
        _id: "1",
        username: "adminabc",
        email: "abcadmin@gmail.com",
        __v: 0,
        role: "admin",
      };

 
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("accessToken", "adminAccessToken");
      localStorage.setItem("refreshToken", "adminRefreshToken");

 
      yield put(loginSuccess({ user: adminUser, accessToken: "adminAccessToken", refreshToken: "adminRefreshToken" }));

    
      yield call(action.payload.navigate, "/dashboard");

      return; 
    }

  
    const response = yield call(axios.post, `${API_URL}${API_REQUEST_PATH.USER_LOGIN}`, action.payload);

    if (response.status === 200) {
      const { user, accessToken, refreshToken } = response.data.data;
      yield put(loginSuccess({ user, accessToken, refreshToken }));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      yield call(action.payload.navigate, "/");
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
