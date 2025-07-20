import { useState, createContext, useContext, useCallback } from "react";

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
  const { jwtToken, setJwtToken, userId, setUserId } = useContext(DataContext);
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
      const id = result.user_id;

      setJwtToken(token);
      localStorage.setItem("jwtToken", token);
      setUserId(id);
      localStorage.setItem("userId", id);
      alert("success", "Login successful!");
    } catch (err) {
      alert("error", "Login failed due to network error");
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
  const get_user_info = useCallback(async () => {
    const token = jwtToken || localStorage.getItem("jwtToken");
    const id = userId || localStorage.getItem("userId");
    if (!token) {
      throw new Error("No auth token found – please log in again.");
    }
    if (!id) {
      throw new Error("No user ID found – please log in again.");
    }

    const res = await fetch(`${root_url}api/user/get_user_info/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(payload.message || "Unknown server error");
    }

    return payload;
  }, [jwtToken, userId]);

  return (
    <RequestContext.Provider
      value={{
        alert,
        register,
        auth,
        forgot_password,
        get_user_info,
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
