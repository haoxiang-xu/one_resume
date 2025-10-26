import { Fragment as ReactFragment, useState, useContext } from "react";

import Dialog from "@mui/material/Dialog";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const Fragment = ({ children }) => {
  const { theme, DialogTransition } = useContext(ConfigContext);
  const [open, setOpen] = useState(false);
  const handle_dialog_open = () => {
    setOpen(true);
  };
  const handle_dialog_close = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <div
        style={{
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handle_dialog_open();
        }}
      ></div>
      <Dialog
        open={open}
        onClose={handle_dialog_close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slots={{
          transition: DialogTransition,
        }}
        PaperProps={{
          sx: {
            width: "500px",
            height: "500px",
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
          {children}
        </div>
      </Dialog>
    </Fragment>
  );
};

export default Fragment;
