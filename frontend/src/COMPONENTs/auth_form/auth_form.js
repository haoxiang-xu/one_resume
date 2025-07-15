import { useEffect, useState, useContext, createContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { RequestContext } from "../../CONTAINERs/request/container";
import { ConfigContext } from "../../CONTAINERs/config/context";
import { FormPageContext } from "../../PAGEs/register";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import Footer from "../footer/footer";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AuthFormContext = createContext();

const UserFrom = () => {
  const { theme } = useContext(ConfigContext);
  const { formData, update_email, update_password } =
    useContext(AuthFormContext);
  const [style, setStyle] = useState({
    marginTop: "36px",
    opacity: 0,
    height: 0,
  });
  const [errors, setErrors] = useState({
    email: { status: false, msg: "" },
    password: { status: false, msg: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const toggle_password_visibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    setTimeout(() => {
      setStyle({
        marginTop: "0px",
        padding: "16px",
        opacity: 1,
        height: "auto",
      });
    }, 50);
  }, []);

  return (
    <div
      className="user-form"
      style={{
        transition: "margin-top 0.2s ease, opacity 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        width: "400px",
        height: style.height,
        marginTop: style.marginTop,
        opacity: style.opacity,
      }}
    >
      <span
        style={{
          fontFamily: "Jost",
          textAlign: "center",
          fontSize: "36px",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        Wellcome back!
      </span>
      <TextField
        required
        error={errors.email.status}
        helperText={errors.email.msg}
        id="email-input"
        label="Email"
        variant="outlined"
        value={formData.email}
        onChange={(e) => {
          update_email(e.target.value);
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
          "& label": {
            fontFamily: "Jost",
          },
          "& input": {
            fontFamily: "Jost",
          },
        }}
      />
      <TextField
        required
        error={errors.password.status}
        helperText={errors.password.msg}
        type={showPassword ? "text" : "password"}
        id="last-name-input"
        label="Password"
        variant="outlined"
        value={formData.password}
        onChange={(e) => {
          update_password(e.target.value);
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
          "& label": {
            fontFamily: "Jost",
          },
          "& input": {
            fontFamily: "Jost",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggle_password_visibility} edge="end">
                {showPassword ? (
                  <Icon
                    src="eye_closed"
                    style={{
                      height: 24,
                      width: 24,
                      opacity: 0.36,
                    }}
                  />
                ) : (
                  <Icon
                    src="eye_open"
                    style={{
                      height: 24,
                      width: 24,
                      opacity: 0.36,
                    }}
                  />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <span
        style={{
          fontFamily: "Jost",
          textAlign: "center",
          fontSize: "16px",
          color: theme?.font.color || "#000000",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        Don't have an account?{" "}
        <span
          style={{
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: 500,
          }}
          onClick={() => {
            alert("sign up clicked!");
          }}
        >
          Sign up
        </span>
      </span>
      <span
        style={{
          fontFamily: "Jost",
          textAlign: "center",
          fontSize: "16px",
          color: theme?.font.color || "#000000",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <span
          style={{
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: 500,
          }}
          onClick={() => {
            alert("Forgot password clicked!");
          }}
        >
          Forgot password?
        </span>
      </span>
      <Button
        variant="text"
        color="primary"
        sx={{
          marginLeft: "auto",
          width: 90,
          borderRadius: "10px",
          fontFamily: "Jost",
          fontSize: "16px",
          textTransform: "none",
        }}
        endIcon={
          <Icon
            src="arrow_right"
            style={{
              width: 24,
              height: 24,
            }}
          />
        }
        onClick={() => {
          if (!formData.email || !formData.password) {
            if (!formData.email) {
              setErrors((prev) => ({
                ...prev,
                email: { status: true, msg: "Email is required" },
              }));
            }
            if (!formData.password) {
              setErrors((prev) => ({
                ...prev,
                password: { status: true, msg: "Password is required" },
              }));
            }
            return;
          }
        }}
      >
        login
      </Button>
    </div>
  );
};
const AuthForm = () => {
  const { theme, windowSize } = useContext(ConfigContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const update_email = (email) => {
    setFormData((prev) => ({
      ...prev,
      email: email,
    }));
  };
  const update_password = (password) => {
    setFormData((prev) => ({
      ...prev,
      password: password,
    }));
  };

  return (
    <AuthFormContext.Provider
      value={{
        formData,
        update_email,
        update_password,
      }}
    >
      <div
        className="auth-form"
        style={{
          position: "absolute",
          top: windowSize.height / 2 - 200,
          left: "50%",
          transform: "translate(-50%, 0%)",
        }}
      >
        <UserFrom />
      </div>
      <Footer />
    </AuthFormContext.Provider>
  );
};

export default AuthForm;
