import AuthForm from "../COMPONENTs/auth_form/auth_form";
import Logo from "../COMPONENTs/logo/logo";
import TopMenu from "../COMPONENTs/top_menu/top_menu";
import Footer from "../COMPONENTs/footer/footer";

const Auth = () => {
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
      }}
    >
      <AuthForm />
      <TopMenu items={["light switch", "sign up"]} /> <Logo /> <Footer onPage={"auth"}/>
    </div>
  );
};

export default Auth;
