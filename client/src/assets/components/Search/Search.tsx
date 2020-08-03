import React, { useState, useReducer } from "react";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import SearchResults from "./SearchResults";
import useStyles from "../../../lib/hooks/useStyles";
import { MdSearch } from "react-icons/md";
import { arrayReducer } from "../../../redux/reducers/";
import Filter from "./Filter";
import { debounce } from "lodash";
import { grey } from "@material-ui/core/colors";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";

interface IProps {
  auth: any;
}
const Search = ({ auth }: IProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [render, setRender] = useState(false);
  const dietLabelOptions = ["Low-Fat", "Low-Carb", "Balanced", "High-Protein"];
  const [selectedDietLabels, setSelectedDietLabels] = useReducer(
    arrayReducer,
    []
  );

  const healthLabelOptions = [
    "Vegan",
    "Vegetarian",
    "Peanut-Free",
    "Tree-Nut-Free",
    "Sugar-Conscious",
    "Immuno-Supportive",
  ];

  const [selectedHealthLabels, setSelectedHealthLabels] = useReducer(
    arrayReducer,
    []
  );

  const classes = useStyles();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (search === "") {
      setRender(false);
      return;
    }
    setRender(true);
  };

  const changeHandler = (e: any) => {
    setSearch(e.target.value.replace(/[^\w\s]/gi, ""));
    updateSearch();
  };

  const updateSearch = debounce(() => {
    if (search === "") {
      setRender(false);
      return;
    }
    setRender(true);
  }, 3000);

  let color = auth.user !== null ? auth.user.color : grey[800];
  return (
    <div className="search-form-wrapper">
      <div className="search-wrapper">
        <Paper
          component="form"
          className={classes.paper}
          variant="outlined"
          onSubmit={submitHandler}
        >
          <InputBase
            className={classes.inputBase}
            placeholder="Search"
            value={search}
            onChange={changeHandler}
            inputProps={{
              "aria-label": "Search",
            }}
          />
          <IconButton
            onClick={submitHandler}
            type="submit"
            aria-label="Search Button"
          >
            <MdSearch
              color={auth.user !== null ? auth.user.color : grey[800]}
            />
          </IconButton>
        </Paper>
        <Filter
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          dietLabelOptions={dietLabelOptions}
          healthLabelOptions={healthLabelOptions}
          selectedDietLabels={selectedDietLabels}
          setSelectedDietLabels={setSelectedDietLabels}
          setSelectedHealthLabels={setSelectedHealthLabels}
          selectedHealthLabels={selectedHealthLabels}
          iconColor={color}
        />
      </div>
      {render && (
        <SearchResults
          search={search}
          color={auth.user !== null ? auth.user.color : grey[800]}
          selectedDietLabels={selectedDietLabels}
          selectedHealthLabels={selectedHealthLabels}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  alert: state.alert,
  auth: state.auth,
});
export default connect(mapStateToProps, {})(Search);
