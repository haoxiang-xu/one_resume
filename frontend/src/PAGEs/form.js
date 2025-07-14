import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import ApplicantInfoForm from "../COMPONENTs/applicant_info_form/applicant_info_form";
import LeftCorner from "../COMPONENTs/left_corner/left_corner";

const Form = () => {
  const { theme } = useContext(ConfigContext);

  return (
    <div
      id="form-page"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: theme?.backgroundColor || "#FFFFFF",
      }}
    >
      <div
        className="scrolling-space-v"
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          right: 4,
          bottom: 4,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <ApplicantInfoForm />
        <LeftCorner />
      </div>
    </div>
  );
};

export default Form;
