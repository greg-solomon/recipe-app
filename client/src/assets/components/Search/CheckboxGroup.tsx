import React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

interface IProps {
  options: string[];
  handler: Function;
  color: string;
  selected: string[];
}
const CheckboxGroup = ({ options, handler, color, selected }: IProps) => {
  return (
    <>
      {options.map((option: string, i: number) => (
        <FormControlLabel
          value={option}
          key={i}
          label={option}
          control={
            <Checkbox
              onClick={() => handler(option)}
              checked={selected.includes(option)}
              style={{ color: color }}
              inputProps={{
                "aria-label": `${option} Checkbox`,
              }}
            />
          }
        />
      ))}
    </>
  );
};

export default CheckboxGroup;
