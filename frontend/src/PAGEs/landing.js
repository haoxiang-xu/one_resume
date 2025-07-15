import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import Logo from "../COMPONENTs/logo/logo";

const Landing = () => {
  const { theme } = useContext(ConfigContext);
  return (
    <div
      className="landing-page"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: theme?.backgroundColor || "#FFFFFF",
      }}
    >
      <Logo />
    </div>
  );
};

export default Landing;
