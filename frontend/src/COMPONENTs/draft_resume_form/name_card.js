import { useState, useContext, useEffect, createContext } from "react";

import satisfied_dark from "./satisfied_dark.png";
import satisfied_light from "./satisfied_light.png";

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
import { DraftResumeFormContext } from "./draft_resume_form";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const NameCardContext = createContext();

const MonthRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
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
        mt="8px"
        width="100%"
      >
        <DatePicker
          views={["year", "month"]}
          label="Start Date"
          value={startDate}
          format="MM/YYYY"
          size="small"
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
              size: "small",
              variant: "outlined",
              fullWidth: true,
              InputProps: {
                sx: { borderRadius: "10px 0 0 10px", height: 42 },
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
              size: "small",
              variant: "outlined",
              fullWidth: true,
              InputProps: {
                sx: { borderRadius: "0 10px 10px 0", height: 42 },
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
const ContactInfoTag = ({ icon, text }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { handleOnEdit } = useContext(NameCardContext);
  const [onHover, setOnHover] = useState(false);
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (onHover) {
      setStyle({
        width: "60px",
        opacity: 1,
        pointerEvents: "auto",
      });
    } else {
      setStyle({
        width: "0px",
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [onHover]);

  return (
    <div
      className="contact-info-tag"
      style={{
        position: "relative",
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "2px 8px",
        borderRadius: "16px",
        backgroundColor: theme ? theme.backgroundColor : "rgba(0, 0, 0, 0.04)",
        marginRight: "6px",
        marginBottom: "2px",
        border:
          onThemeMode === "dark_mode"
            ? "1px solid rgba(255, 255, 255, 0.16)"
            : "1px solid rgba(0, 0, 0, 0.16)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <Icon
        src={icon}
        style={{
          flex: "0 0 18px",
          width: "18px",
          height: "18px",
          opacity: 0.5,
        }}
        color={theme ? theme.font.color : "#000000"}
      />
      <span
        className="contact-info-text"
        style={{
          fontFamily: "Jost",
          fontSize: "14px",
          color: theme ? theme.font.color : "#000000",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        {text}
      </span>
      <div
        style={{
          transition: "all 0.16s ease",
          position: "absolute",
          top: -6,
          right: -6,
          width: style.width,
          height: "calc(100% + 12px)",
          borderRadius: "124px",
          zIndex: 1,
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(255, 255, 255, 0.8)",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.32)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          boxShadow: "0 0px 8px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          opacity: style.opacity,
        }}
      >
        <div onClick={() => {}}>
          <Icon
            src={"delete"}
            style={{
              width: "18px",
              height: "18px",
              position: "absolute",
              top: "50%",
              right: "0px",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              pointerEvents: style.pointerEvents,
            }}
            color={"red"}
          />
        </div>
        <div onClick={() => handleOnEdit()}>
          <Icon
            src={"edit"}
            style={{
              width: "18px",
              height: "18px",
              position: "absolute",
              top: "50%",
              left: "0px",
              transform: "translate(50%, -50%)",
              cursor: "pointer",
              pointerEvents: style.pointerEvents,
            }}
            color={theme ? theme.font.color : "#000000"}
          />
        </div>
      </div>
    </div>
  );
};
const ContactSection = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { formData } = useContext(DraftResumeFormContext);
  const contactTypeOptions = {
    linkedin: { icon: "linkedin" },
    github: { icon: "github" },
    personal_website: { icon: "link" },
    portfolio: { icon: "passport" },
    other: { icon: "link" },
  };

  return (
    <div
      className="contact-section"
      style={{
        padding: "6px",
      }}
    >
      <ContactInfoTag icon="phone" text={formData?.contact?.cell?.number} />
      <ContactInfoTag icon="email" text={formData?.contact?.email} />
      {formData?.contact?.extra?.map((item, index) => (
        <ContactInfoTag
          key={index}
          icon={contactTypeOptions[item.contact_type].icon}
          text={item.contact_value}
        />
      ))}
      <div
        style={{
          position: "relative",
          maxWidth: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "16px",
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(0, 0, 0, 0.04)",
          marginRight: "6px",
          marginBottom: "2px",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.16)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          cursor: "pointer",
        }}
      >
        <Icon
          src={"add"}
          style={{
            flex: "0 0 18px",
            width: "18px",
            height: "18px",
            opacity: 0.5,
          }}
          color={theme ? theme.font.color : "#000000"}
        />
      </div>
    </div>
  );
};
const EducationRow = ({ id, index }) => {
  const { theme } = useContext(ConfigContext);
  const [style, setStyle] = useState({
    height: 0,
  });
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

  useEffect(() => {
    setTimeout(() => {
      setStyle({
        height: 56 * 4 + 16 * 3 + 8 + "px",
      });
    }, 32);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: 6,
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <div
        style={{
          paddingTop: 6,
          transition: "height 0.2s ease",
          height: style.height,
          overflow: "hidden",
        }}
      >
        <TextField
          id={`institution-input`}
          label={`Institution`}
          variant="outlined"
          value={""}
          size="small"
          onChange={(e) => {
            return;
          }}
          sx={{
            transition: "all 0.2s ease",
            width: "100%",
            marginBottom: "8px",
            "& .MuiOutlinedInput-root": {
              height: 42,
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
          <InputLabel
            id="degree-select-label"
            size="small"
            sx={{ fontFamily: "Jost" }}
          >
            Degree
          </InputLabel>
          <Select
            labelId="degree-select-label"
            id="degree-select"
            label="Degree"
            value={""}
            onChange={(e) => {
              return;
            }}
            sx={{
              transition: "all 0.2s ease",
              borderRadius: "10px",
              fontFamily: "Jost",
              height: 42,
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
          value={""}
          size="small"
          onChange={(e) => {
            return;
          }}
          sx={{
            transition: "all 0.2s ease",
            width: "calc(40% - 8px)",
            marginLeft: "8px",
            "& .MuiOutlinedInput-root": {
              height: 42,
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
          value={""}
          size="small"
          onChange={(e) => {
            return;
          }}
          sx={{
            transition: "all 0.2s ease",
            width: "100%",
            marginTop: "8px",
            "& .MuiOutlinedInput-root": {
              height: 42,
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
          startDate={null}
          endDate={null}
          setStartDate={(date) => {
            return;
          }}
          setEndDate={(date) => {
            return;
          }}
        />
      </div>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            return;
          }}
          sx={{
            mt: 2,
            height: 42,
            borderRadius: "10px",
            textTransform: "none",
            marginRight: "8px",
          }}
        >
          cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            height: 42,
            borderRadius: "10px",
            textTransform: "none",
          }}
        >
          add education
        </Button>
      </Box>
    </div>
  );
};
const EducationTag = ({ icon, text }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { handleOnEdit } = useContext(NameCardContext);
  const [onHover, setOnHover] = useState(false);
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (onHover) {
      setStyle({
        width: "60px",
        opacity: 1,
        pointerEvents: "auto",
      });
    } else {
      setStyle({
        width: "0px",
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [onHover]);

  return (
    <div
      className="contact-info-tag"
      style={{
        position: "relative",
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "2px 8px",
        borderRadius: "16px",
        backgroundColor: theme ? theme.backgroundColor : "rgba(0, 0, 0, 0.04)",
        marginRight: "6px",
        marginBottom: "2px",
        border:
          onThemeMode === "dark_mode"
            ? "1px solid rgba(255, 255, 255, 0.16)"
            : "1px solid rgba(0, 0, 0, 0.16)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <Icon
        src={icon}
        style={{
          flex: "0 0 18px",
          width: "18px",
          height: "18px",
          opacity: 0.5,
        }}
        color={theme ? theme.font.color : "#000000"}
      />
      <span
        className="contact-info-text"
        style={{
          fontFamily: "Jost",
          fontSize: "14px",
          color: theme ? theme.font.color : "#000000",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        {text}
      </span>
      <div
        style={{
          transition: "all 0.16s ease",
          position: "absolute",
          top: -6,
          right: -6,
          width: style.width,
          height: "calc(100% + 12px)",
          borderRadius: "124px",
          zIndex: 1,
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(255, 255, 255, 0.8)",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.32)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          boxShadow: "0 0px 8px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          opacity: style.opacity,
        }}
      >
        <div>
          <Icon
            src={"delete"}
            style={{
              width: "18px",
              height: "18px",
              position: "absolute",
              top: "50%",
              right: "0px",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              pointerEvents: style.pointerEvents,
            }}
            color={"red"}
          />
        </div>
        <div onClick={() => handleOnEdit()}>
          <Icon
            src={"edit"}
            style={{
              width: "18px",
              height: "18px",
              position: "absolute",
              top: "50%",
              left: "0px",
              transform: "translate(50%, -50%)",
              cursor: "pointer",
              pointerEvents: style.pointerEvents,
            }}
            color={theme ? theme.font.color : "#000000"}
          />
        </div>
      </div>
    </div>
  );
};
const EducationSection = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { handleOnEdit } = useContext(NameCardContext);
  const { formData } = useContext(DraftResumeFormContext);

  const [onState, setOnState] = useState("default");

  return (
    <div
      className="education-section"
      style={{
        padding: "6px",
      }}
    >
      <span
        className="education-title"
        style={{
          fontFamily: "Jost",
          fontSize: "20px",
          color: theme ? theme.font.color : "#000000",
          marginBottom: "8px",
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        Education
      </span>
      {formData?.education?.map((item, index) => (
        <div key={index} className="education-item">
          <EducationTag
            icon={"education"}
            text={`${item.degree + " @ " + item.institution}`}
          />
        </div>
      ))}
      <div
        style={{
          transition: "all 0.2s ease",
          position: "relative",
          maxWidth: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "18px",
          backgroundColor:
            onState === "default"
              ? theme
                ? theme.backgroundColor
                : "rgba(0, 0, 0, 0.04)"
              : "transparent",
          marginTop: onState === "default" ? "0px" : "32px",
          marginRight: "6px",
          marginBottom: onState === "default" ? "2px" : "32px",
          border:
            onState === "default"
              ? onThemeMode === "dark_mode"
                ? "1px solid rgba(255, 255, 255, 0.16)"
                : "1px solid rgba(0, 0, 0, 0.16)"
              : "none",
          cursor: "pointer",
        }}
      >
        {onState === "add_education" ? (
          <EducationRow id={null} index={null} />
        ) : null}
        {onState === "default" ? (
          <div
            onClick={() => {
              if (handleOnEdit) {
                handleOnEdit();
              } else {
                setOnState("add_education");
              }
            }}
          >
            <Icon
              src={"add"}
              style={{
                flex: "0 0 18px",
                width: "18px",
                height: "18px",
                opacity: 0.5,
              }}
              color={theme ? theme.font.color : "#000000"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
const ExperienceTag = ({ icon, text }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { handleOnEdit } = useContext(NameCardContext);
  const [onHover, setOnHover] = useState(false);
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (onHover) {
      setStyle({
        width: "60px",
        opacity: 1,
        pointerEvents: "auto",
      });
    } else {
      setStyle({
        width: "0px",
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [onHover]);

  return (
    <div
      className="contact-info-tag"
      style={{
        position: "relative",
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "2px 8px",
        borderRadius: "16px",
        backgroundColor: theme ? theme.backgroundColor : "rgba(0, 0, 0, 0.04)",
        marginRight: "6px",
        marginBottom: "2px",
        border:
          onThemeMode === "dark_mode"
            ? "1px solid rgba(255, 255, 255, 0.16)"
            : "1px solid rgba(0, 0, 0, 0.16)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <Icon
        src={icon}
        style={{
          flex: "0 0 18px",
          width: "18px",
          height: "18px",
          opacity: 0.5,
        }}
        color={theme ? theme.font.color : "#000000"}
      />
      <span
        className="contact-info-text"
        style={{
          fontFamily: "Jost",
          fontSize: "14px",
          color: theme ? theme.font.color : "#000000",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        {text}
      </span>
      <div
        style={{
          transition: "all 0.16s ease",
          position: "absolute",
          top: -6,
          right: -6,
          width: style.width,
          height: "calc(100% + 12px)",
          borderRadius: "124px",
          zIndex: 1,
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(255, 255, 255, 0.8)",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.32)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          boxShadow: "0 0px 8px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          opacity: style.opacity,
        }}
      >
        <div>
          <Icon
            src={"delete"}
            style={{
              width: "18px",
              height: "18px",
              position: "absolute",
              top: "50%",
              right: "0px",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              pointerEvents: style.pointerEvents,
            }}
            color={"red"}
          />
        </div>
        <div onClick={() => handleOnEdit()}>
          <Icon
            src={"edit"}
            style={{
              width: "18px",
              height: "18px",
              position: "absolute",
              top: "50%",
              left: "0px",
              transform: "translate(50%, -50%)",
              cursor: "pointer",
              pointerEvents: style.pointerEvents,
            }}
            color={theme ? theme.font.color : "#000000"}
          />
        </div>
      </div>
    </div>
  );
};
const ExperienceSection = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { formData } = useContext(DraftResumeFormContext);
  return (
    <div
      className="experience-section"
      style={{
        padding: "6px",
      }}
    >
      <span
        className="experience-title"
        style={{
          fontFamily: "Jost",
          fontSize: "20px",
          color: theme ? theme.font.color : "#000000",
          marginBottom: "8px",
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        Experience
      </span>
      {formData?.experience?.map((item, index) => (
        <div key={index} className="experience-item">
          <ExperienceTag
            icon={"pin"}
            text={`${item.role + " @ " + item.company}`}
          />
        </div>
      ))}
      <div
        style={{
          position: "relative",
          maxWidth: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "16px",
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(0, 0, 0, 0.04)",
          marginRight: "6px",
          marginBottom: "2px",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.16)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          cursor: "pointer",
        }}
      >
        <Icon
          src={"add"}
          style={{
            flex: "0 0 18px",
            width: "18px",
            height: "18px",
            opacity: 0.5,
          }}
          color={theme ? theme.font.color : "#000000"}
        />
      </div>
    </div>
  );
};
const NameCard = ({ handleOnEdit, handleOnClose }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { formData } = useContext(DraftResumeFormContext);

  return (
    <NameCardContext.Provider value={{ handleOnEdit, handleOnClose }}>
      <>
        <div
          style={{
            transition: "all 0.16s ease",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "none",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,

            backgroundColor: theme ? theme.foregroundColor : "#FFFFFF",
            border:
              onThemeMode === "dark_mode"
                ? "1px solid rgba(255, 255, 255, 0.16)"
                : "none",
            borderRadius: "8px",
            boxShadow: "0 0px 8px rgba(0, 0, 0, 0.16)",
          }}
        >
          <div
            className="scrolling-space-v"
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              width: "calc(100% - 16px)",
              height: "calc(100% - 16px)",
              overflowX: "hidden",
              overflowY: "scroll",
            }}
          >
            <img
              src={
                onThemeMode === "dark_mode" ? satisfied_light : satisfied_dark
              }
              alt="satisfied"
              draggable="false"
              style={{
                position: "absolute",
                top: "6px",
                left: "6px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",

                pointerEvents: "none",

                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                MsUserSelect: "none",
              }}
            />
            <span
              className="name-card-name-title"
              style={{
                position: "relative",
                marginLeft: "50px",
                fontFamily: "Jost",
                fontSize: "32px",
                color: theme ? theme.font.color : "#000000",
                pointerEvents: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                MsUserSelect: "none",
              }}
            >
              {formData?.first_name} {formData?.last_name}
            </span>
            <ContactSection />
            <EducationSection />
            <ExperienceSection />
          </div>
        </div>
      </>
    </NameCardContext.Provider>
  );
};

export default NameCard;
