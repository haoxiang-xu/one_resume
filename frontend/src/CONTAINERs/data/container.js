/* Contexts -------------------------------------------------------------------------------------------------------------- */
import { DataContext } from "./context";
/* Contexts -------------------------------------------------------------------------------------------------------------- */

const DataContainer = ({ children }) => {
  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};

export default DataContainer;
