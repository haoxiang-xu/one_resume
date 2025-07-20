import React from "react";

import TopMenu from "../COMPONENTs/top_menu/top_menu";
import Logo from "../COMPONENTs/logo/logo";
import FormStepper from "../COMPONENTs/resume_form/resume_form";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const Resume = () => {
  const { theme, onThemeMode } = React.useContext(ConfigContext);
  return (
    <div
      className="resume-page"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: onThemeMode === "light_mode" ? "#F4F4F4" : theme?.backgroundColor,
      }}
    >
      <FormStepper />
      <TopMenu items={["light switch", "user"]} /> <Logo format={"stroke"} />
    </div>
  );
};

export default Resume;
