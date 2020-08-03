import React, { useState, useEffect } from "react";
import { Paper, InputBase, InputAdornment, Button } from "@material-ui/core";
import { MdPerson } from "react-icons/md";
import { grey } from "@material-ui/core/colors";
import useStyles from "../../../lib/hooks/useStyles";
import { resetPassword, removeAlert } from "../../../redux/actions/";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import { AlertState } from "../../../redux/reducers/alertReducer";
import Alert from "../Utilities/Alert";
import { withRouter } from "react-router-dom";
import { AuthState } from "../../../redux/reducers/authReducer";

interface IProps {
  resetPassword: Function;
  removeAlert: Function;
  alert: AlertState;
  auth: AuthState;
  history: any;
}
const PasswordReset = ({
  resetPassword,
  removeAlert,
  alert,
  auth,
  history,
}: IProps) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");

  const handler = () => {
    resetPassword(email);
  };

  useEffect(() => {
    return () => removeAlert();
  }, [removeAlert]);

  let color = auth.user !== null ? auth.user.color : grey[900];
  return (
    <div>
      <div className="form-wrapper" style={{ maxWidth: 400, width: "95%" }}>
        <Button
          className={classes.backBtn}
          onClick={history.goBack}
          style={{ backgroundColor: color, position: "absolute", top: "-50%" }}
          aria-label="Go Back"
        >
          Back
        </Button>
        {alert.showMessage && <Alert />}

        <h2>Forgot your Password?</h2>
        <Paper variant="outlined" className={classes.flexPaper}>
          <InputBase
            type="email"
            name="email"
            placeholder={"Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classes.inputBase}
            inputProps={{
              "aria-label": "Email",
            }}
          />
          <InputAdornment position="start">
            <MdPerson size="2rem" color={grey[800]} />
          </InputAdornment>
        </Paper>
        <Button
          color="primary"
          variant="contained"
          aria-label="Send Reset Email"
          className={classes.btnPrimary}
          style={{
            color: "white",
            margin: "1rem auto",
            backgroundColor: grey[800],
          }}
          onClick={handler}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alert: state.alert,
});
export default withRouter(
  connect(mapStateToProps, { resetPassword, removeAlert })(PasswordReset)
);
