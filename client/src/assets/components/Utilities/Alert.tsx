import React from "react";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import { AlertState } from "../../../redux/reducers/alertReducer";
import { Alert } from "@material-ui/lab";
import { removeAlert } from "../../../redux/actions/alertActions";
interface IProps {
  alert: AlertState;
  removeAlert: any;
}
const Component = ({ alert, removeAlert }: IProps) => {
  return (
    <Alert
      severity={alert.severity}
      onClose={removeAlert}
      style={{ width: "100%", margin: "0.5rem auto" }}
    >
      {alert.message}
    </Alert>
  );
};

const mapStateToProps = (state: AppState) => ({
  alert: state.alert,
});

export default connect(mapStateToProps, { removeAlert })(Component);
