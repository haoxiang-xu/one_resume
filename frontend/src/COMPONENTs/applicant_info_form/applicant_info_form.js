import { useEffect, useState, useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
const ContactRow = ({
  contact_type,
  contact_value,
  edit_contact_row_type,
  edit_contact_row_value,
  delete_contact_row,
}) => {
    const { theme } = useContext(ConfigContext);
  const contactTypeOptions = [
    { value: "linkedin", label: "LinkedIn", icon: "linked_in" },
    { value: "github", label: "GitHub", icon: "github" },
    { value: "personal_website", label: "Personal Website", icon: "link" },
    { value: "portfolio", label: "Portfolio", icon: "passport" },
    { value: "other", label: "Other", icon: "link" },
  ];
  const [moreOnHover, setMoreOnHover] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering) {
      const timeout = setTimeout(() => setMoreOnHover(false), 120);
      return () => clearTimeout(timeout);
    } else {
      setMoreOnHover(true);
    }
  }, [hovering]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Select
        labelId="contact-type-select-label"
        id="contact-type-select"
        value={contact_type}
        onChange={(e) => {
          const selectedOption = contactTypeOptions.find(
            (opt) => opt.value === e.target.value
          );
          edit_contact_row_type(selectedOption.value);
        }}
        renderValue={(value) => {
          const selectedOption = contactTypeOptions.find(
            (opt) => opt.value === value
          );
          return (
            <Icon
              src={selectedOption.icon}
              style={{
                position: "absolute",
                top: "50%",
                left: "40%",
                transform: "translate(-50%, -50%)",
                width: 24,
                height: 24,
              }}
            />
          );
        }}
        sx={{
          transition: "all 0.2s ease",
          width: "20%",
          borderRadius: "10px",
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "10px",
              backgroundColor: theme?.backgroundColor || "#FFFFFF",
              boxShadow: "0 2px 32px rgba(0,0,0,0.16)",
              maxHeight: 300,
              fontFamily: "Jost",
            },
          },
          MenuListProps: {
            sx: {
              padding: "8px",
            },
          },
        }}
      >
        {contactTypeOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontFamily: "Jost",
              fontSize: "16px",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 16,
                height: 16,
                marginRight: "12px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            >
              <Icon
                src={option.icon}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 20,
                  height: 20,
                }}
              />
            </div>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <TextField
        id={`${contact_value}-input`}
        label={`${contact_type}`}
        variant="outlined"
        value={contact_value}
        onChange={(e) => {
          edit_contact_row_value(e.target.value);
        }}
        sx={{
          transition: "all 0.2s ease",
          width: moreOnHover ? "calc(70% - 16px)" : "calc(70% + 12px)",
          marginLeft: "16px",
          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: "10px",
            paddingRight: "14px",
            transition: "height 0.36s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
          },
          "& .MuiInputBase-input": {
            height: "100%",
            fontFamily: "Jost",
            boxSizing: "border-box",
            padding: "12px 14px",
          },
          "& label": {
            fontFamily: "Jost",
          },
          "& input": {
            height: "100%",
            fontFamily: "Jost",
          },
        }}
      />
      <IconButton
        color="error"
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          transition: "all 0.2s ease",
          width: moreOnHover ? 45 : 36,
          height: moreOnHover ? 45 : 36,
          borderRadius: "50%",
          right: -16,
          backgroundColor: moreOnHover ? "#ffe5e5" : "transparent",
        }}
        onClick={() => delete_contact_row()}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Icon
          src={moreOnHover ? "delete" : "more"}
          color={null}
          style={{
            width: 22,
            height: 22,
            transition: "transform 0.15s ease",
            transform: moreOnHover ? "scale(1.1)" : "scale(1)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "center",
            transform: "translate(-50%, -50%)",
          }}
        />
      </IconButton>
    </div>
  );
};
const ContactFrom = () => {
  const [extraContact, setExtraContact] = useState([]);

  const add_contact_row = () => {
    setExtraContact((prev) => [
      ...prev,
      {
        contact_type: "",
        contact_value: "",
      },
    ]);
  };
  const edit_contact_row_type = (index, contact_type) => {
    setExtraContact((prev) => {
      const newContacts = [...prev];
      newContacts[index].contact_type = contact_type;
      return newContacts;
    });
  };
  const edit_contact_row_value = (index, contact_value) => {
    setExtraContact((prev) => {
      const newContacts = [...prev];
      newContacts[index].contact_value = contact_value;
      return newContacts;
    });
  };
  const delete_contact_row = (index) => {
    setExtraContact((prev) => {
      const newContacts = [...prev];
      newContacts.splice(index, 1);
      return newContacts;
    });
  };

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
      <TextField
        required
        id="address-input"
        label="Address"
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
                src="home"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {extraContact.map((contact, index) => (
        <div key={index}>
          <ContactRow
            contact_type={contact.contact_type}
            contact_value={contact.contact_value}
            edit_contact_row_type={(contact_type) => {
              edit_contact_row_type(index, contact_type);
            }}
            edit_contact_row_value={(contact_value) => {
              edit_contact_row_value(index, contact_value);
            }}
            delete_contact_row={() => {
              delete_contact_row(index);
            }}
          />
        </div>
      ))}
      <IconButton
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          alignSelf: "center",
        }}
        onClick={add_contact_row}
      >
        <Icon
          src="add"
          style={{
            width: 24,
            height: 24,
          }}
        />
      </IconButton>
      <div
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <Button
          variant="text"
          color="primary"
          sx={{
            marginRight: "auto",
            width: 90,
            borderRadius: "10px",
            fontFamily: "Jost",
            fontSize: "16px",
            textTransform: "none",
          }}
          startIcon={
            <Icon
              src="arrow_left"
              style={{
                width: 24,
                height: 24,
              }}
            />
          }
        >
          back
        </Button>
        <Button
          variant="text"
          color="primary"
          sx={{
            marginLeft: "auto",
            width: 120,
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
        >
          continue
        </Button>
      </div>
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
