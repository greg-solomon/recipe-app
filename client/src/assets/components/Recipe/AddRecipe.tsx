import React, { useState, useReducer, FormEvent, useEffect } from "react";
import axios from "axios";
import {
  Button,
  FormGroup,
  FormControlLabel,
  Paper,
  InputBase,
  IconButton,
  FormHelperText,
  Checkbox,
} from "@material-ui/core";
import { MdClose, MdAdd } from "react-icons/md";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { verifyEmail, setAlert, removeAlert } from "../../../redux/actions/";
import { AuthState } from "../../../redux/reducers/authReducer";
import { AlertState } from "../../../redux/reducers/alertReducer";
import { arrayReducer } from "../../../redux/reducers/";
import { Alert } from "../Utilities/";
import useStyles from "../../../lib/hooks/useStyles";
import { grey } from "@material-ui/core/colors";
import CheckboxGroup from "../Search/CheckboxGroup";

interface IngredientProps {
  ingredient: string;
  removeItem: any;
}

interface DirectionProps {
  step: number;
  instruction: string;
  removeDirection: any;
}

interface IProps {
  auth: AuthState;
  alert: AlertState;
  verifyEmail: Function;
  removeAlert: Function;
}
const AddRecipe = ({ auth, alert, verifyEmail, removeAlert }: IProps) => {
  const [name, setName] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [ingredient, setIngredient] = useState<string>("");
  const [image, setImage] = useState<any>("");
  const [ingredients, setIngredients] = useReducer(arrayReducer, []);
  const [healthLabels, setHealthLabels] = useReducer(arrayReducer, []);
  const [directions, setDirections] = useReducer(arrayReducer, []);
  const [cautions, setCautions] = useReducer(arrayReducer, []);
  const [dietLabels, setDietLabels] = useReducer(arrayReducer, []);
  const [cautionOptions, setCautionOptions] = useReducer(arrayReducer, [
    "Sulfites",
    "Shellfish",
    "Gluten",
    "Wheat",
    "Soy",
    "Tree-Nuts",
    "Eggs",
    "Milk",
  ]);
  const [addedCautionLabel, setAddedCautionLabel] = useState("");
  const [healthLabelOptions, setHealthLabelOptions] = useReducer(arrayReducer, [
    "Vegan",
    "Vegetarian",
    "Peanut-Free",
    "Tree-Nut-Free",
    "Sugar-Conscious",
    "Immuno-Supportive",
  ]);
  const [addedHealthLabel, setAddedHealthLabel] = useState("");
  const [dietLabelOptions, setDietLabelOptions] = useReducer(arrayReducer, [
    "Low-Fat",
    "Low-Carb",
    "Balanced",
    "High-Protein",
  ]);
  const [addedDietLabel, setAddedDietLabel] = useState("");

  const enterDirection = (e: React.KeyboardEvent) => {
    if (e.keyCode !== 13 || direction === "") return;
    setDirections({ type: "add", value: direction });
    e.preventDefault();
    setDirection("");
  };

  const addDirection = (e: React.MouseEvent) => {
    if (direction === "") return;
    setDirections({ type: "add", value: direction });
    setDirection("");
    e.preventDefault();
  };

  const removeDirection = (value: string) => {
    setDirections({ type: "remove", value });
  };

  const healthLabelHandler = (name: string) => {
    if (healthLabels.includes(name)) {
      setHealthLabels({ type: "remove", value: name });
    } else {
      setHealthLabels({ type: "add", value: name });
    }
  };

  const cautionLabelHandler = (caution: string) => {
    if (cautions.includes(caution)) {
      setCautions({ type: "remove", value: caution });
    } else {
      setCautions({ type: "add", value: caution });
    }
  };

  const dietLabelHandler = (dietLabel: string) => {
    if (dietLabels.includes(dietLabel)) {
      setDietLabels({ type: "remove", value: dietLabel });
    } else {
      setDietLabels({ type: "add", value: dietLabel });
    }
  };

  const enterIngredient = (e: React.KeyboardEvent): void => {
    if (e.keyCode !== 13 || ingredient === "") return;
    setIngredients({ type: "add", value: ingredient });
    setIngredient("");
    e.preventDefault();
  };

  const addIngredient = (e: React.MouseEvent) => {
    if (ingredient === "") return;
    setIngredients({ type: "add", value: ingredient });
    setIngredient("");
    e.preventDefault();
  };

  const removeIngredient = (value: string): void => {
    setIngredients({ type: "remove", value });
  };

  const handleImageUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();

    formData.set("label", name);
    formData.set("healthLabels", JSON.stringify(healthLabels));
    formData.set("dietLabels", JSON.stringify(dietLabels));
    formData.set("cautions", JSON.stringify(cautions));
    formData.set("ingredients", JSON.stringify(ingredients));
    formData.set("directions", JSON.stringify(directions));
    formData.set(
      "source",
      JSON.stringify({ uid: auth.user.uid, displayName: auth.user.displayName })
    );
    formData.append("image", image);
    // @TODO add source as current user
    await axios.post(`http://localhost:5000/add-recipe`, formData);
  };

  const validateForm = (): boolean => {
    if (!name) {
      setAlert("Your recipe needs a name!", "warning");
      return false;
    }

    if (ingredients.length === 0) {
      setAlert("You haven't added any ingredients!", "warning");
      return false;
    }

    if (directions.length === 0) {
      setAlert(`You haven't added any directions!`, "warning");
      return false;
    }

    return true;
  };

  const handleAddLabel = (
    event: any,
    label: string,
    dispatch: any,
    reset: any
  ) => {
    if (event.keyCode !== 13 || label !== "") return;
    dispatch({ type: "add", value: label });
    reset("");
  };

  const buttonAddLabel = (
    label: string,
    dispatch: Function,
    reset: Function
  ) => {
    if (label === "") return;
    dispatch({ type: "add", value: label });
    reset("");
  };

  useEffect(() => {
    return () => removeAlert();
  }, [removeAlert]);

  const classes = useStyles();

  if (!auth.isAuth) {
    return <Redirect to="/login" />;
  }

  let color = auth.user !== null ? auth.user.color : grey[800];
  if (!auth.user.emailVerified) {
    return (
      <div>
        <div className="form-wrapper">
          <h2 style={{ fontSize: 22, color: color }}>
            Email Verification Required
          </h2>
          <p style={{ whiteSpace: "nowrap", margin: "1rem auto" }}>
            In order to add recipes you need to verify your email address.
          </p>
          <FormHelperText style={{ whiteSpace: "nowrap" }}>
            Having trouble finding the verification email?{" "}
          </FormHelperText>
          <Button
            variant="contained"
            className={classes.btnPrimary}
            color="primary"
            style={{
              color: "white",
              marginTop: "1rem",
              backgroundColor: color,
            }}
            onClick={() => verifyEmail(auth.user.email)}
          >
            Resend Verification Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-recipe-wrapper">
      <Paper
        variant="outlined"
        className={classes.paper}
        style={{ padding: 24 }}
      >
        <h2 style={{ fontSize: "3rem", color: color }}>Add a Recipe</h2>
        <p>Add a recipe to share with other users.</p>
        {alert.showMessage && <Alert />}
        <form method="post" encType="multipart/form-data">
          <h4>Dish Name</h4>
          <div className="form-group">
            <Paper variant="outlined" className={classes.paper}>
              <InputBase
                name="name"
                placeholder="Dish Name"
                value={name}
                className={classes.inputBase}
                onChange={(e) => setName(e.target.value)}
              />
            </Paper>
          </div>
          <h4>Ingredients</h4>
          {ingredients.map((ing: string, i: number) => (
            <Ingredient
              ingredient={ing}
              key={i}
              removeItem={removeIngredient}
            />
          ))}
          <div className="form-group">
            <Paper variant="outlined" className={classes.paper}>
              <InputBase
                placeholder="Add Ingredients"
                className={classes.inputBase}
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                onKeyDown={enterIngredient}
              />
              <IconButton onClick={addIngredient}>
                <MdAdd
                  color={auth.user !== null ? auth.user.color : grey[800]}
                />
              </IconButton>
            </Paper>
            <FormHelperText>Press Enter to Add an Ingredient</FormHelperText>
          </div>
          <h4>Directions</h4>
          {directions.map((direction: string, i: number) => (
            <Direction
              instruction={direction}
              step={i + 1}
              key={i}
              removeDirection={removeDirection}
            />
          ))}
          <div className="form-group">
            <Paper className={classes.paper} variant="outlined">
              <InputBase
                placeholder="Add Directions"
                className={classes.inputBase}
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                onKeyDown={enterDirection}
              />
              <IconButton onClick={addDirection}>
                <MdAdd
                  color={auth.user !== null ? auth.user.color : grey[800]}
                />
              </IconButton>
            </Paper>
            <FormHelperText>Press Enter to Add a Direction</FormHelperText>
          </div>
          <h4>Diet Labels</h4>
          <FormGroup row={true}>
            <CheckboxGroup
              options={dietLabelOptions}
              handler={dietLabelHandler}
              color={color}
              selected={dietLabels}
            />
          </FormGroup>
          <div className="form-group">
            <Paper variant="outlined" className={classes.paper}>
              <InputBase
                className={classes.inputBase}
                placeholder={"Add a Diet Label..."}
                value={addedDietLabel}
                onChange={(e) => setAddedDietLabel(e.target.value)}
                onKeyDown={(e) =>
                  handleAddLabel(
                    e,
                    addedDietLabel,
                    setDietLabelOptions,
                    setAddedDietLabel
                  )
                }
              />
              <IconButton
                onClick={(e) =>
                  buttonAddLabel(
                    addedDietLabel,
                    setDietLabelOptions,
                    setAddedDietLabel
                  )
                }
              >
                <MdAdd
                  color={auth.user !== null ? auth.user.color : grey[800]}
                />
              </IconButton>
            </Paper>
            <FormHelperText>Press Enter to Add a Diet Label</FormHelperText>
          </div>

          <h4>Health Labels</h4>
          <FormGroup row>
            <CheckboxGroup
              options={healthLabelOptions}
              color={color}
              selected={healthLabels}
              handler={healthLabelHandler}
            />
          </FormGroup>
          <div className="form-group">
            <Paper variant="outlined" className={classes.paper}>
              <InputBase
                className={classes.inputBase}
                placeholder={"Add a Health Label..."}
                value={addedHealthLabel}
                onChange={(e) => setAddedHealthLabel(e.target.value)}
                onKeyDown={(e) =>
                  handleAddLabel(
                    e,
                    addedHealthLabel,
                    setHealthLabelOptions,
                    setAddedHealthLabel
                  )
                }
              />
              <IconButton
                onClick={(e) =>
                  buttonAddLabel(
                    addedHealthLabel,
                    setHealthLabelOptions,
                    setAddedHealthLabel
                  )
                }
              >
                <MdAdd
                  color={auth.user !== null ? auth.user.color : grey[800]}
                />
              </IconButton>
            </Paper>
            <FormHelperText>Press Enter to Add a Health Label</FormHelperText>
          </div>
          <h4>Cautions</h4>
          <FormGroup row>
            <CheckboxGroup
              selected={cautions}
              options={cautionOptions}
              handler={cautionLabelHandler}
              color={color}
            />
          </FormGroup>
          <div className="form-group">
            <Paper variant="outlined" className={classes.paper}>
              <InputBase
                className={classes.inputBase}
                placeholder={"Add a Caution Label..."}
                value={addedCautionLabel}
                onChange={(e) => setAddedCautionLabel(e.target.value)}
                onKeyDown={(e) =>
                  handleAddLabel(
                    e,
                    addedCautionLabel,
                    setCautionOptions,
                    setAddedCautionLabel
                  )
                }
              />
              <IconButton
                onClick={(e) =>
                  buttonAddLabel(
                    addedCautionLabel,
                    setCautionOptions,
                    setAddedCautionLabel
                  )
                }
              >
                <MdAdd
                  color={auth.user !== null ? auth.user.color : grey[900]}
                />
              </IconButton>
            </Paper>
            <FormHelperText>Press Enter to Add a Caution</FormHelperText>
          </div>
          <h4>Upload Image</h4>
          <div className="upload-btn-wrapper" style={{ cursor: "pointer" }}>
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: color,
                color: "white",
                cursor: "pointer",
              }}
            >
              Upload Image
            </button>
            <input
              name="file"
              type="file"
              className={"file-upload"}
              onChange={handleImageUpload}
            />
          </div>
          {image && image.name ? image.name : "No image selected"}
          <div className="form-group">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={handleSubmission}
              className={classes.btnPrimary}
              style={{ color: "white", backgroundColor: color }}
            >
              Add Recipe
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

function Ingredient({ ingredient, removeItem }: IngredientProps) {
  return (
    <div className="added-ingredient">
      {ingredient}
      <button onClick={() => removeItem(ingredient)} type="button">
        <MdClose color="#000" />
      </button>
    </div>
  );
}

function Direction({ instruction, step, removeDirection }: DirectionProps) {
  return (
    <div className="direction">
      <div className="d-step">{step}</div>
      <div className="d-instruction">{instruction}</div>
      <button
        onClick={() => removeDirection(instruction)}
        className="d-close"
        type="button"
      >
        <MdClose color="#000" />
      </button>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alert: state.alert,
});
export default connect(mapStateToProps, { setAlert, verifyEmail, removeAlert })(
  AddRecipe
);
