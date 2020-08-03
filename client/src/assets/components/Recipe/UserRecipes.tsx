import React from "react";
import { AuthState } from "../../../redux/reducers/authReducer";
import useUserRecipes from "../../../lib/hooks/useUserRecipes";
import { ClipLoader } from "react-spinners";
import RecipeEntry from "./RecipeEntry";
import { grey } from "@material-ui/core/colors";

interface IProps {
  uid: string;
  auth: AuthState;
  deleteRecipe?: any;
}
const UserRecipes = ({ uid, auth, deleteRecipe }: IProps) => {
  const { loading, error, data } = useUserRecipes(uid);
  let color = auth.user !== null ? auth.user.color : grey[900];
  if (loading || !data) return <ClipLoader color={color} />;
  if (auth.loading) return <ClipLoader color={color} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-recipes">
      {data.length === 0 && <p>No Recipes</p>}
      {data.map((r: any, i: number) => (
        <RecipeEntry
          {...r}
          isOwn={auth.isAuth && auth.user.uid === uid}
          key={i}
          auth={auth}
          deleteRecipe={deleteRecipe}
          color={color}
        />
      ))}
    </div>
  );
};

export default UserRecipes;
