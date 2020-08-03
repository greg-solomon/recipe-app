import React, { useState } from "react";
import useStyles from "../../../lib/hooks/useStyles";
import { IUser } from "../../../types/recipeTypes";
import { Paper, Button, Modal } from "@material-ui/core";
import { Link } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import { red } from "@material-ui/core/colors";
interface IProps {
  calories: number;
  cautions: [string];
  dietLabels: [string];
  directions: [string];
  healthLabels: [string];
  image: string;
  ingredients: [string];
  label: string;
  url: string;
  _id: string;
  user_uploaded: boolean;
  source: IUser;
  isOwn: boolean;
  deleteRecipe: any;
  auth: any;
  date: Date;
  likes: [string];
  color: string;
}

const RecipeEntry = (props: IProps) => {
  const { label, image, _id, auth, deleteRecipe, color } = props;
  const classes = useStyles();
  const [deleteConf, setDeleteConf] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {open && <div className="click-off" onClick={() => setOpen(false)}></div>}
      <Paper className="recipe-entry" variant="outlined">
        <div className="recipe-entry-image">
          <Link
            to={{
              pathname: `/recipe/${_id}`,
              state: {
                calories: props.calories,
                cautions: props.cautions,
                dietLabels: props.dietLabels,
                directions: props.directions,
                healthLabels: props.healthLabels,
                image: props.image,
                ingredients: props.ingredients,
                label: props.label,
                url: props.url,
                _id: props._id,
                user_uploaded: props.user_uploaded,
                source: props.source,
                date: props.date,
                likes: props.likes,
                color: props.color,
              },
            }}
            aria-label="Go to Recipe"
          >
            <img src={image} alt="" />
          </Link>
        </div>
        <div className="recipe-entry-content">
          <Link
            to={{
              pathname: `/recipe/${_id}`,
              state: {
                calories: props.calories,
                cautions: props.cautions,
                dietLabels: props.dietLabels,
                directions: props.directions,
                healthLabels: props.healthLabels,
                image: props.image,
                ingredients: props.ingredients,
                label: props.label,
                url: props.url,
                _id: props._id,
                user_uploaded: props.user_uploaded,
                source: props.source,
                date: props.date,
                likes: props.likes,
                color: props.color,
              },
            }}
            aria-label="Go to Recipe"
            style={{
              color: "$dark",
              height: "100%",
              textAlign: "center",
            }}
          >
            {label}
          </Link>
          {props.isOwn && (
            <>
              <button
                type="button"
                className="dropdown"
                onClick={() => setOpen(!open)}
                aria-label="Show Options"
              >
                <IoMdMore color={color} />
              </button>
              {open && (
                <Paper
                  elevation={3}
                  className="dropdown-options"
                  style={{ backgroundColor: red[800], color: "white" }}
                  onClick={() => setDeleteConf(true)}
                >
                  <button
                    type="button"
                    aria-label="Delete Recipe"
                    onClick={() => setDeleteConf(true)}
                    style={{
                      backgroundColor: red[800],
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </Paper>
              )}
            </>
          )}
          <Modal open={deleteConf} onClose={() => setDeleteConf(false)}>
            <Paper className="modal-body">
              <h2>Delete {label}?</h2>
              <p style={{ margin: "1.75rem auto" }}>
                Are you sure you want to delete {label}?
              </p>
              <Button
                type="button"
                variant="text"
                aria-label="Delete Recipe"
                className={classes.deleteBtn}
                onClick={() => deleteRecipe(_id, auth.user.session)}
              >
                Delete {label}
              </Button>
            </Paper>
          </Modal>
        </div>
      </Paper>
    </>
  );
};

export default RecipeEntry;
