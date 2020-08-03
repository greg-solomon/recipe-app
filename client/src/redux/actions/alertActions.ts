import { AlertEvents } from "../../types/alertTypes";
import { ThunkActionType } from "../../types/types";

export const removeAlert = (): ThunkActionType => (dispatch: any) => {
  dispatch({
    type: AlertEvents.REMOVE_ALERT,
    payload: { message: "", severity: "", showMessage: false },
  });
};

export const setAlert = (
  message: string,
  severity: string
): ThunkActionType => (dispatch) => {
  dispatch({
    type: AlertEvents.SET_ALERT,
    payload: { message, severity, showMessage: true },
  });
};
