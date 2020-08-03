import React from "react";
import UserRecipes from "../Recipe/UserRecipes";
import { AuthState } from "../../../redux/reducers/authReducer";
import { Redirect } from "react-router-dom";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import useLikes from "../../../lib/hooks/useLikes";
import { ClipLoader } from "react-spinners";
import RecipeEntry from "../Recipe/RecipeEntry";
import { deleteRecipe } from "../../../redux/actions";
import { grey } from "@material-ui/core/colors";
interface IProps {
  location: any;
  auth: AuthState;
  deleteRecipe: Function;
}
const Profile = (props: IProps) => {
  const { source } = props.location.state;
  const { auth } = props;

  const uid = props.location.pathname.split("/").reverse()[0];
  const { likedRecipes, loading } = useLikes(uid);
  if (auth.isAuth && auth.user.uid === source.uid) return <Redirect to="/me" />;

  let color = auth.user !== null ? auth.user.color : grey[900];
  return (
    <div className="profile-wrapper">
      <h1 style={{ color: color }}>{source.displayName}'s Profile</h1>
      <div className="profile-content">
        <h3 style={{ color: color }}>Recipes</h3>
        <UserRecipes auth={auth} uid={source.uid} />
        <h3 style={{ color: color }}>Likes</h3>
        {loading && <ClipLoader color={color} />}
        {likedRecipes.map((recipe, i) => (
          <RecipeEntry
            {...recipe}
            auth={auth}
            isOwn={auth.isAuth && recipe.source.uid === auth.user.uid}
            deleteRecipe={deleteRecipe}
            key={i}
            color={color}
          />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteRecipe })(Profile);
