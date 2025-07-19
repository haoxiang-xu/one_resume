import { useState, createContext, useContext } from "react";

/* Contexts -------------------------------------------------------------------------------------------------------------- */
import { DataContext } from "../data/context";
/* Contexts -------------------------------------------------------------------------------------------------------------- */

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const RequestContext = createContext();

const root_url = "http://localhost:8888/";

const RequestAlert = ({
  open,
  vertical,
  horizontal,
  type,
  message,
  setState,
}) => {
  const handleClose = () => {
    setState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      key={vertical + horizontal}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%", fontFamily: "Jost", color: "#FFFFFF" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
const RequestContainer = ({ children }) => {
  const { setJwtToken } = useContext(DataContext);
  const [alertState, setAlertState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: "error",
    message: "",
  });

  const alert = (type, message) => {
    setAlertState({
      open: true,
      vertical: "top",
      horizontal: "center",
      type: type,
      message: message,
    });
  };
  const register = async (data) => {
    try {
      const response = await fetch(`${root_url}api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          "error",
          result.message || "registration failed due to server error"
        );
        return null;
      }
      alert("success", "Registration successful!");
      return result;
    } catch (err) {
      alert("error", "registration failed due to network error");
      return null;
    }
  };
  const auth = async (data) => {
    try {
      const { email, password } = data;
      const response = await fetch(`${root_url}api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert("error", result.message || "Login failed due to server error");
        return;
      }
      const token = result.token;
      setJwtToken(token);
      alert("success", "Login successful!");
    } catch (err) {
      alert("error", "Login failed due to network error");
      return;
    }
  };

  const auth_oauth = async (provider, data) => {
    try {
      const response = await fetch(`${root_url}api/auth/oauth/${provider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert("error", result.message || `${provider} login failed due to server error`);
        return;
      }
      const token = result.token;
      setJwtToken(token);
      alert("success", `${provider} login successful!`);
    } catch (err) {
      alert("error", `${provider} login failed due to network error`);
      return;
    }
  };
  const forgot_password = async (onStep, data) => {
    if (onStep === "input email") {
      try {
        const response = await fetch(
          `${root_url}api/auth/forgot_password/send_validation_code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: data }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          alert(
            "error",
            result.message ||
              "Failed to send validation code due to server error"
          );
          result.status = "error";
          return result;
        }
        alert("success", "Validation code sent to your email!");
        result.status = "success";
        return result;
      } catch (err) {
        alert("error", "Failed to send validation code due to network error");
      }
    } else if (onStep === "input code") {
      try {
        const response = await fetch(
          `${root_url}api/auth/forgot_password/validate_code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          alert(
            "error",
            result.message || "Failed to validate code due to server error"
          );
          result.status = "error";
          return result;
        }
        result.status = "success";
        return result;
      } catch (err) {
        alert("error", "Failed to validate code due to network error");
      }
    } else if (onStep === "reset password") {
      try {
        const response = await fetch(
          `${root_url}api/auth/forgot_password/reset_password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          alert(
            "error",
            result.message || "Failed to reset password due to server error"
          );
          result.status = "error";
          return result;
        }
        alert("success", "Password reset successful!");
        result.status = "success";
        return result;
      } catch (err) {
        alert("error", "Failed to reset password due to network error");
      }
    }
  };

  return (
    <RequestContext.Provider
      value={{
        alert,
        register,
        auth,
        auth_oauth,
        forgot_password,
      }}
    >
      {children}
      <RequestAlert
        open={alertState.open}
        vertical={alertState.vertical}
        horizontal={alertState.horizontal}
        type={alertState.type}
        message={alertState.message}
        setState={setAlertState}
      />
    </RequestContext.Provider>
  );
};

export { RequestContext, RequestContainer };
export default RequestContainer;
