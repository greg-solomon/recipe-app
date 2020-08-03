import React from "react";
import Header from "./Header";

interface IProps {
  children: React.ReactNode;
}

export default ({ children }: IProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
