import { useContext, useRef, createContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import ApplicantInfoForm from "../COMPONENTs/applicant_info_form/applicant_info_form";
import LeftCorner from "../COMPONENTs/left_corner/left_corner";

const FormPageContext = createContext();

const Form = () => {
  const { theme } = useContext(ConfigContext);
  const formRef = useRef(null);

  const scroll_to_bottom = () => {
    setTimeout(() => {
      formRef.current.scrollTo({
        top: formRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 240);
  };

  return (
    <FormPageContext.Provider value={{ scroll_to_bottom }}>
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
          ref={formRef}
          className="scrolling-space-v"
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            overflowX: "hidden",
            overflowY: "scroll",
          }}
        >
          <ApplicantInfoForm />
          <LeftCorner />
        </div>
      </div>
    </FormPageContext.Provider>
  );
};

export { FormPageContext };
export default Form;
