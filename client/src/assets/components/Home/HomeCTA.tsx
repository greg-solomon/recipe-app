import React from "react";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import { grey } from "@material-ui/core/colors";

const HomeCTA = () => {
  return (
    <Paper
      variant="outlined"
      style={{ maxWidth: "1290px", width: "95%", padding: 24 }}
    >
      <h2 style={{ color: grey[800] }}>Welcome to RecipeShare!</h2>
      <p style={{ marginTop: "0.5rem" }}>
        RecipeShare is a social network for sharing recipes!{" "}
        <Link to="login" aria-label="Go to Login">
          Login
        </Link>{" "}
        or{" "}
        <Link to="/register" aria-label="Go to Sign Up">
          sign up
        </Link>{" "}
        to start sharing!
      </p>
    </Paper>
  );
};

export default HomeCTA;
