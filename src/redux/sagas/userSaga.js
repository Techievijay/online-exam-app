import { call, put, takeLatest } from "redux-saga/effects";
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from "../slices/userSlice";

// API call function
const fetchUserFromApi = async (userId) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

// Worker Saga
function* fetchUserSaga(action) {
  try {
    const user = yield call(fetchUserFromApi, action.payload);
    yield put(fetchUserSuccess(user)); // Dispatch success action
  } catch (error) {
    yield put(fetchUserFailure(error.message)); // Dispatch failure action
  }
}

// Watcher Saga
export function* watchFetchUserSaga() {
  yield takeLatest(fetchUserRequest.type, fetchUserSaga);
}
