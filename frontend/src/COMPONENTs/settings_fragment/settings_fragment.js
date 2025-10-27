import {
  useState,
  useContext,
  Fragment,
  createContext,
  useEffect,
} from "react";

import Dialog from "@mui/material/Dialog";
import Explorer from "../../BUILTIN_COMPONENTs/explorer/explorer";
import IconButton from "../../MATERIAL_COMPONENTs/icon_button/icon_button";
import ProfileSection from "./profile_section";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const SettingsFragmentContext = createContext();

const default_settings_fragment_size = {
  width: "1200px",
  height: "520px",
};

const Context = () => {
  const { selectedKey } = useContext(SettingsFragmentContext);
  const [component, setComponent] = useState(null);

  useEffect(() => {
    switch (selectedKey) {
      case "profile":
        setComponent(<ProfileSection />);
        break;
      default:
        setComponent(<div></div>);
        break;
    }
  }, [selectedKey]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "28%",
        height: "100%",
        width: "72%",
      }}
    >
      {component}
    </div>
  );
};
const SideMenu = () => {
  const { onThemeMode } = useContext(ConfigContext);
  const { handle_dialog_close, side_menu_items, selectedKey, setSelectedKey } =
    useContext(SettingsFragmentContext);

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "28%",
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
      <Explorer
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          width: "100%",
        }}
        items={side_menu_items}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />
    </div>
  );
};

const SettingsFragment = ({ children }) => {
  const { theme, onThemeMode, DialogTransition } = useContext(ConfigContext);

  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const side_menu_items = [
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
      icon: "lock",
      label: "Account",
    },
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
        selectedKey,
        setSelectedKey,
        side_menu_items,
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
              width: default_settings_fragment_size.width,
              height: default_settings_fragment_size.height,
              borderRadius: "10px",
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
              border:
                onThemeMode === "dark_mode"
                  ? "1px solid rgba(255, 255, 255, 0.16)"
                  : "none",
              borderRadius: "10px",
            }}
          >
            <Context />
            <SideMenu />
          </div>
        </Dialog>
      </Fragment>
    </SettingsFragmentContext.Provider>
  );
};

export default SettingsFragment;
