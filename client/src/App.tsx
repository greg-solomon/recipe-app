import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./assets/components/Home/Home";
import Layout from "./assets/components/Layout/";
import { Login, Register, PasswordReset } from "./assets/components/Auth";
import { AppState } from "./redux/store/store";
import { connect } from "react-redux";
import { RecipeDetail, AddRecipe } from "./assets/components/Recipe";
import { CurrentUserProfile, Profile } from "./assets/components/Profile/";
import Search from "./assets/components/Search/";
import { loadUser, deleteUser } from "./redux/actions/authActions";
import Settings from "./assets/components/Profile/Settings";

function App({ auth, loadUser }: any) {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const { isAuth } = auth;

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/recipe/:id" exact component={RecipeDetail} />
          <Route path="/add" exact component={AddRecipe} />
          <Route path="/profile/:uid" component={Profile} />
          <Route path="/reset" exact component={PasswordReset} />
          <Route path="/search" exact component={() => <Search />} />
          {isAuth && <Route path="/me" exact component={CurrentUserProfile} />}
          {isAuth && <Route path="/settings" component={Settings} />}
        </Switch>
      </Layout>
    </Router>
  );
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loadUser, deleteUser })(App);
