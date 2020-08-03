import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useOnScreen from "../../../lib/hooks/useOnScreen";

const Image = (props: any) => {
  const { image, label, _id } = props;
  const ref = useRef<any>();
  const visible = useOnScreen(ref, { margin: "-500px" });
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    if (visible) setHasRendered(true);
  }, [visible]);

  return (
    <div className="image-wrapper" ref={ref}>
      <Link
        to={{
          pathname: `/recipe/${_id}`,
          state: { ...props },
        }}
      >
        {hasRendered && <img src={image} alt={label} />}
      </Link>
    </div>
  );
};

export default Image;
