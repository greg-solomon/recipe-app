import { useEffect, useState } from "react";

export default (ref: any, options: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);
    let current = ref.current;
    if (current) {
      observer.observe(ref.current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [ref, options]);

  return visible;
};
