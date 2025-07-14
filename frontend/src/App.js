import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Containers -------------------------------------------------------------------------------------------------------------- */
import DataContainer from "./CONTAINERs/data/container";
import ConfigContainer from "./CONTAINERs/config/container";
/* Containers -------------------------------------------------------------------------------------------------------------- */

/* Pages ------------------------------------------------------------------------------------------------------------------- */
import Main from "./PAGEs/main";
import Register from "./PAGEs/register";
/* Pages ------------------------------------------------------------------------------------------------------------------- */

const App = () => {
  return (
    <ConfigContainer>
      <DataContainer>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/form" element={<Register />} />
          </Routes>
        </Router>
      </DataContainer>
    </ConfigContainer>
  );
};

export default App;
