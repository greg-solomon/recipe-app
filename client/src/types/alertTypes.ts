export enum AlertEvents {
  SET_ALERT = "ALERT/SET",
  REMOVE_ALERT = "ALERT/REMOVE",
}

export interface AlertType {
  type: AlertEvents;
  payload: {
    message: string;
    severity: string;
    showMessage: boolean;
  };
}
