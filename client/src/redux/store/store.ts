import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import authReducer from "../reducers/authReducer";
import alertReducer from "../reducers/alertReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const middleware = [thunk];

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  return store;
}
