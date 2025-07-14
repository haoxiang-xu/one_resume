import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { LightSwitch } from "../../BUILTIN_COMPONENTs/switch/switch";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import logo_light from "./logo_light.png";
import logo_dark from "./logo_dark.png";

const LeftCorner = () => {
  const { onThemeMode } = useContext(ConfigContext);
  return (
    <div
      className="left-corner"
      style={{
        position: "fixed",
        top: 6,
        left: 0,
        width: 60,
        height: 60,
      }}
    >
      <img
        src={onThemeMode === "dark_mode" ? logo_light : logo_dark}
        alt="one-resume-logo"
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 0,
          width: 60,
          pointerEvents: "none",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      />
      {/* <LightSwitch
        style={{
          position: "absolute",
          transform: "translate(-50%, 0%)",
          left: "50%",
          top: 100,
          width: 70,
          height: 32,

          backgroundColor_on: "#CCCCCC",
          backgroundColor: "#44464a",
          color: onThemeMode === "dark_mode" ? "#21252b" : "rgb(255, 255, 255)",
          boxShadow_on: "none",
          boxShadow: "none",
        }}
      /> */}
    </div>
  );
};

export default LeftCorner;
