import { AuthEvents } from "../../types/authTypes";
import * as firebase from "firebase/app";
import { AlertEvents } from "../../types/alertTypes";
import { ThunkActionType } from "../../types/types";
import axios from "axios";
import getCookie from "../../lib/functions/getCookie";
import setCookie from "../../lib/functions/setCookie";

let localhost =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";
const registerUser = (
  email: string,
  password: string,
  name: string,
  color: string
): ThunkActionType => async (dispatch: any) => {
  try {
    dispatch({
      type: AuthEvents.AUTH_INIT,
    });

    const credential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const { user } = credential;

    if (user) {
      await user.updateProfile({
        displayName: name,
      });
      const idToken = await user.getIdToken();

      await axios({
        method: "POST",
        url: `${localhost}/api/user/register`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          uid: user.uid,
          displayName: name,
          color: color,
        },
      });
      await user.sendEmailVerification({
        url: process.env.REACT_APP_REDIRECT || "http://localhost:3000",
      });
      // session login
      const response = await axios({
        method: "POST",
        url: `${localhost}/api/sessionLogin`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ idToken }),
      });

      const cookie = response.data.session;

      dispatch({
        type: AuthEvents.REGISTER_SUCCESS,
        payload: {
          uid: user.uid,
          displayName: name,
          email: email,
          metadata: user.metadata,
          color: color,
          session: cookie,
          emailVerified: user.emailVerified,
        },
      });
    }
  } catch (err) {
    dispatch({ type: AuthEvents.REGISTER_FAIL });
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: err.message,
        severity: "danger",
        showMessage: true,
      },
    });
    console.error(err);
  }
};

const login = (email: string, password: string): ThunkActionType => async (
  dispatch
) => {
  try {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    dispatch({
      type: AuthEvents.AUTH_INIT,
    });

    const credential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const { user } = credential;

    if (user) {
      const idToken = await user.getIdToken();
      const response = await axios({
        method: "POST",
        url: `${localhost}/api/sessionLogin`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ idToken }),
      });

      const colorRes = await axios.get(`${localhost}/api/user/${user.uid}`);

      const { color } = await colorRes.data.user[0];
      const session = response.data.session;
      setCookie("mycookie", session, 7);
      const payload = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        metadata: user.metadata,
        session: session,
        emailVerified: user.emailVerified,
        color: color,
      };
      dispatch({
        type: AuthEvents.AUTH_SUCCESS,
        payload: payload,
      });
    }
  } catch (error) {
    console.error(error.message);
    dispatch({
      type: AuthEvents.AUTH_FAIL,
    });

    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: error.message,
        severity: "error",
        showMessage: true,
      },
    });
  }
};

const logout = (): ThunkActionType => async (dispatch: any) => {
  try {
    firebase
      .auth()
      .signOut()
      .then(() => {
        axios({
          method: "GET",
          url: `${localhost}/api/sessionLogout`,
        });
        setCookie("session", "", 0);
        dispatch({
          type: AuthEvents.LOGOUT,
        });
      });
  } catch (err) {
    console.error(err.message);
  }
};

const deleteUser = (): ThunkActionType => async (dispatch: any) => {
  try {
    const deleted = await firebase.auth().currentUser?.delete();
    if (deleted) {
      dispatch({
        type: AuthEvents.AUTH_DELETE,
      });
    }
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: `Account deleted`,
        showMessage: true,
        severity: "info",
      },
    });
  } catch (error) {
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: error.message,
        showMessage: true,
        severity: "error",
      },
    });
  }
};

const loadUser = (): ThunkActionType => async (dispatch: any) => {
  try {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const colorRes = await axios.get(`${localhost}/api/user/${user.uid}`);

        const { color } = await colorRes.data.user[0];
        const cookie = getCookie("mycookie");
        const payload = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          metadata: user.metadata,
          session: cookie,
          emailVerified: user.emailVerified,
          color: color,
        };
        dispatch({
          type: AuthEvents.AUTH_SUCCESS,
          payload: payload,
        });
      }
    });
  } catch (error) {
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: error.message,
        severity: "error",
        showMessage: true,
      },
    });
  }
};

const deleteAccount = (): ThunkActionType => async (dispatch: any) => {
  try {
    dispatch({
      type: AuthEvents.AUTH_DELETE,
    });
  } catch (err) {
    dispatch({
      type: AuthEvents.LOGOUT,
    });

    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: err.message,
        severity: "danger",
      },
    });
    console.error(err);
  }
};

const deleteRecipe = (id: string, idToken: string): ThunkActionType => async (
  dispatch: any
) => {
  try {
    dispatch({
      type: AuthEvents.AUTH_INIT,
    });
    const response = await axios({
      method: "POST",
      url: `${localhost}/api/delete-recipe`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        idToken: idToken,
        recipeId: id,
      },
    });

    const data = response.data;
    if (data) {
      dispatch({
        type: AlertEvents.SET_ALERT,
        payload: {
          message: "Recipe Deleted",
          severity: "info",
        },
      });
      dispatch({
        type: AuthEvents.AUTH_SUCCESS,
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};

const resetPassword = (email: string): ThunkActionType => async (
  dispatch: any
) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: "Check your email to reset your password",
        severity: "info",
        showMessage: true,
      },
    });
  } catch (error) {
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: error.message,
        severity: "error",
        showMessage: true,
      },
    });
  }
};

const verifyEmail = (email: string): ThunkActionType => async (
  dispatch: any
) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: `Verification email sent to ${email}`,
        severity: "info",
        showMessage: true,
      },
    });
  } catch (error) {
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: error.message,
        severity: "error",
        showMessage: true,
      },
    });
  }
};

const updateProfile = (
  newDisplayName: string,
  session: string
): ThunkActionType => async (dispatch: any) => {
  try {
    // verify session ?? ??
    const { currentUser } = await firebase.auth();

    if (currentUser) {
      await currentUser.updateProfile({
        displayName: newDisplayName,
      });
      const response = await axios({
        method: "POST",
        url: "${localhost}/api/user/updateName",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          uid: currentUser.uid,
          newName: newDisplayName,
          session: session,
        },
      });

      if (response.data.success) {
        const cookie = getCookie("mycookie");
        const payload = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          metadata: currentUser.metadata,
          session: cookie,
          emailVerified: currentUser.emailVerified,
        };
        dispatch({
          type: AuthEvents.AUTH_SUCCESS,
          payload: payload,
        });

        dispatch({
          type: AlertEvents.SET_ALERT,
          payload: {
            message: "Profile updated successfully",
            severity: "success",
            showMessage: true,
          },
        });
      } else {
        dispatch({
          type: AlertEvents.SET_ALERT,
          payload: {
            message: "There was an error updating your profile",
            severity: "error",
            showMessage: true,
          },
        });
      }
    }
  } catch (err) {
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: err.message,
        showMessage: true,
        severity: "error",
      },
    });
  }
};

const likeRecipe = (
  recipeId: string,
  uid: string,
  session: string
): ThunkActionType => async (dispatch: any) => {
  try {
    await axios({
      method: "POST",
      url: `${localhost}/api/like/${recipeId}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        uid: uid,
        session: session,
      },
    });
  } catch (error) {
    console.error(error.message);
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: error.message,
        severity: "error",
        showMessage: true,
      },
    });
  }
};

const updateColor = (color: string): ThunkActionType => async (
  dispatch: any
) => {
  dispatch({
    type: AuthEvents.PROFILE_UPDATE,
    payload: {
      color: color,
    },
  });
};

const saveColor = (
  uid: string,
  session: string,
  color: string
): ThunkActionType => async (dispatch: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${localhost}/api/user/updateColor`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        color: color,
        uid: uid,
        session: session,
      },
    });

    if (response.data.success) {
      dispatch({
        type: AlertEvents.SET_ALERT,
        payload: {
          message: response.data.message,
          severity: "success",
          showMessage: true,
        },
      });
    } else {
      dispatch({
        type: AlertEvents.SET_ALERT,
        payload: {
          message: response.data.message,
          severity: "error",
          showMessage: true,
        },
      });
    }
  } catch (error) {
    dispatch({
      type: AlertEvents.SET_ALERT,
      payload: {
        message: error.message,
        severity: "error",
        showMessage: true,
      },
    });
  }
};

export {
  deleteRecipe,
  deleteAccount,
  deleteUser,
  registerUser,
  loadUser,
  login,
  logout,
  verifyEmail,
  resetPassword,
  updateProfile,
  likeRecipe,
  updateColor,
  saveColor,
};
