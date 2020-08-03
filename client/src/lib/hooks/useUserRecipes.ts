import { useState, useEffect } from "react";
import axios from "axios";

let localhost =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

export default (uid: string) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${localhost}/api/user/recipes/${uid}`
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, [uid]);

  return { loading, data, error };
};
