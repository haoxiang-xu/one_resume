import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import ApplicantInfoForm from "../COMPONENTs/applicant_info_form/applicant_info_form";
import LeftCorner from "../COMPONENTs/left_corner/left_corner";

const Main = () => {
  const { theme } = useContext(ConfigContext);

  return (
    <div
      className="main-page"
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
      <ApplicantInfoForm />
      <LeftCorner />
    </div>
  );
};

export default Main;
