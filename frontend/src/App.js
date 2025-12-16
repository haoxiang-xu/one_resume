import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Containers -------------------------------------------------------------------------------------------------------------- */
import DataContainer from "./CONTAINERs/data/container";
import RequestContainer from "./CONTAINERs/request/container";
import ConfigContainer from "./CONTAINERs/config/container";
/* Containers -------------------------------------------------------------------------------------------------------------- */

/* Pages ------------------------------------------------------------------------------------------------------------------- */
import Landing from "./PAGEs/landing";
import Register from "./PAGEs/register";
import Auth from "./PAGEs/auth";
import Resume from "./PAGEs/resume";
import PlaywrightDemo from "./DEMOs/playwright";
/* Pages ------------------------------------------------------------------------------------------------------------------- */

const App = () => {
  return (
    <ConfigContainer>
      <DataContainer>
        <RequestContainer>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/demo/playwright" element={<PlaywrightDemo />} />
            </Routes>
          </Router>
        </RequestContainer>
      </DataContainer>
    </ConfigContainer>
  );
};

export default App;
