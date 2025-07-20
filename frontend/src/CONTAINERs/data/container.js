import { useEffect, useState } from "react";

/* Contexts -------------------------------------------------------------------------------------------------------------- */
import { DataContext } from "./context";
/* Contexts -------------------------------------------------------------------------------------------------------------- */

const DataContainer = ({ children }) => {
  const [jwtToken, setJwtToken] = useState(null);
  const [userId, setUserId] = useState(null);

  /* { load from localStorage } ------------------------------------------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const id = localStorage.getItem("userId");
    if (token) {
      setJwtToken(token);
    }
    if (id) {
      setUserId(id);
    }
  }, []);
  /* { load from localStorage } ------------------------------------------------------------------ */

  return (
    <DataContext.Provider value={{ jwtToken, setJwtToken, userId, setUserId }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContainer;
