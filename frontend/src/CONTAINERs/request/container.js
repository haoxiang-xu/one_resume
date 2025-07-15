import { useState, createContext } from "react";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const RequestContext = createContext();

const root_url = "http://localhost:8888/";

const AuthAlert = ({ open, vertical, horizontal, type, message, setState }) => {
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

  return (
    <RequestContext.Provider
      value={{
        alert,
        register,
      }}
    >
      {children}
      <AuthAlert
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
