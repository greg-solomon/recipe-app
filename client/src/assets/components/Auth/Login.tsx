import React, { useState, useEffect } from "react";
import {
  Button,
  FormHelperText,
  InputAdornment,
  Paper,
  InputBase,
} from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { Alert, Spinner } from "../Utilities";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import { login, setAlert, removeAlert } from "../../../redux/actions";
import { AuthState } from "../../../redux/reducers/authReducer";
import { AlertState } from "../../../redux/reducers/alertReducer";
import { MdLock, MdPerson } from "react-icons/md";
import useStyles from "../../../lib/hooks/useStyles";
import { grey } from "@material-ui/core/colors";

interface IProps {
  auth: AuthState;
  alert: AlertState;
  login: Function;
  setAlert: Function;
  removeAlert: Function;
  history: any;
}

function Login(props: IProps) {
  const { auth, alert, login, setAlert, removeAlert } = props;
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (pw === "" || email === "") {
      setAlert(`Email and password fields must not be empty`, `error`);
      return;
    }

    login(email, pw);
  };

  let color = auth.user !== null ? auth.user.color : grey[900];
  useEffect(() => {
    return () => removeAlert();
  }, [removeAlert]);
  const classes = useStyles();
  if (auth.loading) return <Spinner color={color} />;
  if (auth.isAuth) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <div className="form-wrapper">
        <Paper
          variant="outlined"
          className={classes.paper}
          style={{ padding: 32 }}
        >
          <h1 className="login-title" style={{ color: grey[800] }}>
            Login
          </h1>
          <form>
            <Paper variant="outlined" className={classes.flexPaper}>
              <InputBase
                type="email"
                name="email"
                placeholder={"Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classes.inputBase}
                inputProps={{
                  "aria-label": `Email`,
                }}
              />
              <InputAdornment position="start">
                <MdPerson size="2rem" color={grey[800]} />
              </InputAdornment>
            </Paper>
            <Paper variant="outlined" className={classes.flexPaper}>
              <InputBase
                type="password"
                name="password"
                value={pw}
                placeholder="Password"
                className={classes.inputBase}
                onChange={(e) => setPw(e.target.value)}
                inputProps={{
                  "aria-label": `Email`,
                }}
              />
              <InputAdornment position="start">
                <MdLock size="2rem" color={grey[800]} />
              </InputAdornment>
            </Paper>
            <FormHelperText
              style={{
                margin: "0.5rem auto",
                float: "right",
                fontSize: "0.875rem",
              }}
            >
              <Link to="/reset" aria-label="Reset Password">
                Forgot your Password?
              </Link>
            </FormHelperText>
            {alert.showMessage && <Alert />}
            <div className="form-group">
              <Button
                color="secondary"
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                className={classes.btnPrimary}
                style={{ color: "white", backgroundColor: grey[800] }}
                aria-label={`Log In`}
              >
                Login
              </Button>
            </div>
            <FormHelperText
              style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
            >
              Don't have an account?{" "}
              <Link to="/register" aria-label="Sign Up">
                Sign up
              </Link>
            </FormHelperText>
          </form>
        </Paper>
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alert: state.alert,
});
export default connect(mapStateToProps, { login, setAlert, removeAlert })(
  Login
);
