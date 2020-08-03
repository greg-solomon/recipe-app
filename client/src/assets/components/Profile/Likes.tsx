import React from "react";
import useLikes from "../../../lib/hooks/useLikes";
import { AuthState } from "../../../redux/reducers/authReducer";
import RecipeEntry from "../Recipe/RecipeEntry";
import { ClipLoader } from "react-spinners";
import { grey } from "@material-ui/core/colors";

interface IProps {
  auth: AuthState;
  deleteRecipe: Function;
}
const Likes = ({ auth, deleteRecipe }: IProps) => {
  const { likedRecipes, loading } = useLikes(auth.user.uid);
  let color = auth.user !== null ? auth.user.color : grey[900];

  return (
    <>
      <h3 style={{ color: color }}>Likes</h3>
      <div className="user-recipes">
        {loading && <ClipLoader color={color} />}
        {likedRecipes.length === 0 && <p>No liked recipes</p>}
        {likedRecipes.map((recipe, i) => (
          <RecipeEntry
            {...recipe}
            auth={auth}
            isOwn={auth.isAuth && recipe.source.uid === auth.user.uid}
            deleteRecipe={deleteRecipe}
            color={color}
            key={i}
          />
        ))}
      </div>
    </>
  );
};

export default Likes;
