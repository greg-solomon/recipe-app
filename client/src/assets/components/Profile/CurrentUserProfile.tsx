import React, { useEffect } from "react";
import { AuthState } from "../../../redux/reducers/authReducer";
import { Redirect, withRouter } from "react-router-dom";
import UserRecipes from "../Recipe/UserRecipes";
import { Button, Paper } from "@material-ui/core";
import useStyles from "../../../lib/hooks/useStyles";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store/store";
import {
  deleteUser,
  deleteRecipe,
  verifyEmail,
  removeAlert,
} from "../../../redux/actions/";
import Spinner from "../Utilities/Spinner";
import { red, grey } from "@material-ui/core/colors";
import Likes from "./Likes";
interface IProps {
  auth: AuthState;
  deleteUser: Function;
  deleteRecipe: Function;
  verifyEmail: Function;
  removeAlert: Function;
}
const CurrentUserProfile = ({
  auth,
  deleteUser,
  deleteRecipe,
  verifyEmail,
  removeAlert,
}: IProps) => {
  const classes = useStyles();

  useEffect(() => {
    return () => removeAlert();
  }, [removeAlert]);

  if (!auth || !auth.isAuth) return <Redirect to="/login" />;
  const { displayName } = auth.user;

  let color = auth.user !== null ? auth.user.color : grey[900];
  return (
    <div className="profile-wrapper">
      <Paper
        className={classes.paper}
        variant="outlined"
        style={{ flexDirection: "column", padding: "24px" }}
      >
        <h1 style={{ fontSize: "2rem", color: color }}>
          {displayName}'s Profile
        </h1>
        <div className="profile-content">
          {!auth.user.emailVerified && (
            <Paper
              className={classes.paper}
              variant="outlined"
              style={{ flexDirection: "column", padding: "24px" }}
            >
              <h4 style={{ color: color }}>Email Verification Required</h4>
              <p style={{ margin: "0.5rem auto" }}>
                Your account still requires email verification.
              </p>
              <Button
                variant="contained"
                color="primary"
                style={{
                  margin: "0.5rem auto",
                  color: "white",
                  backgroundColor: color,
                }}
                aria-label="Send Email Verification"
                onClick={() => verifyEmail()}
              >
                Resend Verification Email
              </Button>
            </Paper>
          )}
          <h3 style={{ color: color }}>Recipes</h3>
          {auth.loading ? (
            <Spinner color={color} />
          ) : (
            <UserRecipes
              auth={auth}
              uid={auth.user.uid}
              deleteRecipe={deleteRecipe}
            />
          )}
          <Likes auth={auth} deleteRecipe={deleteRecipe} />
        </div>
      </Paper>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  alert: state.alert,
  auth: state.auth,
});

export default withRouter(
  connect(mapStateToProps, {
    deleteUser,
    deleteRecipe,
    verifyEmail,
    removeAlert,
  })(CurrentUserProfile)
);
