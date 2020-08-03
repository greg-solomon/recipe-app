import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store/store";
import { likeRecipe } from "../../../redux/actions";
import { AuthState } from "../../../redux/reducers/authReducer";
import { Button } from "@material-ui/core";
import useStyles from "../../../lib/hooks/useStyles";

interface IProps {
  calories: number;
  cautions: [string];
  dietLabels: [string];
  healthLabels: [string];
  image: string;
  ingredients: [string];
  label: string;
  source: {
    uid: string | null;
    displayName: string;
  };
  location: any;
  directions: [string];
  likes: [string];
  url: string;
  user_uploaded: boolean;
  date: string;
  _id: string;
  color: string;
  likeRecipe: Function;
  auth: AuthState;
  history: any;
}
function RecipeDetail(props: IProps) {
  const {
    calories,
    cautions,
    dietLabels,
    healthLabels,
    image,
    ingredients,
    label,
    source,
    directions,
    likes,
    url,
    user_uploaded,
    date,
    _id,
    color,
  } = props.location.state;
  const { likeRecipe, auth } = props;
  const [likeCount, setLikeCount] = useState(likes.length);
  const likeHandler = () => {
    if (likes.includes(auth.user.uid)) {
      const i = likes.indexOf(auth.user.uid);
      likes.splice(i, 1);
      setLikeCount(likes.length);
      likeRecipe(_id, auth.user.uid, auth.user.session);
    } else {
      likes.push(auth.user.uid);
      setLikeCount(likes.length);
      likeRecipe(_id, auth.user.uid, auth.user.session);
    }
  };

  const classes = useStyles();
  return (
    <div className="detail-wrapper">
      <Button
        className={classes.backBtn}
        onClick={props.history.goBack}
        style={{ backgroundColor: color }}
        aria-label="Go Back"
      >
        Back
      </Button>
      <h2 className="recipe-title">{label}</h2>
      <div className="recipe-source" style={{ backgroundColor: color }}>
        {user_uploaded ? (
          <Link
            to={{
              pathname: `/profile/${source.uid}`,
              state: {
                source: source,
              },
            }}
            aria-label="Go to Profile"
            style={{
              textAlign: "center",
              backgroundColor: color,
            }}
          >
            {source.displayName}
          </Link>
        ) : (
          <a
            href={url}
            rel="noreferrer noopener"
            target="_blank"
            style={{ backgroundColor: color }}
            aria-label="Go to Source"
          >
            {source.displayName}
          </a>
        )}
      </div>
      <div className="image-wrapper">
        <img src={image} alt={label} className="recipe-image" />
      </div>

      <div className="recipe-interact">
        {likeCount}&nbsp; likes
        {auth.isAuth && (
          <Button
            onClick={likeHandler}
            className={classes.likeBtn}
            style={{ display: "inline-block", backgroundColor: color }}
            aria-label={`${likes.includes(auth.user.uid) ? "Unlike" : "Like"}`}
          >
            {likes.includes(auth.user.uid) ? "Unlike" : "Like"}
          </Button>
        )}
      </div>
      <div className="recipe-content">
        <p
          style={{ textAlign: "right", display: "block", margin: "2rem auto" }}
        >
          {format(new Date(date), "MMMM dd, yyyy")}
        </p>
        {calories && (
          <p className="calorie-count">
            {Math.round(Number.parseFloat(calories))} calories
          </p>
        )}
        {!user_uploaded && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: color,
              color: "white",
              padding: 8,
              textAlign: "center",
              display: "inline-block",
              marginTop: 20,
            }}
            aria-label="Go to Full Recipe"
          >
            Full Recipe
          </a>
        )}
        {healthLabels.length > 0 && (
          <>
            <h4 style={{ color: color }}>Health Labels</h4>
            <ul className="health-labels">
              {healthLabels.map((healthLabel: string, i: number) => (
                <li key={i}>{healthLabel}</li>
              ))}
            </ul>
          </>
        )}
        {dietLabels.length > 0 && (
          <>
            <h4 className="diet-label" style={{ color: color }}>
              Diet Labels
            </h4>
            <ul className="diet-labels">
              {dietLabels.map((dietLabel: string, i: number) => (
                <li key={i}>{dietLabel}</li>
              ))}
            </ul>
          </>
        )}
        {cautions.length > 0 && (
          <>
            <h4 className="caution-label" style={{ color: color }}>
              Cautions
            </h4>
            <ul className="cautions">
              {cautions.map((caution: string, i: number) => (
                <li key={i}>{caution}</li>
              ))}
            </ul>
          </>
        )}
        <h4 style={{ color: color }}>Ingredients</h4>
        <ul className="ingredients">
          {ingredients.map((ingredient: any, i: number) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
        {directions.length > 0 && (
          <>
            <h4 style={{ color: color }}>Directions</h4>
            {directions.map((direction: string, i: number) => (
              <p key={i}>{direction}</p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { likeRecipe })(RecipeDetail);
