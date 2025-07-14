import { useEffect, useState, useContext, createContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
import { FormPageContext } from "../../PAGEs/form";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const ApplicantInfoFormContext = createContext();

const NameFrom = () => {
  const { onForm, formData, move_to_form, update_name } = useContext(
    ApplicantInfoFormContext
  );
  const [style, setStyle] = useState({
    marginTop: "36px",
    opacity: 0,
    height: 0,
  });

  useEffect(() => {
    if (onForm === "name") {
      setTimeout(() => {
        setStyle({
          marginTop: "0px",
          padding: "16px",
          opacity: 1,
          height: "auto",
        });
      }, 50);
    } else {
      setStyle({
        marginTop: "36px",
        padding: "0px",
        opacity: 0,
        height: 0,
      });
    }
  }, [onForm]);

  return (
    <div
      className="name-form"
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
          (contactTypeOptions.find((opt) => opt.value === contact_type) || {})
            .label || ""
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
  const { scroll_to_bottom } = useContext(FormPageContext);
  const {
    onForm,
    formData,
    move_to_form,
    update_cell,
    update_email,
    add_contact_extra_row,
    update_contact_extra_row_type,
    update_contact_extra_row_value,
    delete_contact_extra_row,
  } = useContext(ApplicantInfoFormContext);
  const [style, setStyle] = useState({
    marginTop: "36px",
    opacity: 0,
  });

  useEffect(() => {
    if (onForm === "contact") {
      setTimeout(() => {
        setStyle({
          marginTop: "0px",
          opacity: 1,
          height: "auto",
        });
      }, 50);
    } else {
      setStyle({
        marginTop: "36px",
        opacity: 0,
        height: 0,
      });
    }
  }, [onForm]);

  return (
    <div
      className="contact-form"
      style={{
        transition: "margin-top 0.2s ease, opacity 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        width: "400px",
        marginTop: style.marginTop,
        height: style.height,
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
              className: "scrolling-space-v",
              sx: {
                borderRadius: "10px",
                backgroundColor: theme?.backgroundColor || "#FFFFFF",
                boxShadow: "0 2px 32px rgba(0,0,0,0.16)",
                width: 512,
                fontFamily: "Jost",
              },
            },
            listbox: {
              className: "scrolling-space-v",
              sx: {
                margin: "6px",
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
          isOptionEqualToValue={(option, value) => option.code === value.code}
          filterOptions={(options, { inputValue }) =>
            options.filter((option) =>
              `${option.label} ${option.code} ${option.phone}`
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            )
          }
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <MenuItem
                component="li"
                sx={{
                  borderRadius: "6px",
                  "& > img": { mr: 2, flexShrink: 0 },
                  fontFamily: "Jost",
                }}
                key={option.code + option.phone + option.label}
                {...rest}
              >
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  alt=""
                />
                <span style={{ flexGrow: 1 }}>
                  {option.label} ({option.code}) + {option.phone}
                </span>
              </MenuItem>
            );
          }}
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
        onClick={() => {
          add_contact_extra_row();
          scroll_to_bottom();
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
const MonthRangePicker = ({
  moreOnHover,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const { theme } = useContext(ConfigContext);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          transition: "all 0.2s ease",
          gap: "2px",
        }}
        display="flex"
        alignItems="center"
        mt="16px"
        width={moreOnHover ? "calc(100% - 36px)" : "calc(100% - 8px)"}
      >
        <DatePicker
          views={["year", "month"]}
          label="Start Date"
          value={startDate}
          format="MM/YYYY"
          onChange={(newValue) => {
            setStartDate(newValue);
            if (
              endDate &&
              newValue &&
              dayjs(newValue).isAfter(dayjs(endDate))
            ) {
              setEndDate(null);
            }
          }}
          slots={{
            openPickerIcon: () => (
              <Icon
                src="calendar"
                style={{
                  width: 22,
                  height: 22,
                }}
              />
            ),
          }}
          slotProps={{
            textField: {
              variant: "outlined",
              fullWidth: true,
              InputProps: {
                sx: { borderRadius: "10px 0 0 10px" },
              },
            },
            popper: {
              sx: {
                borderRadius: "16px",
              },
            },
            paper: {
              sx: {
                borderRadius: "16px",
                backgroundColor: theme?.backgroundColor || "#FFF",
                boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
              },
            },
            layout: {
              sx: {
                fontFamily: "Jost",
                backgroundColor: theme?.backgroundColor || "#FFF",
              },
            },
          }}
        />
        <DatePicker
          views={["year", "month"]}
          label="End Date"
          value={endDate}
          format="MM/YYYY"
          onChange={(newValue) => setEndDate(newValue)}
          slots={{
            openPickerIcon: () => (
              <Icon
                src="calendar"
                style={{
                  width: 22,
                  height: 22,
                }}
              />
            ),
          }}
          slotProps={{
            textField: {
              variant: "outlined",
              fullWidth: true,
              InputProps: {
                sx: { borderRadius: "0 10px 10px 0" },
              },
            },
          }}
          minDate={startDate ? dayjs(startDate).add(1, "month") : null}
          disabled={!startDate}
        />
      </Box>
    </LocalizationProvider>
  );
};
const EducationRow = ({ id, index }) => {
  const { theme } = useContext(ConfigContext);
  const {
    formData,
    update_education_row_institution,
    update_education_row_degree,
    update_education_row_gpa_grade,
    update_education_row_specialization,
    update_education_row_start_date,
    update_education_row_end_date,
    delete_education_row,
  } = useContext(ApplicantInfoFormContext);
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
        marginBottom: index === formData.education.length - 1 ? "0px" : "64px",
      }}
    >
      <TextField
        id={`institution-input`}
        label={`Institution`}
        variant="outlined"
        value={
          formData.education.find((item) => item.id === id)?.institution || ""
        }
        onChange={(e) => {
          update_education_row_institution(id, e.target.value);
        }}
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
          value={
            formData.education.find((item) => item.id === id)?.degree || ""
          }
          onChange={(e) => {
            update_education_row_degree(id, e.target.value);
          }}
          sx={{
            transition: "all 0.2s ease",
            borderRadius: "10px",
            fontFamily: "Jost",
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                padding: "6px",
                borderRadius: "10px",
                backgroundColor: theme?.backgroundColor || "#FFFFFF",
                boxShadow: "0 2px 32px rgba(0,0,0,0.16)",
                maxHeight: "312px",
                overflowY: "hidden",
                fontFamily: "Jost",
              },
            },
            MenuListProps: {
              className: "scrolling-space-v",
              sx: {
                maxHeight: "300px",
                overflowY: "auto",
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
        value={
          formData.education.find((item) => item.id === id)?.gpa_grade || ""
        }
        onChange={(e) => {
          update_education_row_gpa_grade(id, e.target.value);
        }}
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
        value={
          formData.education.find((item) => item.id === id)?.specialization ||
          ""
        }
        onChange={(e) => {
          update_education_row_specialization(id, e.target.value);
        }}
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
      <MonthRangePicker
        moreOnHover={moreOnHover}
        startDate={
          formData.education.find((item) => item.id === id)?.startDate || null
        }
        endDate={
          formData.education.find((item) => item.id === id)?.endDate || null
        }
        setStartDate={(date) => {
          update_education_row_start_date(id, date);
        }}
        setEndDate={(date) => {
          update_education_row_end_date(id, date);
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
        onClick={() => {
          delete_education_row(id);
        }}
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
  const { onForm, formData, move_to_form, add_education_row } = useContext(
    ApplicantInfoFormContext
  );
  const { scroll_to_bottom } = useContext(FormPageContext);
  const [style, setStyle] = useState({
    marginTop: "36px",
    opacity: 0,
  });

  useEffect(() => {
    if (onForm === "education") {
      setTimeout(() => {
        setStyle({
          marginTop: "0px",
          opacity: 1,
          height: "auto",
        });
      }, 50);
    } else {
      setStyle({
        marginTop: "36px",
        opacity: 0,
        height: 0,
      });
    }
  }, [onForm]);

  return (
    <div
      className="education-form"
      style={{
        transition: "margin-top 0.2s ease, opacity 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        width: "400px",
        marginTop: style.marginTop,
        height: style.height,
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
        Tell me about your education
      </span>
      {formData.education.map((education, index) => (
        <EducationRow key={index} id={education.id} index={index} />
      ))}
      <IconButton
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          alignSelf: "center",
        }}
        onClick={() => {
          add_education_row();
          scroll_to_bottom();
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
          onClick={() => {
            move_to_form("experience");
          }}
        >
          continue
        </Button>
      </div>
    </div>
  );
};
const ExperienceForm = () => {
  const { onForm, formData, move_to_form, add_education_row } = useContext(
    ApplicantInfoFormContext
  );
  const [style, setStyle] = useState({
    marginTop: "36px",
    opacity: 0,
  });

  useEffect(() => {
    if (onForm === "experience") {
      setTimeout(() => {
        setStyle({
          marginTop: "0px",
          opacity: 1,
          height: "auto",
        });
      }, 50);
    } else {
      setStyle({
        marginTop: "36px",
        opacity: 0,
        height: 0,
      });
    }
  }, [onForm]);

  return (
    <div
      className="experience-form"
      style={{
        transition: "margin-top 0.2s ease, opacity 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        width: "400px",
        marginTop: style.marginTop,
        height: style.height,
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
        Tell me about your experience
      </span>
      <IconButton
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          alignSelf: "center",
        }}
        onClick={add_education_row}
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
          onClick={() => move_to_form("education")}
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

  /* { contact } ----------------------------------------------------------------------------- */
  const add_contact_extra_row = () => {
    const contactTypeOptions = [
      { value: "linkedin", label: "LinkedIn", icon: "linked_in" },
      { value: "github", label: "GitHub", icon: "github" },
      { value: "personal_website", label: "Personal Website", icon: "link" },
      { value: "portfolio", label: "Portfolio", icon: "passport" },
      { value: "other", label: "Other", icon: "link" },
    ];
    const usedTypes = (formData.contact.extra || []).map((c) => c.contact_type);
    const availableOptions = contactTypeOptions.filter(
      (opt) => !usedTypes.includes(opt.value)
    );
    const picked =
      availableOptions.length > 0 ? availableOptions[0].value : "other";
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        extra: [
          ...prev.contact.extra,
          {
            contact_type: picked,
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
  /* { contact } ----------------------------------------------------------------------------- */

  /* { education } --------------------------------------------------------------------------- */
  const add_education_row = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          gpa_grade: "",
          specialization: "",
          startDate: null,
          endDate: null,
        },
      ],
    }));
  };
  const update_education_row_institution = (id, institution) => {
    const index = formData.education.findIndex((item) => item.id === id);
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index].institution = institution;
      return {
        ...prev,
        education: newEducation,
      };
    });
  };
  const update_education_row_degree = (id, degree) => {
    const index = formData.education.findIndex((item) => item.id === id);
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index].degree = degree;
      return {
        ...prev,
        education: newEducation,
      };
    });
  };
  const update_education_row_gpa_grade = (id, gpa_grade) => {
    const index = formData.education.findIndex((item) => item.id === id);
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index].gpa_grade = gpa_grade;
      return {
        ...prev,
        education: newEducation,
      };
    });
  };
  const update_education_row_specialization = (id, specialization) => {
    const index = formData.education.findIndex((item) => item.id === id);
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index].specialization = specialization;
      return {
        ...prev,
        education: newEducation,
      };
    });
  };
  const update_education_row_start_date = (id, startDate) => {
    const index = formData.education.findIndex((item) => item.id === id);
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index].startDate = startDate;
      return {
        ...prev,
        education: newEducation,
      };
    });
  };
  const update_education_row_end_date = (id, endDate) => {
    const index = formData.education.findIndex((item) => item.id === id);
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index].endDate = endDate;
      return {
        ...prev,
        education: newEducation,
      };
    });
  };
  const delete_education_row = (id) => {
    setFormData((prev) => {
      const newEducation = prev.education.filter((item) => item.id !== id);
      return {
        ...prev,
        education: newEducation,
      };
    });
  };
  /* { education } --------------------------------------------------------------------------- */

  return (
    <ApplicantInfoFormContext.Provider
      value={{
        onForm,
        setOnForm,
        formData,
        move_to_form,
        /* { name } */
        update_name,
        /* { contact } */
        update_cell,
        update_email,
        /* { contact extra } */
        add_contact_extra_row,
        update_contact_extra_row_type,
        update_contact_extra_row_value,
        delete_contact_extra_row,
        /* { education } */
        add_education_row,
        update_education_row_institution,
        update_education_row_degree,
        update_education_row_gpa_grade,
        update_education_row_specialization,
        update_education_row_start_date,
        update_education_row_end_date,
        delete_education_row,
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
        {onForm === "experience" && <ExperienceForm />}
      </div>
    </ApplicantInfoFormContext.Provider>
  );
};

export default ApplicantInfoForm;
