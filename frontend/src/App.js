import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Containers -------------------------------------------------------------------------------------------------------------- */
import DataContainer from "./CONTAINERs/data/container";
import ConfigContainer from "./CONTAINERs/config/container";
/* Containers -------------------------------------------------------------------------------------------------------------- */

/* Pages ------------------------------------------------------------------------------------------------------------------- */
import Main from "./PAGEs/main";
import Form from "./PAGEs/form";
/* Pages ------------------------------------------------------------------------------------------------------------------- */

const App = () => {
  return (
    <ConfigContainer>
      <DataContainer>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/form" element={<Form />} />
          </Routes>
        </Router>
      </DataContainer>
    </ConfigContainer>
  );
};

export default App;
