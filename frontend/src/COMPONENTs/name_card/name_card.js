import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const NameCard = () => {
  const { theme } = useContext(ConfigContext);
  return (
    <div
      className="scrolling-space-v"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "scroll",
        backgroundColor: theme ? theme.foregroundColor : "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 0px 8px rgba(0, 0, 0, 0.16)",
      }}
    ></div>
  );
};

export default NameCard;
