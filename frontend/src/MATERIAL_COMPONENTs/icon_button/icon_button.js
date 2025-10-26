import MaterialIconButton from "@mui/material/IconButton";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

const IconButton = ({ src, style, onClick }) => {
  return (
    <div
      style={{
        ...style,
      }}
    >
      <Icon
        src={src}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "64%",
          height: "64%",
        }}
      />
      <MaterialIconButton
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}
        onClick={onClick}
      ></MaterialIconButton>
    </div>
  );
};

export default IconButton;
