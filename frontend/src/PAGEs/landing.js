import Logo from "../COMPONENTs/logo/logo";
import TopMenu from "../COMPONENTs/top_menu/top_menu";
import ClosedStringSpinner from "../BUILTIN_COMPONENTs/spinner/string_spinner";

const Landing = () => {
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
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "Jost",
          fontSize: "40px",
        }}
      >
        Landing Page in Construction...
      </span>
      <ClosedStringSpinner n={5} />
      <TopMenu items={["light switch", "sign up", "login"]} /> <Logo />
    </div>
  );
};

export default Landing;
