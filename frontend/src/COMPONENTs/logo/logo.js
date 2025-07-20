import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import logo_white_outline from "../../assets/logos/logo_192_white_outline.png";
import logo_black_outline from "../../assets/logos/logo_192_black_outline.png";
import logo_white_stroke from "../../assets/logos/logo_64_white_stroke.png";
import logo_black_stroke from "../../assets/logos/logo_64_black_stroke.png";

const Logo = ({ format = "colored" }) => {
  const { onThemeMode } = useContext(ConfigContext);
  const [navigateTo, setNavigateTo] = useState(null);

  return (
    <div
      className="logo"
      style={{
        position: "fixed",
        top: format === "colored" ? 4 : 16,
        left: 2,
        width: format === "colored" ? 50 : 50,
        height: 50,
        cursor: "pointer",
      }}
    >
      <img
        src={
          format === "colored"
            ? onThemeMode === "dark_mode"
              ? logo_white_outline
              : logo_black_outline
            : onThemeMode === "dark_mode"
            ? logo_white_stroke
            : logo_black_stroke
        }
        alt="one-resume-logo"
        draggable="false"
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 0,
          width: format === "colored" ? 50 : 26,

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

export default Logo;
