import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { LightSwitch } from "../../BUILTIN_COMPONENTs/switch/switch";

const LogoText = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  return (
    <div
      className="logo-text"
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        width: 64,
        height: 64,
      }}
    >
      <span
        style={{
          transition: "all 0.2s ease-in-out",
          position: "absolute ",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 0,
          fontSize: "34px",
          lineHeight: "34px",
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
          fontSize: "20px",
          lineHeight: "20px",
          color: theme?.font?.color || "rgb(36, 36, 36)",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        Resume
      </span>
      <LightSwitch
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 57,
          width: 68,
          height: 32,

          backgroundColor_on: "rgb(29, 29, 29)",
          backgroundColor: "rgb(200, 200, 200)",
          color: onThemeMode === "dark_mode" ? "#21252b" : "rgb(255, 255, 255)",
          boxShadow_on: "none",
          boxShadow: "none",
        }}
      />
    </div>
  );
};

export default LogoText;
