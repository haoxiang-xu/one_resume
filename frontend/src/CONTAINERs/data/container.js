import { useEffect, useState } from "react";

/* Contexts -------------------------------------------------------------------------------------------------------------- */
import { DataContext } from "./context";
/* Contexts -------------------------------------------------------------------------------------------------------------- */

const DataContainer = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, user: null });
  const [userInfo, setUserInfo] = useState(null);

  return (
    <DataContext.Provider value={{ authState, setAuthState, userInfo, setUserInfo }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContainer;
