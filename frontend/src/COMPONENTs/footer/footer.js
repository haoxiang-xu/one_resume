import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const AuthFooter = () => {
  const { theme } = useContext(ConfigContext);
  return (
    <span
      style={{
        fontFamily: "Jost",
        textAlign: "center",
        fontSize: "14px",
        color: theme?.font.color || "#000000",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      By loging in, you agree to our{" "}
      <span
        style={{
          color: "#1976d2",
          cursor: "pointer",
          textDecoration: "underline",
          fontWeight: 500,
        }}
        onClick={() => {
          alert("terms of service clicked!");
        }}
      >
        Terms of Service
      </span>{" "}
      and{" "}
      <span
        style={{
          color: "#1976d2",
          cursor: "pointer",
          textDecoration: "underline",
          fontWeight: 500,
        }}
        onClick={() => {
          alert("privacy policy clicked!");
        }}
      >
        Privacy Policy
      </span>
    </span>
  );
};
const RegisterFooter = () => {
  const { theme } = useContext(ConfigContext);
  return (
    <span
      style={{
        fontFamily: "Jost",
        textAlign: "center",
        fontSize: "14px",
        color: theme?.font.color || "#000000",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      By registering, you agree to our{" "}
      <span
        style={{
          color: "#1976d2",
          cursor: "pointer",
          textDecoration: "underline",
          fontWeight: 500,
        }}
        onClick={() => {
          alert("terms of service clicked!");
        }}
      >
        Terms of Service
      </span>{" "}
      and{" "}
      <span
        style={{
          color: "#1976d2",
          cursor: "pointer",
          textDecoration: "underline",
          fontWeight: 500,
        }}
        onClick={() => {
          alert("privacy policy clicked!");
        }}
      >
        Privacy Policy
      </span>
    </span>
  );
};
const Footer = ({ onPage }) => {
  const { theme } = useContext(ConfigContext);
  return (
    <div
      className="footer"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {onPage === "auth" ? <AuthFooter /> : null}
      {onPage === "register" ? <RegisterFooter /> : null}
    </div>
  );
};

export default Footer;
