import { useContext } from "react";

import Header from "../COMPONENTs/header/header";
import Logo from "../COMPONENTs/logo/logo";
import DraftResumeForm from "../COMPONENTs/draft_resume_form/draft_resume_form";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const Resume = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);

  return (
    <div
      id="resume-page"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "hidden",
        backgroundColor:
          onThemeMode === "light_mode" ? "#F4F4F4" : theme?.backgroundColor,
      }}
    >
      <div
        className="scrolling-space-v"
        style={{
          position: "absolute",
          top: 0,
          left: 3,
          width: "calc(100% - 6px)",
          height: "100%",
          overflowX: "hidden",
          overflowY: "scroll",
        }}
      >
        <DraftResumeForm />
      </div>
      <Header items={["light switch", "user"]} /> <Logo format={"stroke"} />
    </div>
  );
};

export default Resume;
