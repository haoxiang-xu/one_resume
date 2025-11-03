import { useContext, useRef, useState, useEffect } from "react";

import Header from "../COMPONENTs/header/header";
import Logo from "../COMPONENTs/logo/logo";
import DraftResumeForm from "../COMPONENTs/draft_resume_form/draft_resume_form";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const Resume = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const pageRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerStyle, setHeaderStyle] = useState({});

  const handleScroll = () => {
    if (pageRef.current) {
      setScrollPosition(pageRef.current.scrollTop);
    }
  };

  useEffect(() => {
    if (scrollPosition > 50) {
      setHeaderStyle({
        height: "100%",
        backdropFilter: "saturate(180%) blur(36px)",
        borderBottom:
          onThemeMode === "light_mode"
            ? "1px solid rgba(0, 0, 0, 0.16)"
            : "1px solid rgba(255, 255, 255, 0.16)",
        boxShadow:
          onThemeMode === "light_mode"
            ? "0 8px 32px 0 rgba(18, 18, 18, 0.1)"
            : "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        backgroundColor:
          onThemeMode === "light_mode"
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(18, 18, 18, 0.9)",
        transition: "all 0.32s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
      });
    } else {
      setHeaderStyle({
        height: "0%",
        backdropFilter: "none",
        backgroundColor: "transparent",
        transition: "all 0.32s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
      });
    }
  }, [onThemeMode, scrollPosition]);

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
        ref={pageRef}
        style={{
          position: "absolute",
          top: 0,
          left: 3,
          width: "calc(100% - 6px)",
          height: "100%",
          overflowX: "hidden",
          overflowY: "scroll",
        }}
        onScroll={handleScroll}
      >
        <DraftResumeForm />
      </div>
      <Header items={["light switch", "user"]} style={headerStyle} />
      <Logo format={"stroke"} />
    </div>
  );
};

export default Resume;
