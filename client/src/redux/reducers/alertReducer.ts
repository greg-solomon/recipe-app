import { AlertEvents, AlertType } from "../../types/alertTypes";

export interface AlertState {
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
  showMessage: boolean;
}
const initState = {
  message: "",
  severity: undefined,
  showMessage: false,
};

export default (state: AlertState = initState, action: AlertType) => {
  const { type, payload } = action;
  switch (type) {
    case AlertEvents.SET_ALERT:
      return {
        message: payload.message,
        severity: payload.severity,
        showMessage: true,
      };
    case AlertEvents.REMOVE_ALERT:
      return {
        message: "",
        severity: "",
        showMessage: false,
      };
    default:
      return state;
  }
};
