import { all } from "redux-saga/effects";
import { watchFetchUserSaga } from "./userSaga";


export default function* rootSaga() {
  yield all([watchFetchUserSaga()]);
}
