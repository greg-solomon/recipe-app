import React, { useState, useRef, useCallback, useEffect } from "react";
import useRecipes from "../../../lib/hooks/useRecipe";
import { ClipLoader } from "react-spinners";
import { Recipe } from "../../../types/recipeTypes";
import RecipeCard from "../Recipe/RecipeCard";
import { AuthState } from "../../../redux/reducers/authReducer";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import HomeCTA from "./HomeCTA";
import { removeAlert } from "../../../redux/actions";
import { red, grey } from "@material-ui/core/colors";
import { Spinner } from "../Utilities";

interface IProps {
  auth: AuthState;
  removeAlert: Function;
}
function Home({ auth, removeAlert }: IProps) {
  const [page, setPage] = useState(1);

  const { data, loading, error, hasMore } = useRecipes(page);
  const observer = useRef<any>();

  const lastCardRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage: number) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    return () => removeAlert();
  }, [removeAlert]);

  let color = auth.user !== null ? auth.user.color : grey[900];
  if (error) return <p>{error}</p>;
  if (loading && !data) return <Spinner color={color} />;
  return (
    <>
      {!auth.isAuth && <HomeCTA />}
      <div className="grid-wrapper">
        <div className="grid">
          {data.map((d: Recipe, index: number) => {
            if (index === data.length - 1)
              return (
                <RecipeCard
                  key={index}
                  {...d}
                  color={color}
                  ref={lastCardRef}
                />
              );

            return <RecipeCard key={index} color={color} {...d} />;
          })}
        </div>
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "300px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ClipLoader color={red[800]} />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { removeAlert })(Home);
