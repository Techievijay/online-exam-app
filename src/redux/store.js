import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import userReducer from "./slices/userSlice";
import rootSaga from "./sagas/rootSaga";

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: {
    user: userReducer, // Add user reducer for saga example
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Run the saga middleware
sagaMiddleware.run(rootSaga);

export default store;
