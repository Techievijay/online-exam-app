import { createSlice, createSelector } from "@reduxjs/toolkit";

// Load user from localStorage if available
const userFromStorage = JSON.parse(localStorage.getItem("user")) || null;
const accessTokenFromStorage = localStorage.getItem("accessToken") || null;

const initialState = {
  isAuthenticated: !!accessTokenFromStorage, // Persist authentication state
  user: userFromStorage,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 Signup Actions
    signupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.isAuthenticated = false;  
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload)); 
    },
    signupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // 🔹 Login Actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;  
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user)); 
      localStorage.setItem("accessToken", action.payload.accessToken); 
      localStorage.setItem("refreshToken", action.payload.refreshToken); 
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // 🔹 Logout Actions with Loading & Error Handling
    logoutStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    logoutFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// 🔹 Selectors for accessing state easily
const selectAuthState = (state) => state.auth || initialState;

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.isLoading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectUser = createSelector(selectAuthState, (state) => state.user);
export const selectIsAuthenticated = createSelector(selectAuthState, (state) => state.isAuthenticated);

// 🔹 Export Actions
export const { 
  signupStart, 
  signupSuccess, 
  signupFailure, 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logoutStart, 
  logoutSuccess, 
  logoutFailure 
} = authSlice.actions;

// 🔹 Export Reducer
export default authSlice.reducer;
