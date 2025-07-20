import { useState, useRef, createContext, useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import RegisterForm from "../COMPONENTs/register_form/register_form";
import Logo from "../COMPONENTs/logo/logo";
import TopMenu from "../COMPONENTs/top_menu/top_menu";
import Footer from "../COMPONENTs/footer/footer";

const FormPageContext = createContext();

const Register = () => {
  const { theme } = useContext(ConfigContext);
  const formRef = useRef(null);
  const [onForm, setOnForm] = useState("name");

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
          <RegisterForm onForm={onForm} setOnForm={setOnForm} />
        </div>
        <TopMenu items={["light switch", "login"]} /> <Logo format={"stroke"} />{" "}
        {onForm === "user" ? <Footer onPage={"register"} /> : null}
      </div>
    </FormPageContext.Provider>
  );
};

export { FormPageContext };
export default Register;
