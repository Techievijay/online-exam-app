import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.isLogged = true;
      state.user = action.payload;
      state.isLoading = false;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    signupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearLogin: (state) => {
      state.isLogged = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem("auth");
    },
  },
});

const selectedState = (state) => state.auth;

export const selectCurrentAuthState = createSelector(selectedState, (state) => state);
export const selectUserLogged = createSelector(selectedState, (state) => state.isLogged);
export const selectUserInfo = createSelector(selectedState, (state) => state.user);
export const selectAuthLoading = createSelector(selectedState, (state) => state.isLoading);
export const selectAuthError = createSelector(selectedState, (state) => state.error);

export default authSlice;
