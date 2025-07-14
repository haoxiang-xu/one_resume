import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Containers -------------------------------------------------------------------------------------------------------------- */
import DataContainer from "./CONTAINERs/data/container";
import RequestContainer from "./CONTAINERs/request/container";
import ConfigContainer from "./CONTAINERs/config/container";
/* Containers -------------------------------------------------------------------------------------------------------------- */

/* Pages ------------------------------------------------------------------------------------------------------------------- */
import Main from "./PAGEs/main";
import Register from "./PAGEs/register";
/* Pages ------------------------------------------------------------------------------------------------------------------- */

const App = () => {
  return (
    <ConfigContainer>
      <RequestContainer>
        <DataContainer>
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/form" element={<Register />} />
            </Routes>
          </Router>
        </DataContainer>
      </RequestContainer>
    </ConfigContainer>
  );
};

export default App;
