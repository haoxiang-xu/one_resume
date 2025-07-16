import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import Logo from "../COMPONENTs/logo/logo";
import TopMenu from "../COMPONENTs/top_menu/top_menu";

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
        // backgroundColor: theme?.backgroundColor || "#FFFFFF",
      }}
    >
      <TopMenu items={["light switch", "sign up", "login"]} /> <Logo />
    </div>
  );
};

export default Landing;
