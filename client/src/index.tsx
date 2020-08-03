import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./assets/styles/root.scss";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./redux/store/store";
import * as firebase from "firebase/app";
import { grey, red } from "@material-ui/core/colors";
require("firebase/auth");

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: red,
  },
});
const store = configureStore();
firebase.initializeApp({
  projectId: process.env.REACT_APP_PROJECT_ID,
  apiKey: process.env.REACT_APP_API_KEY,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
