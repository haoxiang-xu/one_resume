import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { LightSwitch } from "../../BUILTIN_COMPONENTs/switch/switch";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

const LeftCorner = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  return (
    <div
      className="left-corner"
      style={{
        position: "fixed",
        top: 6,
        left: 6,
        width: 75,
        height: 90,
      }}
    >
      <Icon
        src={`one_resume_logo`}
        color={onThemeMode === "dark_mode" ? "#44464a" : "#CCCCCC"}
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 0,
          width: 73,
          height: 73,

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      />
      <LightSwitch
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 54,
          width: 70,
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
