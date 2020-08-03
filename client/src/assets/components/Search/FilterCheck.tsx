import React, { useState } from "react";
import { Checkbox, FormControlLabel, Paper, Button } from "@material-ui/core";
import { MdKeyboardArrowLeft } from "react-icons/md";
import useStyles from "../../../lib/hooks/useStyles";
import { animated, useSpring } from "react-spring";
import CheckboxGroup from "./CheckboxGroup";
interface IProps {
  options: string[];
  category: string;
  dispatch: Function;
  selected: string[];
  color: string;
}
const FilterCheck = ({
  options,
  category,
  dispatch,
  selected,
  color,
}: IProps) => {
  const [toggle, setToggle] = useState(false);
  const handler = (option: string) => {
    if (selected.includes(option)) {
      dispatch({ type: "remove", value: option });
    } else {
      dispatch({ type: "add", value: option });
    }
  };

  const classes = useStyles();
  const spring = useSpring({
    transform: toggle ? "rotate(-90deg)" : `rotate(0deg)`,
  });

  return (
    <>
      <Button
        className={classes.filterCheck}
        variant="text"
        onClick={() => setToggle(!toggle)}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          display: "flex",
          alignItems: "center",
        }}
        aria-label={`Show ${category}`}
      >
        <h3>{category}</h3>
        <Icon style={spring} fontSize="1.5rem" />
      </Button>
      {toggle && (
        <Paper
          style={{
            marginTop: "4px",
            padding: "8px 24px",
            border: "1px solid rgba(0, 0, 0, 0.12)",
          }}
          variant="outlined"
        >
          <CheckboxGroup
            options={options}
            handler={handler}
            color={color}
            selected={selected}
          />
        </Paper>
      )}
    </>
  );
};

const Icon = animated(MdKeyboardArrowLeft);

export default FilterCheck;
