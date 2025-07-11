import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { LightSwitch } from "../../BUILTIN_COMPONENTs/switch/switch";

const LeftCorner = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  return (
    <div
      className="logo-text"
      style={{
        position: "absolute",
        top: 6,
        left: 6,
        width: 80,
        height: 90,
        
      }}
    >
      <span
        style={{
          transition: "all 0.2s ease-in-out",
          position: "absolute ",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 0,
          fontSize: "37px",
          lineHeight: "37px",
          color: theme?.font?.color || "rgb(36, 36, 36)",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        ONE
      </span>
      <span
        style={{
          transition: "all 0.2s ease-in-out",
          position: "absolute ",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 32,
          fontSize: "22px",
          lineHeight: "20px",
          color: theme?.font?.color || "rgb(36, 36, 36)",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        resume
      </span>
      <LightSwitch
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 54,
          width: 77,
          height: 32,

          backgroundColor_on: "#CCCCCC",
          backgroundColor: "#44464a",
          color: onThemeMode === "dark_mode" ? "#21252b" : "rgb(255, 255, 255)",
          boxShadow_on: "none",
          boxShadow: "none",
        }}
      />
    </div>
  );
};

export default LeftCorner;
