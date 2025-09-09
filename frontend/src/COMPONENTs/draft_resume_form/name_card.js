import { useState, useContext, useEffect, createContext } from "react";

import satisfied_dark from "./satisfied_dark.png";
import satisfied_light from "./satisfied_light.png";
import { countries } from "../../BUILTIN_COMPONENTs/consts/countries";

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Skeleton from "@mui/material/Skeleton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
import { DraftResumeFormContext } from "./draft_resume_form";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const NameCardContext = createContext();

const contactTypeIcons = {
  linkedin: { icon: "linkedin" },
  github: { icon: "github" },
  personal_website: { icon: "link" },
  portfolio: { icon: "passport" },
  other: { icon: "link" },
};
const contactTypeOptions = [
  { value: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { value: "github", label: "GitHub", icon: "github" },
  { value: "personal_website", label: "Personal Website", icon: "link" },
  { value: "portfolio", label: "Portfolio", icon: "passport" },
  { value: "other", label: "Other", icon: "link" },
];

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
                sx: { borderRadius: "8px 0 0 8px", height: 42 },
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
                sx: { borderRadius: "0 8px 8px 0", height: 42 },
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
const ContactInfoTag = ({ index, icon, text, type, value }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const {
    update_cell,
    update_email,
    delete_contact_extra_row,
    update_contact_extra_row,
  } = useContext(DraftResumeFormContext);
  const { onEdit, setOnEdit } = useContext(NameCardContext);

  const [newContact, setNewContact] = useState({
    type: type,
    value: value,
  });
  const [newCell, setNewCell] = useState({
    number: value.number || "",
    countryCode: value.countryCode || "",
  });
  const [onEditing, setOnEditing] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [error, setError] = useState({
    status: false,
    msg: "",
  });
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (
      onEdit.startsWith("edit_contact_") &&
      onEdit.split("_").length === 3 &&
      parseInt(onEdit.split("_")[2]) === index
    ) {
      setOnEditing(true);
    } else {
      setOnEditing(false);
    }
  }, [onEdit]);
  useEffect(() => {
    setNewContact({
      type: type,
      value: value,
    });
    setNewCell({
      number: value.number || "",
      countryCode: value.countryCode || "",
    });
  }, [type, value, onEdit]);
  useEffect(() => {
    if (onHover) {
      if (icon === "phone" || icon === "email") {
        setStyle({
          width: "38px",
          opacity: 1,
          pointerEvents: "auto",
        });
      } else {
        setStyle({
          width: "60px",
          opacity: 1,
          pointerEvents: "auto",
        });
      }
    } else {
      setStyle({
        width: "0px",
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [icon, onHover]);

  return (
    <div
      className="contact-info-tag"
      style={{
        transition: "all 0.2s ease",
        position: "relative",
        maxWidth: "100%",
        minWidth: "64px",
        width: onEditing ? "100%" : "auto",
        height: onEditing ? "40px" : "28px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "2px 8px",
        borderRadius: "16px",
        backgroundColor: onEditing
          ? "transparent"
          : theme
          ? theme.backgroundColor
          : "rgba(0, 0, 0, 0.04)",
        marginTop: onEditing ? 6 : 0,
        marginRight: "6px",
        marginBottom: "2px",
        border: onEditing
          ? "1px solid rgba(0, 0, 0, 0)"
          : onThemeMode === "dark_mode"
          ? "1px solid rgba(255, 255, 255, 0.16)"
          : "1px solid rgba(0, 0, 0, 0.16)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {onEditing && type === "phone" ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 40,
          }}
        >
          <Autocomplete
            className="country-code-autocomplete"
            options={countries}
            disableClearable
            value={
              newCell.countryCode
                ? countries.find(
                    ((c) => c.code === newCell.countryCode) || null
                  )
                : null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setNewCell({
                  ...newCell,
                  countryCode: newValue.code,
                });
              } else {
                setNewCell({
                  ...newCell,
                  countryCode: "",
                });
              }
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 40,
              width: "30%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "32px 0 0 32px",
                background: "transparent",
                boxShadow: "none",
                height: 40,
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
                size="small"
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
            error={error.status}
            fullWidth
            label="Cell"
            variant="outlined"
            size="small"
            value={newCell.number}
            onChange={(e) => {
              setNewCell({ ...newCell, number: e.target.value });
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: "30%",
              width: "50%",
              "& .MuiOutlinedInput-root": {
                height: 40,
                marginLeft: "2px",
                borderRadius: "0 32px 32px 0",
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
          <IconButton
            color="success"
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translate(0%, -50%)",
              width: 36,
              height: 36,
              borderRadius: "18px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!newCell.number || !newCell.countryCode) {
                if (!newCell.countryCode) {
                  setError({
                    status: true,
                    msg: "select the country code",
                  });
                }
                if (!newCell.number) {
                  setError({
                    status: true,
                    msg: "cell number can not be empty",
                  });
                }
                return;
              }
              setError({
                status: false,
                msg: "",
              });
              update_cell(newCell);
              setNewContact({ type: "", value: "" });
              setOnEdit("pending");
              setOnHover(false);
            }}
          >
            <Icon
              src="check"
              color="green"
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                height: "24px",
                width: "24px",
              }}
            />
          </IconButton>
          <IconButton
            color="error"
            sx={{
              position: "absolute",
              top: "50%",
              right: 45,
              transform: "translate(0%, -50%)",
              width: 36,
              height: 36,
              borderRadius: "18px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOnEdit("pending");
              setOnHover(false);
            }}
          >
            <Icon
              src="close"
              color="red"
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                height: "24px",
                width: "24px",
              }}
            />
          </IconButton>
        </Box>
      ) : null}
      {onEditing && type === "email" ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 40,
          }}
        >
          <TextField
            required
            error={error.status}
            id="email-input"
            label="Email"
            size="small"
            variant="outlined"
            value={newContact.value}
            onChange={(e) => {
              setNewContact({ ...newContact, value: e.target.value });
            }}
            sx={{
              left: 0,
              width: "80%",
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "32px",
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
                    color={theme?.font?.color || "#000000"}
                  />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            color="success"
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translate(0%, -50%)",
              width: 36,
              height: 36,
              borderRadius: "18px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!newContact.type || !newContact.value) {
                if (!newContact.value) {
                  setError({
                    status: true,
                    msg: "email can not be empty",
                  });
                }
                return;
              }
              setError({
                status: false,
                msg: "",
              });
              update_email(newContact.value);
              setNewContact({ type: "", value: "" });
              setOnEdit("pending");
              setOnHover(false);
            }}
          >
            <Icon
              src="check"
              color="green"
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                height: "24px",
                width: "24px",
              }}
            />
          </IconButton>
          <IconButton
            color="error"
            sx={{
              position: "absolute",
              top: "50%",
              right: 45,
              transform: "translate(0%, -50%)",
              width: 36,
              height: 36,
              borderRadius: "18px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOnEdit("pending");
              setOnHover(false);
            }}
          >
            <Icon
              src="close"
              color="red"
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                height: "24px",
                width: "24px",
              }}
            />
          </IconButton>
        </Box>
      ) : null}
      {onEditing && type !== "phone" && type !== "email" ? (
        <>
          <Select
            labelId="contact-type-select-label"
            id="contact-type-select"
            value={newContact.type}
            onChange={(e) => {
              setNewContact({ ...newContact, type: e.target.value });
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
                    width: 20,
                    height: 20,
                  }}
                />
              );
            }}
            sx={{
              transition: "all 0.2s ease",
              position: "absolute",
              top: 0,
              left: 0,
              width: "20%",
              height: 40,
              outline: "none",
              borderRadius: "32px 0 0 32px",
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  border: "none",
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
            required
            label={
              type
                ? contactTypeOptions.find((opt) => opt.value === type)?.label ||
                  "select contact type"
                : "select contact type"
            }
            variant="outlined"
            value={newContact.value}
            size="small"
            error={error.status}
            onChange={(e) => {
              setNewContact({ ...newContact, value: e.target.value });
            }}
            sx={{
              transition: "all 0.2s ease",
              position: "absolute",
              top: 0,
              left: "20%",
              width: "60%",
              marginLeft: "2px",
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "0 32px 32px 0",
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
            color="success"
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translate(0%, -50%)",
              width: 36,
              height: 36,
              borderRadius: "18px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!newContact.type || !newContact.value) {
                if (!newContact.type) {
                  setError({
                    status: true,
                    msg: "select the contact type",
                  });
                }
                if (!newContact.value) {
                  setError({
                    status: true,
                    msg: "web link can not be empty",
                  });
                }
                return;
              }
              setError({
                status: false,
                msg: "",
              });
              update_contact_extra_row(
                index,
                newContact.type,
                newContact.value
              );
              setNewContact({ type: "", value: "" });
              setOnEdit("pending");
              setOnHover(false);
            }}
          >
            <Icon
              src="check"
              color="green"
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                height: "24px",
                width: "24px",
              }}
            />
          </IconButton>
          <IconButton
            color="error"
            sx={{
              position: "absolute",
              top: "50%",
              right: 45,
              transform: "translate(0%, -50%)",
              width: 36,
              height: 36,
              borderRadius: "18px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOnEdit("pending");
              setOnHover(false);
            }}
          >
            <Icon
              src="close"
              color="red"
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                height: "24px",
                width: "24px",
              }}
            />
          </IconButton>
        </>
      ) : null}
      {!onEditing ? (
        <>
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
            }}
          >
            {text}
          </span>
          <div
            style={{
              transition: "all 0.2s ease",
              position: "absolute",
              top: -6,
              right: -6,
              width: style.width,
              height: "calc(100% + 12px)",
              borderRadius: "32px",
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
            {icon === "phone" || icon === "email" ? null : (
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  delete_contact_extra_row(index);
                }}
              >
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
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setOnEdit("edit_contact_" + String(index));
              }}
            >
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
        </>
      ) : null}
    </div>
  );
};
const ContactSection = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { onEdit, setOnEdit } = useContext(NameCardContext);
  const { formData, add_contact_extra_row } = useContext(
    DraftResumeFormContext
  );
  const [error, setError] = useState({
    newContact: { status: false, msg: "" },
  });
  const [newContact, setNewContact] = useState({
    type: "",
    value: "",
  });

  return (
    <div
      className="contact-section"
      style={{
        marginTop: onEdit === "none" ? "0px" : "12px",
        padding: "6px",
      }}
    >
      <ContactInfoTag
        index={-2}
        icon="phone"
        text={formData?.contact?.cell?.number || "N/A"}
        type="phone"
        value={{
          number: formData?.contact?.cell?.number || "N/A",
          countryCode: formData?.contact?.cell?.countryCode || "N/A",
        }}
      />
      <ContactInfoTag
        index={-1}
        icon="email"
        text={formData?.contact?.email || "N/A"}
        type="email"
        value={formData?.contact?.email || "N/A"}
      />
      {formData?.contact?.extra?.map((item, index) => (
        <ContactInfoTag
          key={index}
          index={index}
          icon={contactTypeIcons[item.contact_type]?.icon || "link"}
          text={item.contact_value || "N/A"}
          type={item.contact_type}
          value={item.contact_value}
        />
      ))}
      <div
        style={{
          transition: "all 0.2s ease",
          position: "relative",
          width: onEdit !== "add_contact" ? 36 : "100%",
          display: "block",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: onEdit !== "add_contact" ? "4px 8px" : "8px 4px",
          borderRadius: "18px",
          backgroundColor:
            onEdit !== "add_contact"
              ? theme
                ? theme.backgroundColor
                : "rgba(0, 0, 0, 0.04)"
              : "transparent",
          marginTop: onEdit !== "add_contact" ? 0 : 6,
          marginBottom: 2,
          border:
            onEdit !== "add_contact"
              ? onThemeMode === "dark_mode"
                ? "1px solid rgba(255, 255, 255, 0.16)"
                : "1px solid rgba(0, 0, 0, 0.16)"
              : "1px solid rgba(0, 0, 0, 0)",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOnEdit("add_contact");
        }}
      >
        {onEdit === "add_contact" ? (
          <>
            <Select
              labelId="contact-type-select-label"
              id="contact-type-select"
              value={newContact.type}
              onChange={(e) => {
                setNewContact({ ...newContact, type: e.target.value });
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
                      width: 20,
                      height: 20,
                    }}
                  />
                );
              }}
              sx={{
                transition: "all 0.2s ease",
                position: "absolute",
                top: 0,
                left: 36,
                width: "20%",
                height: 40,
                outline: "none",
                borderRadius: "32px 0 0 32px",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    border: "none",
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
              required
              label={
                newContact.type
                  ? contactTypeOptions.find(
                      (opt) => opt.value === newContact.type
                    )?.label || "select contact type"
                  : "select contact type"
              }
              variant="outlined"
              value={newContact.value}
              size="small"
              error={error.newContact.status}
              helperText={error.newContact.msg}
              onChange={(e) => {
                setNewContact({ ...newContact, value: e.target.value });
              }}
              sx={{
                transition: "all 0.2s ease",
                position: "absolute",
                top: 0,
                left: "calc(20% + 36px)",
                width: "calc(60% - 36px)",
                marginLeft: "2px",
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: "0 32px 32px 0",
                  paddingRight: "14px",
                  transition:
                    "height 0.36s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
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
              color="success"
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translate(0%, -50%)",
                width: 36,
                height: 36,
                borderRadius: "18px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!newContact.type || !newContact.value) {
                  if (!newContact.type) {
                    setError({
                      newContact: {
                        status: true,
                        msg: "select the contact type",
                      },
                    });
                  }
                  if (!newContact.value) {
                    setError({
                      newContact: {
                        status: true,
                        msg: "web link can not be empty",
                      },
                    });
                  }
                  return;
                }
                setError({
                  newContact: { status: false, msg: "" },
                });
                add_contact_extra_row(newContact.type, newContact.value);
                setNewContact({ type: "", value: "" });
                setOnEdit("pending");
              }}
            >
              <Icon
                src="check"
                color="green"
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                  left: "50%",
                  height: "24px",
                  width: "24px",
                }}
              />
            </IconButton>
            <IconButton
              color="error"
              sx={{
                position: "absolute",
                top: "50%",
                right: 45,
                transform: "translate(0%, -50%)",
                width: 36,
                height: 36,
                borderRadius: "18px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOnEdit("pending");
              }}
            >
              <Icon
                src="close"
                color="red"
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                  left: "50%",
                  height: "24px",
                  width: "24px",
                }}
              />
            </IconButton>
          </>
        ) : null}
        <Icon
          src={"add"}
          style={{
            flex: "0 0 18px",
            width: onEdit === "add_contact" ? "24px" : "18px",
            height: onEdit === "add_contact" ? "24px" : "18px",
            opacity: 0.5,

            cursor: "pointer",
          }}
          color={theme ? theme.font.color : "#000000"}
        />
      </div>
    </div>
  );
};
const EducationEditTag = ({ index }) => {
  const { theme } = useContext(ConfigContext);
  const { get_education_row, edit_education_row, add_education_row } =
    useContext(DraftResumeFormContext);
  const { setOnEdit } = useContext(NameCardContext);
  const [style, setStyle] = useState({
    height: 0,
  });
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [gpa_grade, setGpa_grade] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
        height: 42 * 4 + 8 * 3 + 8 + "px",
      });
    }, 32);
  }, []);
  useEffect(() => {
    if (index !== null && index !== undefined && index >= 0) {
      const educationRow = get_education_row(index);
      if (educationRow) {
        setDegree(educationRow.degree);
        setInstitution(educationRow.institution);
        setGpa_grade(educationRow.gpa_grade);
        setSpecialization(educationRow.specialization);
        // Ensure DatePicker gets a Dayjs or null
        const parsedStart = educationRow.startDate
          ? dayjs(
              // support ISO string, timestamp, or Mongo $date shape
              educationRow.startDate?.$date || educationRow.startDate
            )
          : null;
        const parsedEnd = educationRow.endDate
          ? dayjs(educationRow.endDate?.$date || educationRow.endDate)
          : null;
        setStartDate(parsedStart && parsedStart.isValid() ? parsedStart : null);
        setEndDate(parsedEnd && parsedEnd.isValid() ? parsedEnd : null);
      }
    }
  }, [index]);

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: 0,
        top: 0,
        left: "50%",
        width: "100%",
        transform: "translateX(-50%)",
        // border: "1px solid rgba(255, 255, 255, 0.16)",
      }}
    >
      <div
        style={{
          padding: 4,
          transition: "height 0.2s ease",
          width: "80%",
          height: style.height,
          overflow: "hidden",
        }}
      >
        <TextField
          id={`institution-input`}
          label={`Institution`}
          variant="outlined"
          value={institution}
          size="small"
          onChange={(e) => {
            setInstitution(e.target.value);
          }}
          sx={{
            transition: "all 0.2s ease",
            width: "100%",
            marginBottom: "8px",
            "& .MuiOutlinedInput-root": {
              height: 42,
              borderRadius: "8px",
              paddingRight: "14px",
              transition: "height 0.2s ease",
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
            value={degree}
            onChange={(e) => {
              setDegree(e.target.value);
            }}
            sx={{
              transition: "all 0.2s ease",
              borderRadius: "8px",
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
          value={gpa_grade}
          size="small"
          onChange={(e) => {
            setGpa_grade(e.target.value);
          }}
          sx={{
            transition: "all 0.2s ease",
            width: "calc(40% - 8px)",
            marginLeft: "8px",
            "& .MuiOutlinedInput-root": {
              height: 42,
              borderRadius: "8px",
              paddingRight: "14px",
              transition: "height 0.2s ease",
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
              height: 36,
              fontFamily: "Jost",
            },
          }}
        />
        <TextField
          id={`specialization-input`}
          label={`Specialization`}
          variant="outlined"
          value={specialization}
          size="small"
          onChange={(e) => {
            setSpecialization(e.target.value);
          }}
          sx={{
            transition: "all 0.2s ease",
            width: "100%",
            marginTop: "8px",
            "& .MuiOutlinedInput-root": {
              height: 42,
              borderRadius: "8px",
              paddingRight: "14px",
              transition: "height 0.2s ease",
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
          startDate={startDate}
          endDate={endDate}
          setStartDate={(date) => {
            setStartDate(date);
          }}
          setEndDate={(date) => {
            setEndDate(date);
          }}
        />
      </div>
      <IconButton
        color="success"
        sx={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translate(0%, -50%)",
          width: 36,
          height: 36,
          borderRadius: "18px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (index !== null && index !== undefined && index >= 0) {
            edit_education_row(
              index,
              degree,
              gpa_grade,
              institution,
              specialization,
              startDate,
              endDate
            );
          } else {
            add_education_row(
              degree,
              gpa_grade,
              institution,
              specialization,
              startDate,
              endDate
            );
          }
          setOnEdit("pending");
        }}
      >
        <Icon
          src="check"
          color="green"
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
            height: "24px",
            width: "24px",
          }}
        />
      </IconButton>
      <IconButton
        color="error"
        sx={{
          position: "absolute",
          top: "50%",
          right: 45,
          transform: "translate(0%, -50%)",
          width: 36,
          height: 36,
          borderRadius: "18px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOnEdit("pending");
        }}
      >
        <Icon
          src="close"
          color="red"
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
            height: "24px",
            width: "24px",
          }}
        />
      </IconButton>
    </div>
  );
};
const EducationTag = ({
  index,
  icon,
  text,
  degree,
  institution,
  grade,
  specialization,
  startDate,
  endDate,
}) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { delete_education_row } = useContext(DraftResumeFormContext);
  const { onEdit, setOnEdit } = useContext(NameCardContext);
  const [onHover, setOnHover] = useState(false);
  const [onEditing, setOnEditing] = useState(false);
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (onEdit === "edit_education_" + String(index)) {
      setOnEditing(true);
    } else {
      setOnEditing(false);
    }
  }, [onEdit]);
  useEffect(() => {
    if (onHover) {
      setStyle({
        width: onEdit !== "none" ? "72px" : "60px",
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
  }, [onHover, onEdit]);

  const remove_under_score_and_capitalize = (text) => {
    return text
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (onEdit === "none") {
    return (
      <div
        className="contact-info-tag"
        style={{
          transition: "all 0.2s ease",
          position: "relative",
          maxWidth: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "2px 8px",
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
            transition: "all 0.2s ease",
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
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              delete_education_row(index);
            }}
          >
            <Icon
              src={"delete"}
              style={{
                width: "18px",
                height: "18px",
                position: "absolute",
                top: "50%",
                right: "0px",
                transform: "translate(-50%, -50%)",
                pointerEvents: style.pointerEvents,
              }}
              color={"red"}
            />
          </div>
          <div
            onClick={() => {
              setOnEdit("edit_education_" + String(index));
            }}
          >
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
  } else if (onEditing) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          marginTop: "8px",
          marginBottom: "8px",
        }}
      >
        <EducationEditTag id={null} index={index} />
      </div>
    );
  } else {
    return (
      <div
        style={{
          transition: "all 0.2s ease",
          position: "relative",
          width: "100%",
          height: "70px",
          display: "inline-flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: "6px",
          padding: "2px 8px",
          borderRadius: "16px",
          marginRight: "6px",
          marginTop: "6px",
          marginBottom: "6px",
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
            position: "absolute",
            top: 2,
            left: 2,
            width: "24px",
            height: "24px",
            opacity: 0.72,
          }}
          color={theme ? theme.font.color : "#000000"}
        />
        <span
          style={{
            position: "absolute",
            fontFamily: "Jost",
            top: 2,
            left: 36,
            right: 0,
            flex: "1 1 auto",
            fontSize: "16px",
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
          {remove_under_score_and_capitalize(degree)}
        </span>
        <span
          className="contact-info-text"
          style={{
            position: "absolute",
            fontFamily: "Jost",
            top: 24,
            left: 36,
            right: 0,
            flex: "1 1 auto",
            fontSize: "14px",
            color: theme ? theme.font.color : "#000000",
            opacity: 0.5,

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",

            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
          }}
        >
          {specialization}
        </span>
        <span
          className="contact-info-text"
          style={{
            position: "absolute",
            fontFamily: "Jost",
            top: 45,
            left: 36,
            right: 0,
            flex: "1 1 auto",
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
          {"@" + institution}
        </span>
        <span
          className="contact-info-text"
          style={{
            position: "absolute",
            fontFamily: "Jost",
            top: 64,
            left: 36,
            right: 0,
            flex: "1 1 auto",
            fontSize: "14px",
            color: theme ? theme.font.color : "#000000",
            opacity: 0.5,

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",

            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
          }}
        >
          {startDate
            ? dayjs(startDate).format("MM/YYYY") +
              (endDate ? " - " + dayjs(endDate).format("MM/YYYY") : "")
            : "N/A"}
        </span>
        <div
          style={{
            transition: "all 0.2s ease",
            position: "absolute",
            top: -6,
            right: -6,
            width: style.width,
            height: "calc(100% + 12px)",
            zIndex: 1,
            backdropFilter: "blur(8px)",
            opacity: style.opacity,
          }}
        >
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              delete_education_row(index);
            }}
          >
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
          <div
            onClick={() => {
              setOnEdit("edit_education_" + String(index));
            }}
          >
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
  }
};
const EducationSection = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { onEdit, setOnEdit } = useContext(NameCardContext);
  const { formData } = useContext(DraftResumeFormContext);

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
          fontSize: onEdit === "none" ? "20px" : "32px",
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
            index={index}
            icon={"education"}
            text={`${item.degree + " @ " + item.institution}`}
            degree={item.degree}
            institution={item.institution}
            grade={item.grade}
            specialization={item.specialization}
            startDate={item.startDate}
            endDate={item.endDate}
          />
        </div>
      ))}
      <div
        style={{
          transition: "all 0.2s ease",
          position: "relative",
          width: onEdit !== "add_education" ? 36 : "100%",
          display: "block",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "18px",
          backgroundColor:
            onEdit !== "add_education"
              ? theme
                ? theme.backgroundColor
                : "rgba(0, 0, 0, 0.04)"
              : "transparent",
          marginTop: onEdit !== "add_education" ? "0px" : "6px",
          marginBottom: onEdit !== "add_education" ? "2px" : "0px",
          border:
            onEdit !== "add_education"
              ? onThemeMode === "dark_mode"
                ? "1px solid rgba(255, 255, 255, 0.16)"
                : "1px solid rgba(0, 0, 0, 0.16)"
              : "none",
          cursor: "pointer",
        }}
        onClick={() => {
          if (onEdit === "add_education") {
          } else {
            setOnEdit("add_education");
          }
        }}
      >
        {onEdit === "add_education" ? (
          <EducationEditTag id={null} index={null} />
        ) : (
          <div>
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
        )}
      </div>
    </div>
  );
};
const ExperienceTag = ({ icon, text }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { setOnEdit } = useContext(NameCardContext);
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
        transition: "all 0.2s ease",
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
          transition: "all 0.2s ease",
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
        <div
          onClick={() => {
            setOnEdit("add_experience");
          }}
        >
          <Icon
            src={"edit"}
            style={{
              width: "18px",
              height: "18px",
              position: "absolute",
              top: "52%",
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
  const { onEdit } = useContext(NameCardContext);
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
          fontSize: onEdit === "none" ? "20px" : "32px",
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
          transition: "all 0.2s ease",
          position: "relative",
          width: onEdit !== "add_experience" ? 36 : "100%",
          display: "block",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "18px",
          backgroundColor:
            onEdit !== "add_experience"
              ? theme
                ? theme.backgroundColor
                : "rgba(0, 0, 0, 0.04)"
              : "transparent",
          marginTop: onEdit !== "add_experience" ? "0px" : "6px",
          marginBottom: onEdit !== "add_experience" ? "2px" : "0px",
          border:
            onEdit !== "add_experience"
              ? onThemeMode === "dark_mode"
                ? "1px solid rgba(255, 255, 255, 0.16)"
                : "1px solid rgba(0, 0, 0, 0.16)"
              : "none",
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
const NameCard = () => {
  const { theme, onThemeMode, DialogTransition } = useContext(ConfigContext);
  const { formData } = useContext(DraftResumeFormContext);
  const [onEdit, setOnEdit] = useState("none");

  return (
    <NameCardContext.Provider value={{ onEdit, setOnEdit }}>
      <>
        <div
          style={{
            transition: "all 0.2s ease",
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
            {onEdit === "none" ? (
              <>
                <ContactSection />
                <EducationSection />
                <ExperienceSection />
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  width: "100%",
                }}
              >
                <Skeleton variant="rounded" animation="wave" height={160} />
                <Skeleton variant="rounded" animation="wave" height={20} />
                <Skeleton variant="rounded" animation="wave" height={20} />
              </Box>
            )}
          </div>
        </div>
        <Dialog
          open={onEdit !== "none"}
          onClose={() => {
            setOnEdit("none");
          }}
          slots={{
            transition: DialogTransition,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              height: "792px",
              width: "490px",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
          onClick={(e) => {
            // setOnEdit("pending");
          }}
        >
          <DialogContent>
            <div
              style={{
                transition: "all 0.2s ease",
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
                    onThemeMode === "dark_mode"
                      ? satisfied_light
                      : satisfied_dark
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <ContactSection />
                  <EducationSection />
                  <ExperienceSection />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </NameCardContext.Provider>
  );
};

export default NameCard;
