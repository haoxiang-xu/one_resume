import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import logo_white_outline from "../../assets/logo_192_white_outline.png";
import logo_black_outline from "../../assets/logo_192_black_outline.png";

const LeftCorner = () => {
  const { onThemeMode } = useContext(ConfigContext);
  const [navigateTo, setNavigateTo] = useState(null);

  return (
    <div
      className="left-corner"
      style={{
        position: "fixed",
        top: 4,
        left: 2,
        width: 50,
        height: 50,
      }}
    >
      <img
        src={
          onThemeMode === "dark_mode" ? logo_white_outline : logo_black_outline
        }
        alt="one-resume-logo"
        draggable="false"
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 0,
          width: 50,

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        onClick={() => {
          setNavigateTo("/");
        }}
      />
      {navigateTo && <Navigate to={navigateTo} />}
    </div>
  );
};

export default LeftCorner;
