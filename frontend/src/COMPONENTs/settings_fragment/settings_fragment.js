import { useState, useContext, Fragment, createContext } from "react";

import Dialog from "@mui/material/Dialog";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import IconButton from "../../MATERIAL_COMPONENTs/icon_button/icon_button";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const SettingsFragmentContext = createContext();

const SideMenuItem = ({ item }) => {
  const { theme } = useContext(ConfigContext);

  return (
    <div
      key={item.key}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "6px",
        margin: "8px",
        cursor: "pointer",
        borderRadius: "10px",
        // background: theme?.foregroundColor || "#FFFFFF",
      }}
    >
      <Icon
        src={item.icon}
        style={{
          width: 18,
          height: 18,
          marginRight: 12,
        }}
      />
      <span
        style={{
          fontFamily: "Jost",
          fontSize: 15,
          color: theme?.font.color || "#21252b",
        }}
      >
        {item.label}
      </span>
    </div>
  );
};
const SideMenu = () => {
  const { onThemeMode } = useContext(ConfigContext);
  const { handle_dialog_close, side_menu_structure } = useContext(
    SettingsFragmentContext
  );

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "30%",
        backgroundColor:
          onThemeMode === "dark_mode"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
      }}
    >
      <IconButton
        src="close"
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          width: 32,
          height: 32,
        }}
        onClick={handle_dialog_close}
      />
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          width: "100%",
        }}
      >
        {side_menu_structure.map((item, index) => (
          <SideMenuItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

const SettingsFragment = ({ children }) => {
  const { theme, DialogTransition } = useContext(ConfigContext);
  const [open, setOpen] = useState(false);
  const side_menu_structure = [
    {
      key: "general",
      icon: "settings",
      label: "General",
    },
    {
      key: "profile",
      icon: "user",
      label: "Profile",
    },
    {
      key: "account",
      icon: "key",
      label: "Account",
    }
  ];
  const handle_dialog_open = () => {
    setOpen(true);
  };
  const handle_dialog_close = () => {
    setOpen(false);
  };

  return (
    <SettingsFragmentContext.Provider
      value={{
        open,
        handle_dialog_open,
        handle_dialog_close,
        side_menu_structure,
      }}
    >
      <Fragment>
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handle_dialog_open();
          }}
        >
          {children}
        </div>
        <Dialog
          open={open}
          onClose={handle_dialog_close}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          // use TransitionComponent for MUI Dialog transition
          TransitionComponent={DialogTransition}
          PaperProps={{
            sx: {
              width: 807,
              height: 500,
              borderRadius: "14px",
            },
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              backgroundColor: theme?.foregroundColor || "#FFFFFF",
              borderRadius: "14px",
            }}
          >
            <SideMenu />
          </div>
        </Dialog>
      </Fragment>
    </SettingsFragmentContext.Provider>
  );
};

export default SettingsFragment;
