import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Button,
  FormGroup,
  FormHelperText,
  Paper,
  InputBase,
} from "@material-ui/core";
import { AppState } from "../../../redux/store/store";
import { registerUser, setAlert, removeAlert } from "../../../redux/actions/";
import { connect } from "react-redux";
import { AuthState } from "../../../redux/reducers/authReducer";
import { AlertState } from "../../../redux/reducers/alertReducer";
import { Alert, Spinner } from "../Utilities/";
import useStyles from "../../../lib/hooks/useStyles";
import { grey } from "@material-ui/core/colors";
import Colors from "./Colors";
import { colors } from "../Utilities";

interface IProps {
  auth: AuthState;
  alert: AlertState;
  registerUser: Function;
  setAlert: Function;
  removeAlert: Function;
}

function Register({
  auth,
  alert,
  registerUser,
  setAlert,
  removeAlert,
}: IProps) {
  const { loading, isAuth } = auth;
  const classes = useStyles();
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pw1: "",
    pw2: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { name, email, pw1, pw2 } = formData;
    if (name === "" || email === "" || pw1 === "" || pw2 === "") {
      setAlert("All fields are required.", "warning");
      return;
    }

    if (pw1 !== pw2) {
      setAlert("Passwords must match.", "warning");
      return;
    }

    if (pw1.length < 6) {
      setAlert("Password must be longer than 6 characters", "warning");
      return;
    }

    registerUser(email, pw1, name, selectedColor);
  };

  useEffect(() => {
    return () => removeAlert();
  }, [removeAlert]);
  let color = auth.user !== null ? auth.user.color : grey[900];
  if (loading) return <Spinner color={color} />;
  if (isAuth) return <Redirect to="/" />;
  return (
    <div>
      <div className="form-wrapper" style={{ marginTop: "4vh" }}>
        <Paper
          variant="outlined"
          className={classes.paper}
          style={{ padding: 32 }}
        >
          <h1 style={{ color: selectedColor }}>Register</h1>
          <FormHelperText style={{ fontSize: "0.875rem" }}>
            Create an account to upload and share your recipes!
          </FormHelperText>
          <form onSubmit={handleSubmit}>
            <Paper variant="outlined" className={classes.flexPaper}>
              <InputBase
                type="text"
                name="name"
                placeholder="Display Name"
                value={formData.name}
                className={classes.inputBase}
                inputProps={{
                  "aria-label": "Display Name",
                }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </Paper>
            <Paper variant="outlined" className={classes.flexPaper}>
              <InputBase
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                inputProps={{
                  "aria-label": "Email",
                }}
                className={classes.inputBase}
              />
            </Paper>
            <Paper variant="outlined" className={classes.flexPaper}>
              <InputBase
                type="password"
                placeholder="Password"
                name="password1"
                value={formData.pw1}
                inputProps={{
                  "aria-label": "Password",
                }}
                onChange={(e) =>
                  setFormData({ ...formData, pw1: e.target.value })
                }
                className={classes.inputBase}
              />
            </Paper>
            <Paper variant="outlined" className={classes.flexPaper}>
              <InputBase
                type="password"
                name="password2"
                placeholder="Confirm Password"
                value={formData.pw2}
                className={classes.inputBase}
                inputProps={{
                  "aria-label": "Confirm Password",
                }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pw2: e.target.value,
                  })
                }
              />
            </Paper>
            <h6 className="color-head" style={{ color: selectedColor }}>
              Color
            </h6>
            <Colors selected={selectedColor} setSelected={setSelectedColor} />
            <FormHelperText
              style={{ margin: "0.5rem auto", fontSize: "0.875rem" }}
            >
              Already have an account?{" "}
              <Link to="/login" aria-label="Go to Sign In">
                Sign in
              </Link>
            </FormHelperText>
            {alert.showMessage && <Alert />}
            <FormGroup>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                className={classes.btnPrimary}
                style={{ color: "white", backgroundColor: selectedColor }}
                aria-label="Sign Up"
              >
                Sign up
              </Button>
            </FormGroup>
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

export default connect(mapStateToProps, {
  registerUser,
  setAlert,
  removeAlert,
})(Register);
