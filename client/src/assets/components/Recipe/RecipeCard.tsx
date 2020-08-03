import React, { forwardRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IUser } from "../../../types/recipeTypes";
import CardImage from "../Utilities/Image";
import { MdPerson } from "react-icons/md";
import { Paper } from "@material-ui/core";
interface IProps {
  calories: number;
  cautions: [string];
  dietLabels: [string];
  healthLabels: [string];
  image: string;
  ingredients: [string];
  label: string;
  source: IUser;
  url: string;
  user_uploaded: boolean;
  _id: string;
  likes: [string];
  color?: string;
}

const RecipeCard = forwardRef((props: IProps, ref: any) => {
  const { label, source, url, user_uploaded, _id, likes, color } = props;

  return (
    <Paper className="recipe-card" ref={ref} elevation={3}>
      <div className="title-bar" style={{ background: color }}>
        <Link
          to={{ pathname: `/recipe/${_id}`, state: { ...props } }}
          style={{ fontWeight: 700 }}
          className="detail-link"
          aria-label="Go to Recipe"
        >
          {label}
        </Link>
      </div>
      <CardImage {...props} />
      <div className="card-link-wrapper" style={{ backgroundColor: color }}>
        {user_uploaded ? (
          <>
            <p>{likes.length} likes</p>
            <Link
              to={{
                pathname: `/profile/${source.uid}`,
                state: {
                  source: source,
                },
              }}
              aria-label="Go to Profile"
              className="source-link"
            >
              {source.displayName}
              <MdPerson color="white" fontSize="0.875rem" />
            </Link>
          </>
        ) : (
          <>
            <p>{likes.length} likes</p>
            <a
              href={url}
              className="source-link"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Go to Source"
            >
              {source.displayName}
              <FiExternalLink fontSize=".875rem" color="white" />
            </a>
          </>
        )}
      </div>
    </Paper>
  );
});

export default RecipeCard;
