import React from "react";
import { colors } from "../Utilities";
import { MdCheck } from "react-icons/md";

interface IProps {
  selected: string;
  setSelected: Function;
}
const Colors = ({ selected, setSelected }: IProps) => {
  return (
    <div className="color-pick">
      {colors.map((color: string, i: number) => (
        <div
          style={{
            height: 32,
            width: 32,
            background: color,
            boxShadow:
              selected === color ? "2px 2px 2px rgba(0,0,0,0.3)" : "none",
          }}
          onClick={() => setSelected(color)}
          key={i}
        >
          {selected === color && (
            <MdCheck color="white" style={{ float: "right" }} fontSize="18px" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Colors;
