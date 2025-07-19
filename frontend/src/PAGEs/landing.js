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
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50px",
          height: "50px",
        }}
      >
        <ClosedStringSpinner size={36} />
      </div>
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
      <TopMenu items={["light switch", "sign up", "login"]} />
      <Logo style={"stroke"} />
    </div>
  );
};

export default Landing;
