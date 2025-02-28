import { call, put, takeEvery } from "redux-saga/effects";
import { API_REQUEST_PATH, EVENTS } from "../../utils/constant";
import axios from "axios";
import { signupStart, signupSuccess, signupFailure, loginStart, loginSuccess, loginFailure,  logoutStart, logoutSuccess, logoutFailure } from "../slices/authSlice"; 
const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
console.log('ADMIN_EMAIL',ADMIN_EMAIL);
console.log('ADMIN_PASSWORD',ADMIN_PASSWORD);
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

    const { email, password, navigate } = action.payload;
    console.log("User attempting login:", email, password);
    console.log("Admin Credentials:", ADMIN_EMAIL, ADMIN_PASSWORD);

    // 🔹 Skip API call for admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log("Admin login detected. Logging in without API call.");

      const adminUser = {
        _id: "1",
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        role: "admin",
      };

      // Store admin credentials in localStorage
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("accessToken", "adminAccessToken");
      localStorage.setItem("refreshToken", "adminRefreshToken");

      // Dispatch success action
      yield put(loginSuccess({ user: adminUser, accessToken: "adminAccessToken", refreshToken: "adminRefreshToken" }));

      // Ensure navigate function exists before calling it
      if (navigate) {
        yield call(navigate, "/dashboard");
      } else {
        console.warn("Navigate function is missing in action payload");
      }

      return;
    }

    // 🔹 Regular user login (API call)
    const response = yield call(axios.post, `${API_URL}${API_REQUEST_PATH.USER_LOGIN}`, { email, password });

    console.log("Login API response:", response); // Ensure correct response format

    if (response.status === 200 && response.data?.data) {
      const { user, accessToken, refreshToken } = response.data.data;

      // Store user credentials in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Dispatch success action
      yield put(loginSuccess({ user, accessToken, refreshToken }));

      // Ensure navigate function exists before calling it
      if (navigate) {
        yield call(navigate, "/");
      } else {
        console.warn("Navigate function is missing in action payload");
      }
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data?.message || error.message || error);
    yield put(loginFailure(error.response?.data?.message || "Login failed"));
  }
}


function* handleLogout(action) {
  try {
    yield put(logoutStart());

    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role === "admin") {
      console.log("Admin logout detected. Skipping API call...");

      // Clear all stored data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Dispatch logout success action
      yield put(logoutSuccess());

      // Ensure navigate function exists before calling it
      if (action.payload?.navigate) {
        yield call(action.payload.navigate, "/signin");
      } else {
        console.warn("Navigate function is missing in action payload");
      }

      return; // Exit early for admin logout
    }

    // 🔹 Regular user logout (API call required)
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    yield call(axios.post, `${API_URL}${API_REQUEST_PATH.USER_LOGOUT}`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Clear all stored data
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Dispatch logout success action
    yield put(logoutSuccess());

    // Ensure navigate function exists before calling it
    if (action.payload?.navigate) {
      yield call(action.payload.navigate, "/signin");
    } else {
      console.warn("Navigate function is missing in action payload");
    }
  } catch (error) {
    console.error("Logout error:", error.response?.data?.message || error.message || error);
    yield put(logoutFailure(error.response?.data?.message || "Logout failed!"));
  }
}




  

function* authenticationSaga() {
  yield takeEvery(EVENTS.USER_SIGNUP, handleRegistration);
  yield takeEvery(EVENTS.USER_SIGNIN, handleLogin);
  yield takeEvery(EVENTS.USER_SIGNOUT, handleLogout); 
}

export default authenticationSaga;
