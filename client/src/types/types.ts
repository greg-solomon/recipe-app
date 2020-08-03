import { ThunkAction } from "redux-thunk";
import { AppState } from "../redux/store/store";
import { Action } from "redux";

export type ThunkActionType = ThunkAction<void, AppState, null, Action<string>>;
