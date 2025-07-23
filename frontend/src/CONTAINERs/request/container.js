import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";

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
  const { setAuthState } = useContext(DataContext);
  const [alertState, setAlertState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: "error",
    message: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${root_url}api/auth/user`, {
          credentials: "include",
        });
        if (!res.ok) {
          setAuthState({ loading: false, user: null });
          return;
        }
        const user = await res.json();
        setAuthState({ loading: false, user });
      } catch {
        setAuthState({ loading: false, user: null });
      }
    })();
  }, [root_url]);

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
  const auth = async (data, option = "default") => {
    if (option === "default") {
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
        alert("success", "Login successful!");
      } catch (err) {
        alert("error", "Login failed due to network error");
        return;
      }
    } else if (option === "google") {
      try {
        // 向 Flask 发 GET 请求，拿到授权链接
        const resp = await fetch(`${root_url}api/auth/google/login`);
        if (!resp.ok) throw new Error("Failed to get authorization URL");

        const { authorization_url } = await resp.json();

        // 跳转到 Google 的授权页（也可以用 window.open 开新窗口）
        window.location.href = authorization_url;
        // window.open(authorization_url, '_self');
      } catch (err) {
        console.error(err);
        alert("Login failed, please try again later.");
      }
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
  const get_user_info = async () => {
    const res = await fetch(`${root_url}api/user/get_user_info`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(payload.message || "Unknown server error");
    }

    return payload;
  };

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
