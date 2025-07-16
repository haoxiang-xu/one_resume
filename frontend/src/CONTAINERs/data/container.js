import { useEffect, useState } from "react";

/* Contexts -------------------------------------------------------------------------------------------------------------- */
import { DataContext } from "./context";
/* Contexts -------------------------------------------------------------------------------------------------------------- */

const DataContainer = ({ children }) => {
  const [jwtToken, setJwtToken] = useState(null);

  /* { load from localStorage } ------------------------------------------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setJwtToken(token);
    }
  }, []);
  /* { load from localStorage } ------------------------------------------------------------------ */

  return (
    <DataContext.Provider value={{ jwtToken, setJwtToken }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContainer;
