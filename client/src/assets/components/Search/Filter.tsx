import React from "react";
import { BsFilterRight } from "react-icons/bs";
import FilterCheck from "./FilterCheck";
import { Button } from "@material-ui/core";

interface IProps {
  showFilters: boolean;
  dietLabelOptions: string[];
  selectedDietLabels: string[];
  healthLabelOptions: string[];
  selectedHealthLabels: string[];
  setSelectedHealthLabels: Function;
  setShowFilters: Function;
  setSelectedDietLabels: Function;
  iconColor: string;
}

const Filter = ({
  showFilters,
  setShowFilters,
  dietLabelOptions,
  setSelectedDietLabels,
  selectedDietLabels,
  healthLabelOptions,
  setSelectedHealthLabels,
  selectedHealthLabels,
  iconColor,
}: IProps) => (
  <>
    <Button
      style={{
        margin: "4px 0",
        padding: "14px",
        display: "inline-flex",
        alignItems: "center",
        float: "right",
        cursor: "pointer",
        backgroundColor: "white",
        marginTop: "0.5rem",
        border: "1px solid rgba(0, 0, 0, 0.12)",
      }}
      variant="text"
      aria-label="Show Filters"
      onClick={() => setShowFilters(!showFilters)}
    >
      Filters <BsFilterRight fontSize="1.15rem" color={iconColor} />
    </Button>
    {showFilters && (
      <>
        <FilterCheck
          options={dietLabelOptions}
          dispatch={setSelectedDietLabels}
          selected={selectedDietLabels}
          category={`Diet Labels`}
          color={iconColor}
        />
        <FilterCheck
          options={healthLabelOptions}
          dispatch={setSelectedHealthLabels}
          selected={selectedHealthLabels}
          category={`Health Labels`}
          color={iconColor}
        />
      </>
    )}
  </>
);

export default Filter;
