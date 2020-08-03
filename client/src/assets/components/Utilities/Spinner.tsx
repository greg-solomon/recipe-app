import React from "react";
import { ClipLoader } from "react-spinners";

interface IProps {
  color: string;
}
const Component = ({ color }: IProps) => {
  return (
    <div className="spinner-wrapper">
      <ClipLoader color={color} />
    </div>
  );
};

export default Component;
