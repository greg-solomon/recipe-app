import { useState, useEffect } from "react";
import { Recipe } from "../../types/recipeTypes";
import axios from "axios";

let localhost = process.env.NODE_ENV === "development" ? "${localhost}" : "";

export default (uid: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  if (!uid) return { loading, error, likedRecipes };
  useEffect(() => {
    async function fetchLikes() {
      try {
        setLoading(true);

        const response = await axios({
          method: "GET",
          url: `${localhost}/api/user/likes/${uid}`,
        });

        const { data } = response;

        setLikedRecipes(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchLikes();
  }, [uid]);

  return { loading, error, likedRecipes };
};
