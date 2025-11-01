import { useContext, useEffect } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import { CssBaseline, Select, Option } from "@mui/joy";
import { selectClasses } from "@mui/joy/Select";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const ConfigPanelTitle = ({ label, style }) => {
  const { onThemeMode } = useContext(ConfigContext);
  return (
    <div
      style={{
        marginLeft: 24,
        marginRight: 24,
        marginTop: 24,
        borderBottom: style?.title?.borderBottom
          ? style.title.borderBottom
          : onThemeMode === "dark_mode"
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : "1px solid rgba(0, 0, 0, 0.2)",
      }}
    >
      <span
        style={{
          fontFamily: style?.title?.fontFamily
            ? style.title.fontFamily
            : "Jost",
          fontSize: style?.title?.fontSize ? style.title.fontSize : 32,
        }}
      >
        {label}
      </span>
    </div>
  );
};
const ConfigPanelSelect = ({ label, props = {}, style }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 42,
        margin: "16px 25px",
        ...style,
      }}
    >
      <span
        style={{
          userSelect: "none",
          webkitUserSelect: "none",
          mozUserSelect: "none",
          msUserSelect: "none",

          fontFamily: style?.fontFamily ? style.fontFamily : "inherit",
          fontSize: style?.fontSize ? style.fontSize : "inherit",
        }}
      >
        {label || "Select"}
      </span>
      <Select
        defaultValue={props.defaultValue ?? ""}
        placeholder={props.placeholder || "Select an option"}
        indicator={<KeyboardArrowDown />}
        sx={{
          fontFamily: style?.fontFamily || "inherit",
          fontSize: style?.fontSize || "inherit",
          [`& .${selectClasses.indicator}`]: {
            transition: "0.2s",
            [`&.${selectClasses.expanded}`]: {
              transform: "rotate(-180deg)",
            },
          },
        }}
        slotProps={{
          listbox: {
            disablePortal: false,
            sx: {
              zIndex: 1600,
              maxHeight: 320,
              fontFamily: style?.fontFamily || "inherit",
              fontSize: style?.fontSize || "inherit",
            },
          },
        }}
      >
        {(props.options || []).map((option, i) => (
          <Option key={i} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};
const ThemeModeSync = () => {
  const { onThemeMode } = useContext(ConfigContext);
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    if (onThemeMode === "dark_mode" && mode !== "dark") {
      setMode("dark");
    } else if (onThemeMode === "light_mode" && mode !== "light") {
      setMode("light");
    }
  }, [onThemeMode, mode, setMode]);

  return null;
};

const ConfigPanel = ({ title, structure, style }) => {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <div>
        <ConfigPanelTitle label={title} style={style} />
        {structure.map((item, index) => {
          const Component = item.component;
          return (
            <Component
              key={index}
              label={item.label}
              props={item.props}
              style={item.style}
            />
          );
        })}
        <ThemeModeSync />
      </div>
    </CssVarsProvider>
  );
};

export default ConfigPanel;
export { ConfigPanelSelect as Select };
