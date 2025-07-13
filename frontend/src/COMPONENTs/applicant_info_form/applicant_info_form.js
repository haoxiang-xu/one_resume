import { useEffect, useState, useContext, createContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { countries } from "../../BUILTIN_COMPONENTs/consts/countries";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

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

const ApplicantInfoFormContext = createContext();

const NameFrom = () => {
  const { formData, move_to_form, update_name } = useContext(
    ApplicantInfoFormContext
  );
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
        value={formData.name.firstName}
        onChange={(e) => {
          update_name(e.target.value, formData.name.lastName);
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
        id="last-name-input"
        label="Last Name"
        variant="outlined"
        value={formData.name.lastName}
        onChange={(e) => {
          update_name(formData.name.firstName, e.target.value);
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
        onClick={() => move_to_form("contact")}
      >
        continue
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
        height: 56,
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
          height: 56,
          borderRadius: "10px 0 0 10px",
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
        label={`${
          (contactTypeOptions.find((opt) => opt.value === contact_type) || {}).label || ""
        }`}
        variant="outlined"
        value={contact_value}
        onChange={(e) => {
          edit_contact_row_value(e.target.value);
        }}
        sx={{
          transition: "all 0.2s ease",
          width: moreOnHover ? "calc(70% - 2px)" : "calc(70% + 26px)",
          marginLeft: "2px",
          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: "0 10px 10px 0",
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
        color={moreOnHover ? "error" : "default"}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          transition: "all 0.2s ease",
          width: moreOnHover ? 45 : 36,
          height: moreOnHover ? 45 : 36,
          borderRadius: "50%",
          right: -16,
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
  const { theme } = useContext(ConfigContext);
  const {
    formData,
    move_to_form,
    update_cell,
    update_email,
    add_contact_extra_row,
    update_contact_extra_row_type,
    update_contact_extra_row_value,
    delete_contact_extra_row,
  } = useContext(ApplicantInfoFormContext);

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
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
        }}
      >
        <Icon
          src="phone"
          style={{
            width: 24,
            height: 24,
            position: "absolute",
            top: "50%",
            left: "16px",
            transform: "translateY(-50%)",
          }}
        />
        <Autocomplete
          id="country-code-input"
          options={countries}
          disableClearable
          value={{ phone: formData.contact.cell.countryCode }}
          onChange={(event, newValue) => {
            if (newValue) {
              update_cell(newValue.phone, formData.contact.cell.number);
            }
          }}
          sx={{
            width: "140px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px 0 0 10px",
              background: "transparent",
              boxShadow: "none",
              height: 56,
            },
            "& .MuiInputBase-input": {
              height: "100%",
              fontFamily: "Jost",
              fontSize: 16,
            },
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "10px",
                backgroundColor: theme?.backgroundColor || "#FFFFFF",
                boxShadow: "0 2px 32px rgba(0,0,0,0.16)",
                width: 256,
                fontFamily: "Jost",
              },
            },
            listbox: {
              sx: {
                padding: "8px",
                fontFamily: "Jost",
              },
            },
            listItem: {
              sx: {
                fontFamily: "Jost",
              },
            },
          }}
          autoHighlight
          getOptionLabel={(option) => `+${option.phone}`}
          filterOptions={(options, { inputValue }) =>
            options.filter((option) =>
              `${option.label} ${option.code} ${option.phone}`
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            )
          }
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ borderRadius: "6px", "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              />
              {option.label} ({option.code}) +{option.phone}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label=""
              placeholder="+1"
              sx={{
                "& .MuiInputBase-input": { fontFamily: "Jost" },
              }}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
                style: { fontSize: 15, textAlign: "right" },
              }}
            />
          )}
        />
        <TextField
          required
          fullWidth
          label="Cell"
          variant="outlined"
          value={formData.contact.cell.number}
          onChange={(e) => {
            update_cell(formData.contact.cell.countryCode, e.target.value);
          }}
          sx={{
            width: "calc(100% - 140px - 2px)",
            "& .MuiOutlinedInput-root": {
              marginLeft: "2px",
              borderRadius: "0 10px 10px 0",
              fontFamily: "Jost",
              background: "transparent",
              border: "none",
              boxShadow: "none",
            },
            "& label": { fontFamily: "Jost" },
            "& input": { fontFamily: "Jost" },
          }}
          inputProps={{
            style: { fontSize: 16 },
          }}
        />
      </Box>
      <TextField
        required
        id="email-input"
        label="Email"
        variant="outlined"
        value={formData.contact.email}
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

      {formData.contact.extra.map((contact, index) => (
        <div key={index}>
          <ContactRow
            contact_type={contact.contact_type}
            contact_value={contact.contact_value}
            edit_contact_row_type={(contact_type) => {
              update_contact_extra_row_type(index, contact_type);
            }}
            edit_contact_row_value={(contact_value) => {
              update_contact_extra_row_value(index, contact_value);
            }}
            delete_contact_row={() => {
              delete_contact_extra_row(index);
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
        onClick={add_contact_extra_row}
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
          onClick={() => move_to_form("name")}
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
          onClick={() => {
            move_to_form("education");
          }}
        >
          continue
        </Button>
      </div>
    </div>
  );
};
const EducationRow = () => {
  const { theme } = useContext(ConfigContext);
  const degreeOptions = [
    { value: "doctor_category", label: "Doctoral Degrees:", disabled: true },
    { value: "doctor_of_philosophy", label: "Doctor of Philosophy (Ph.D.)" },
    { value: "doctor_of_education", label: "Doctor of Education (Ed.D.)" },
    { value: "juris_doctor", label: "Juris Doctor (J.D.)" },
    { value: "doctor_of_medicine", label: "Doctor of Medicine (M.D.)" },
    { value: "doctor_degree", label: "Other Doctoral Degree" },
    { value: "master_category", label: "Master's Degrees:", disabled: true },
    { value: "master_of_science", label: "Master of Science (M.Sc. or MS)" },
    { value: "master_of_arts", label: "Master of Arts (M.A. or MA)" },
    { value: "master_of_engineering", label: "Master of Engineering (M.Eng.)" },
    {
      value: "master_of_business_administration",
      label: "Master of Business Administration (MBA)",
    },
    { value: "master_of_education", label: "Master of Education (M.Ed.)" },
    { value: "master_of_fine_arts", label: "Master of Fine Arts (MFA)" },
    {
      value: "master_of_public_health",
      label: "Master of Public Health (MPH)",
    },
    {
      value: "master_degree",
      label: "Other Master's Degree",
    },
    {
      value: "bachelor_category",
      label: "Bachelor's Degrees:",
      disabled: true,
    },
    {
      value: "bachelor_of_science",
      label: "Bachelor of Science (B.Sc. or BS)",
    },
    { value: "bachelor_of_arts", label: "Bachelor of Arts (B.A. or BA)" },
    {
      value: "bachelor_of_engineering",
      label: "Bachelor of Engineering (B.Eng. or BE)",
    },
    {
      value: "bachelor_of_business_administration",
      label: "Bachelor of Business Administration (BBA)",
    },
    { value: "bachelor_of_fine_arts", label: "Bachelor of Fine Arts (BFA)" },
    { value: "bachelor_degree", label: "Other Bachelor's Degree" },
    {
      value: "associate_category",
      label: "Associate Degrees:",
      disabled: true,
    },
    { value: "associate_degree", label: "Associate Degree" },
    { value: "diploma", label: "Diploma" },
    { value: "certificate", label: "Certificate" },
    { value: "high_school_diploma", label: "High School Diploma" },
    { value: "ged", label: "GED (General Educational Development)" },
    { value: "no_formal_education", label: "No Formal Education" },
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
      <TextField
        id={`institution-input`}
        label={`Institution`}
        variant="outlined"
        required
        sx={{
          transition: "all 0.2s ease",
          width: moreOnHover ? "calc(100% - 36px)" : "calc(100% - 8px)",
          marginBottom: "16px",
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
      <FormControl
        sx={{
          width: "60%",
          borderRadius: "10px",
        }}
      >
        <InputLabel id="degree-select-label" sx={{ fontFamily: "Jost" }}>
          Degree
        </InputLabel>
        <Select
          labelId="degree-select-label"
          id="degree-select"
          label="Degree"
          sx={{
            transition: "all 0.2s ease",
            borderRadius: "10px",
            fontFamily: "Jost",
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
          {degreeOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              sx={{
                fontFamily: "Jost",
                fontSize: "16px",
                borderRadius: "6px",
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id={`grade-gpa-input`}
        label={`Grade / GPA`}
        variant="outlined"
        sx={{
          transition: "all 0.2s ease",
          width: moreOnHover ? "calc(30% - 16px)" : "calc(30% + 12px)",
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
      <TextField
        id={`specialization-input`}
        label={`Specialization`}
        variant="outlined"
        sx={{
          transition: "all 0.2s ease",
          width: moreOnHover ? "calc(100% - 36px)" : "calc(100% - 8px)",
          marginTop: "16px",
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
        color={moreOnHover ? "error" : "default"}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          transition: "all 0.2s ease",
          width: moreOnHover ? 45 : 36,
          height: moreOnHover ? 45 : 36,
          borderRadius: "50%",
          right: -16,
        }}
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
const EudcationForm = () => {
  const { move_to_form } = useContext(ApplicantInfoFormContext);
  return (
    <div
      className="education-form"
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
        Tell me about your education
      </span>
      <EducationRow />
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
          onClick={() => move_to_form("contact")}
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
          onClick={() => {}}
        >
          continue
        </Button>
      </div>
    </div>
  );
};
const ApplicantInfoForm = () => {
  const { windowSize } = useContext(ConfigContext);
  const [onForm, setOnForm] = useState("name");
  const [formData, setFormData] = useState({
    name: {
      firstName: "",
      lastName: "",
    },
    contact: {
      cell: {
        countryCode: "1",
        number: "",
      },
      email: "",
      extra: [],
    },
    education: [],
  });

  const move_to_form = (form) => {
    setOnForm(form);
  };
  const update_name = (firstName, lastName) => {
    setFormData((prev) => ({
      ...prev,
      name: {
        firstName,
        lastName,
      },
    }));
  };
  const update_cell = (countryCode, number) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        cell: {
          countryCode,
          number,
        },
      },
    }));
  };
  const update_email = (email) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        email,
      },
    }));
  };
  const add_contact_extra_row = () => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        extra: [
          ...prev.contact.extra,
          {
            contact_type: "",
            contact_value: "",
          },
        ],
      },
    }));
  };
  const update_contact_extra_row_type = (index, contact_type) => {
    setFormData((prev) => {
      const newContacts = [...prev.contact.extra];
      newContacts[index].contact_type = contact_type;
      return {
        ...prev,
        contact: {
          ...prev.contact,
          extra: newContacts,
        },
      };
    });
  };
  const update_contact_extra_row_value = (index, contact_value) => {
    setFormData((prev) => {
      const newContacts = [...prev.contact.extra];
      newContacts[index].contact_value = contact_value;
      return {
        ...prev,
        contact: {
          ...prev.contact,
          extra: newContacts,
        },
      };
    });
  };
  const delete_contact_extra_row = (index) => {
    setFormData((prev) => {
      const newContacts = [...prev.contact.extra];
      newContacts.splice(index, 1);
      return {
        ...prev,
        contact: {
          ...prev.contact,
          extra: newContacts,
        },
      };
    });
  };

  return (
    <ApplicantInfoFormContext.Provider
      value={{
        onForm,
        setOnForm,
        formData,
        move_to_form,
        update_name,
        update_cell,
        update_email,
        add_contact_extra_row,
        update_contact_extra_row_type,
        update_contact_extra_row_value,
        delete_contact_extra_row,
      }}
    >
      <div
        className="applicant-info-form"
        style={{
          position: "absolute",
          top: windowSize.height / 2 - 200,
          left: "50%",
          transform: "translate(-50%, 0%)",
        }}
      >
        {onForm === "name" && <NameFrom />}
        {onForm === "contact" && <ContactFrom />}
        {onForm === "education" && <EudcationForm />}
      </div>
    </ApplicantInfoFormContext.Provider>
  );
};

export default ApplicantInfoForm;
