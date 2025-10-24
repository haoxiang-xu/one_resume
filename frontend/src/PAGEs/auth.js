import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import AuthForm from "../COMPONENTs/auth_form/auth_form";
import Logo from "../COMPONENTs/logo/logo";
import Header from "../COMPONENTs/header/header";
import Footer from "../COMPONENTs/footer/footer";

const Auth = () => {
  const { theme } = useContext(ConfigContext);
  return (
    <div
      id="auth-page"
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
      <AuthForm />
      <Header items={["light switch", "sign up"]} /> <Logo format={"stroke"} />{" "}
      <Footer onPage={"auth"} />
    </div>
  );
};

export default Auth;
