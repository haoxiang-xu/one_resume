import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const NameFrom = () => {
  return (
    <div
      className="name-form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        width: "400px",
        margin: "auto",
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
        Hello, what is your name?
      </span>
      <TextField
        required
        id="first-name-input"
        label="First Name"
        variant="outlined"
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
        id="last-name-input"
        label="Last Name"
        variant="outlined"
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
      <Button
        variant="text"
        color="primary"
        sx={{
          marginLeft: "auto",
          width: 100,
          borderRadius: "10px",
          fontFamily: "Jost",
          fontSize: "16px",
          textTransform: "none",
        }}
      >
        Continue
      </Button>
    </div>
  );
};
const ContactFrom = () => {
  return (
    <div
      className="contact-form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        width: "400px",
        margin: "auto",
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
        How can I reach you?
      </span>
      <TextField
        required
        id="cell-input"
        label="Cell"
        variant="outlined"
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
          startAdornment: (
            <InputAdornment position="start">
              <Icon
                src="phone"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        required
        id="email-input"
        label="Email"
        variant="outlined"
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
          startAdornment: (
            <InputAdornment position="start">
              <Icon
                src="email"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      <IconButton
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          alignSelf: "center",
        }}
      >
        <Icon
          src="add"
          style={{
            width: 24,
            height: 24,
          }}
        />
      </IconButton>

      <Button
        variant="text"
        color="primary"
        sx={{
          marginLeft: "auto",
          width: 100,
          borderRadius: "10px",
          fontFamily: "Jost",
          fontSize: "16px",
          textTransform: "none",
        }}
      >
        Continue
      </Button>
    </div>
  );
};
const ApplicantInfoForm = () => {
  return (
    <div
      className="applicant-info-form"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <ContactFrom />
    </div>
  );
};

export default ApplicantInfoForm;
