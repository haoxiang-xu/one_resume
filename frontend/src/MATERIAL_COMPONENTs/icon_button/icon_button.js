import MaterialIconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

const default_icon_button_size = {
  width: 32,
  height: 32,
};
const default_border_radius = "6px";
const default_font_size = "14px";

const IconButton = ({
  src,
  style,
  prefixLabel,
  postfixLabel,
  variant,
  color,
  ariaLabel,
  disabled,
  onClick,
}) => {
  if (prefixLabel) {
    return (
      <div>
        <Button
          variant={variant ? variant : "text"}
          sx={{
            position: style?.position || "relative",
            display: style?.display || "flex",

            top: style?.top || "auto",
            left: style?.left || "auto",
            bottom: style?.bottom || "auto",
            right: style?.right || "auto",

            padding: style?.padding || "4px 8px 4px 8px",
            mt: 1,
            borderRadius: style?.borderRadius || default_border_radius,

            textTransform: "none",
            fontFamily: style?.fontFamily ? style.fontFamily : "inherit",
            fontSize: style?.fontSize ? style.fontSize : default_font_size,
            fontWeight: style?.fontWeight ? style.fontWeight : "inherit",
          }}
          color={color ? color : "inherit"}
          aria-label={ariaLabel ? ariaLabel : "icon button"}
          disabled={disabled ? disabled : false}
          onClick={onClick}
        >
          <Icon
            src={src}
            style={{
              width: style?.icon?.width
                ? style.icon.width
                : style?.height
                ? `${style.height * 0.64}px`
                : `${default_icon_button_size.height * 0.5}px`,
              height: style?.icon?.height
                ? style.icon.height
                : style?.height
                ? `${style.height * 0.64}px`
                : `${default_icon_button_size.height * 0.5}px`,
              marginRight: style?.icon?.marginRight || "8px",
            }}
          />
          {prefixLabel}
        </Button>
      </div>
    );
  } else if (postfixLabel) {
    return (
      <div>
        <Button
          variant={variant ? variant : "text"}
          sx={{
            position: style?.position || "relative",
            display: style?.display || "flex",

            top: style?.top || "auto",
            left: style?.left || "auto",
            bottom: style?.bottom || "auto",
            right: style?.right || "auto",

            padding: style?.padding || "4px 8px 4px 8px",
            mt: 1,
            borderRadius: style?.borderRadius || default_border_radius,

            textTransform: "none",
            fontFamily: style?.fontFamily ? style.fontFamily : "inherit",
            fontSize: style?.fontSize ? style.fontSize : default_font_size,
            fontWeight: style?.fontWeight ? style.fontWeight : "inherit",
          }}
          color={color ? color : "inherit"}
          aria-label={ariaLabel ? ariaLabel : "icon button"}
          disabled={disabled ? disabled : false}
          onClick={onClick}
        >
          {postfixLabel}
          <Icon
            src={src}
            style={{
              width: style?.icon?.width
                ? style.icon.width
                : style?.height
                ? `${style.height * 0.64}px`
                : `${default_icon_button_size.height * 0.5}px`,
              height: style?.icon?.height
                ? style.icon.height
                : style?.height
                ? `${style.height * 0.64}px`
                : `${default_icon_button_size.height * 0.5}px`,
              marginLeft: style?.icon?.marginLeft || "8px",
            }}
          />
        </Button>
      </div>
    );
  } else {
    return (
      <div
        style={{
          ...style,
          width: style?.width || default_icon_button_size.width,
          height: style?.height || default_icon_button_size.height,
        }}
      >
        <Icon
          src={src}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: style.icon?.width
              ? style.icon.width
              : style?.width
              ? `${style.width * 0.64}px`
              : `${default_icon_button_size.width * 0.5}px`,
            height: style.icon?.height
              ? style.icon.height
              : style?.height
              ? `${style.height * 0.64}px`
              : `${default_icon_button_size.height * 0.5}px`,
          }}
        />
        <MaterialIconButton
          aria-label={ariaLabel ? ariaLabel : "icon button"}
          disabled={disabled ? disabled : false}
          variant={variant ? variant : "text"}
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
  }
};

export default IconButton;
