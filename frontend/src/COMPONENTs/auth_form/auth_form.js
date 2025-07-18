import {
  Fragment,
  useEffect,
  useState,
  useContext,
  createContext,
  useRef,
  useCallback,
  use,
} from "react";
import { Navigate } from "react-router-dom";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { RequestContext } from "../../CONTAINERs/request/container";
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OTPInput from "react-otp-input";

const AuthFormContext = createContext();

const ForgotPasswordDialog = ({
  resetPasswordOnStep,
  setResetPasswordOnStep,
}) => {
  const { forgot_password } = useContext(RequestContext);
  const { theme, DialogTransition } = useContext(ConfigContext);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const passwordRef = useRef(null);
  const [password, setPassword] = useState("");
  const confirmPasswordRef = useRef(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: { status: false, msg: "" },
    password: { status: false, msg: "" },
    confirm_password: { status: false, msg: "" },
    otp: { status: false, msg: "" },
  });

  const handle_dialog_open = () => {
    setOpen(true);
  };
  const handle_dialog_close = () => {
    setOpen(false);
  };
  const toggle_password_visibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handle_submit = useCallback(() => {
    if (resetPasswordOnStep === "input email") {
      if (!email) {
        setErrors((prev) => ({
          ...prev,
          email: { status: true, msg: "Email is required" },
        }));
        return;
      }
      forgot_password("input email", email)
        .then((res) => {
          if (res && res.status === "success") {
            if (resetPasswordOnStep === "input email") {
              setResetPasswordOnStep("input code");
            } else if (resetPasswordOnStep === "input code") {
              setResetPasswordOnStep("reset password");
            } else {
              handle_dialog_close();
            }
          } else {
            setErrors((prev) => ({
              ...prev,
              email: {
                status: true,
                msg: res?.message || "An error occurred.",
              },
            }));
          }
        })
        .catch((err) => {
          setErrors((prev) => {
            return {
              ...prev,
              email: {
                status: true,
                msg: err?.message || "An error occurred.",
              },
            };
          });
        });
    } else if (resetPasswordOnStep === "input code") {
      if (!otp) {
        setErrors((prev) => ({
          ...prev,
          otp: { status: true, msg: "OTP is required" },
        }));
        return;
      }
      forgot_password("input code", { email: email, code: otp })
        .then((res) => {
          if (res && res.status === "success") {
            setResetPasswordOnStep("reset password");
          } else {
            setOtp("");
            setErrors((prev) => ({
              ...prev,
              otp: {
                status: true,
                msg: res?.message || "An error occurred.",
              },
            }));
          }
        })
        .catch((err) => {
          setErrors((prev) => ({
            ...prev,
            otp: {
              status: true,
              msg: err?.message || "An error occurred.",
            },
          }));
        });
    } else {
      if (!password) {
        setErrors((prev) => ({
          ...prev,
          password: { status: true, msg: "Password is required" },
        }));
        return;
      }
      if (password !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirm_password: {
            status: true,
            msg: "Passwords do not match",
          },
        }));
        return;
      }
      forgot_password("reset password", {
        email: email,
        code: otp,
        new_password: password,
      })
        .then((res) => {
          if (res && res.status === "success") {
            handle_dialog_close();
          } else {
            setErrors((prev) => ({
              ...prev,
              password: {
                status: true,
                msg: res?.message || "An error occurred.",
              },
            }));
          }
        })
        .catch((err) => {
          setErrors((prev) => ({
            ...prev,
            password: {
              status: true,
              msg: err?.message || "An error occurred.",
            },
          }));
        });
    }
  }, [
    resetPasswordOnStep,
    email,
    otp,
    setOtp,
    password,
    confirmPassword,
    forgot_password,
    setResetPasswordOnStep,
  ]);

  return (
    <Fragment>
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
            handle_dialog_open();
          }}
        >
          Forgot password?
        </span>
      </span>
      <Dialog
        open={open}
        onClose={handle_dialog_close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slots={{
          transition: DialogTransition,
        }}
        PaperProps={{
          sx: {
            width: "500px",
            borderRadius: "14px",
            backgroundColor: theme?.backgroundColor || "#FFFFFF",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontFamily: "Jost",
            fontSize: "24px",
            fontWeight: 500,
            color: theme?.font.color || "#000000",
          }}
        >
          {"Forgot password?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              fontFamily: "Jost",
              fontSize: "16px",
              color: theme?.font.color || "#000000",
            }}
          >
            {resetPasswordOnStep === "input email"
              ? "Enter your email and we'll send you a validation code to reset your password."
              : resetPasswordOnStep === "input code"
              ? "Enter the validation code sent to your email to reset your password."
              : "Enter your new password to reset your password."}
          </DialogContentText>
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {resetPasswordOnStep === "input email" ? (
              <TextField
                required
                error={errors.email.status}
                helperText={errors.email.msg}
                id="email-input"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: { status: true, msg: "Email is required" },
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        email: { status: false, msg: "" },
                      }));
                      handle_submit();
                    }
                    return;
                  }
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
            ) : resetPasswordOnStep === "input code" ? (
              <OTPInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                }}
                numInputs={6}
                shouldAutoFocus
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: 48,
                      height: 50,
                      margin: 4,
                      fontSize: 24,
                      borderRadius: 8,
                      border: "1px solid #bbb",
                      backgroundColor: "transparent",
                      color: theme?.font.color || "#000000",
                      textAlign: "center",
                      fontFamily: "Jost",
                      overflow: "hidden",
                    }}
                  />
                )}
              />
            ) : (
              <>
                <TextField
                  inputRef={passwordRef}
                  required
                  error={errors.password.status}
                  helperText={errors.password.msg}
                  type={showPassword ? "text" : "password"}
                  id="password-input"
                  label="New Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!password) {
                        setErrors((prev) => ({
                          ...prev,
                          password: {
                            status: true,
                            msg: "Password is required",
                          },
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          password: { status: false, msg: "" },
                        }));
                        if (!confirmPassword) {
                          confirmPasswordRef.current.focus();
                        } else {
                          handle_submit();
                        }
                      }
                      return;
                    }
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      confirmPasswordRef.current.focus();
                    }
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
                        <IconButton
                          onClick={toggle_password_visibility}
                          edge="end"
                        >
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
                <TextField
                  inputRef={confirmPasswordRef}
                  required
                  error={errors.confirm_password.status}
                  helperText={errors.confirm_password.msg}
                  type={showPassword ? "text" : "password"}
                  id="confirm-password-input"
                  label="Enter Password Again"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!confirmPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          password: {
                            status: true,
                            msg: "Password is required",
                          },
                        }));
                      } else if (!password) {
                        setErrors((prev) => ({
                          ...prev,
                          confirm_password: {
                            status: true,
                            msg: "Password is required",
                          },
                        }));
                      } else if (confirmPassword !== password) {
                        setErrors((prev) => ({
                          ...prev,
                          confirm_password: {
                            status: true,
                            msg: "Passwords do not match",
                          },
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          password: { status: false, msg: "" },
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          confirm_password: { status: false, msg: "" },
                        }));
                        handle_submit();
                      }
                      return;
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      passwordRef.current.focus();
                    }
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
                        <IconButton
                          onClick={toggle_password_visibility}
                          edge="end"
                        >
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
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="default"
            onClick={() => {
              handle_dialog_close();
            }}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontFamily: "Jost",
            }}
          >
            cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              handle_submit();
            }}
            autoFocus
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontFamily: "Jost",
            }}
          >
            {resetPasswordOnStep === "input email"
              ? "send email"
              : resetPasswordOnStep === "input code"
              ? "verify code"
              : "reset password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
const UserFrom = () => {
  const { theme } = useContext(ConfigContext);
  const { auth } = useContext(RequestContext);
  const { formData, update_email, update_password } =
    useContext(AuthFormContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [resetPasswordOnStep, setResetPasswordOnStep] = useState("input email");
  const [navigateTo, setNavigateTo] = useState(null);
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
        inputRef={emailRef}
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!formData.email || !formData.password) {
              if (!formData.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: { status: true, msg: "Email is required" },
                }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  email: { status: false, msg: "" },
                }));
              }
              if (!formData.password) {
                passwordRef.current.focus();
              } else {
                setErrors((prev) => ({
                  ...prev,
                  password: { status: false, msg: "" },
                }));
              }
              return;
            }
            auth(formData);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            passwordRef.current.focus();
          }
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
        inputRef={passwordRef}
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!formData.email || !formData.password) {
              if (!formData.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: { status: true, msg: "Email is required" },
                }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  email: { status: false, msg: "" },
                }));
              }
              if (!formData.password) {
                setErrors((prev) => ({
                  ...prev,
                  password: { status: true, msg: "Password is required" },
                }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  password: { status: false, msg: "" },
                }));
              }
              return;
            }
            auth(formData);
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            emailRef.current.focus();
          }
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
            setNavigateTo("/register");
          }}
        >
          Sign up
        </span>
      </span>
      <ForgotPasswordDialog
        resetPasswordOnStep={resetPasswordOnStep}
        setResetPasswordOnStep={setResetPasswordOnStep}
      />
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
          auth(formData);
        }}
      >
        login
      </Button>
      {navigateTo && <Navigate to={navigateTo} />}
    </div>
  );
};
const AuthForm = () => {
  const { windowSize } = useContext(ConfigContext);
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
    </AuthFormContext.Provider>
  );
};

export default AuthForm;
