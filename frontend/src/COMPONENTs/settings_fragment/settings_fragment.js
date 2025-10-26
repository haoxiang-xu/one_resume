import { useState, useContext, Fragment, createContext } from "react";

import Dialog from "@mui/material/Dialog";
import IconButton from "../../MATERIAL_COMPONENTs/icon_button/icon_button";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const SettingsFragmentContext = createContext();

const SideMenu = () => {
  const { onThemeMode } = useContext(ConfigContext);
  const { handle_dialog_close } = useContext(SettingsFragmentContext);

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "32%",
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
          cursor: "pointer",
        }}
        onClick={handle_dialog_close}
      />
    </div>
  );
};

const SettingsFragment = ({ children }) => {
  const { theme, onThemeMode, DialogTransition } = useContext(ConfigContext);
  const [open, setOpen] = useState(false);
  const handle_dialog_open = () => {
    setOpen(true);
  };
  const handle_dialog_close = () => {
    setOpen(false);
  };

  return (
    <SettingsFragmentContext.Provider
      value={{ open, handle_dialog_open, handle_dialog_close }}
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
              width: 500,
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
