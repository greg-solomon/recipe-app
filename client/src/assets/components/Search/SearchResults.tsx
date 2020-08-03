import React, { useState, useCallback, useRef } from "react";
import useSearch from "../../../lib/hooks/useSearch";
import RecipeCard from "../Recipe/RecipeCard";
import { Recipe } from "../../../types/recipeTypes";
import { ClipLoader } from "react-spinners";
interface IProps {
  search: string;
  selectedHealthLabels: string[];
  selectedDietLabels: string[];
  color: string;
}
const SearchResults = ({
  search,
  selectedDietLabels,
  selectedHealthLabels,
  color,
}: IProps) => {
  const [page, setPage] = useState<number>(1);
  const { loading, error, data, hasMore } = useSearch(search, page);

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

  if (error) {
    console.log(error);
    return <></>;
  }

  if (search === "") return <></>;
  return (
    <div className="grid">
      {data
        .filter(
          (recipe) =>
            selectedDietLabels.every((dl) => recipe.dietLabels.includes(dl)) &&
            selectedHealthLabels.every((hl) => recipe.healthLabels.includes(hl))
        )
        .map((d: Recipe, index: number) => {
          if (index === data.length - 1)
            return (
              <RecipeCard key={index} {...d} color={color} ref={lastCardRef} />
            );

          return <RecipeCard key={index} {...d} color={color} />;
        })}
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
          <ClipLoader color="dark" />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
