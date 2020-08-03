import { useState, useEffect } from "react";
import axios from "axios";
import { Recipe } from "../../types/recipeTypes";

let localhost =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";
export default (page: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<Recipe[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  useEffect(() => {
    let cancel: any;
    async function fetchRecipes() {
      setLoading(true);
      try {
        const res = await axios({
          method: "GET",
          url: `${localhost}/api/all/${page}`,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });

        setData((prevData: any) => {
          return [...prevData, ...res.data];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchRecipes();

    return () => cancel();
  }, [page]);

  return { loading, error, data, hasMore };
};
