import { useContext, useRef, createRef, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { LightSwitch } from "../../BUILTIN_COMPONENTs/switch/switch";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import SettingsFragment from "../settings_fragment/settings_fragment";

const default_margin = 30;
const highlighter_margin_top = 4;
const highlighter_margin_left = 12;

const HoverHighlightor = ({ hoveredItem, hoveredIndex, position, size }) => {
  const { onThemeMode } = useContext(ConfigContext);
  const [style, setStyle] = useState({
    width: 0,
    height: 0,
    opacity: 0,
    borderRadius: "8px",
  });

  useEffect(() => {
    if (hoveredItem === "light switch") {
      setStyle({
        width: size.width - 18,
        height: size.height - 4,
        opacity: onThemeMode === "dark_mode" ? 1 : 1,
        borderRadius: "32px",
      });
    } else if (hoveredItem === "user") {
      setStyle({
        width: size.width - 8,
        height: size.height + 8,
        opacity: onThemeMode === "dark_mode" ? 1 : 1,
        borderRadius: "32px",
      });
    } else {
      setStyle({
        width: size.width,
        height: size.height,
        opacity: onThemeMode === "dark_mode" ? 1 : 1,
        borderRadius: "8px",
      });
    }
  }, [hoveredItem, hoveredIndex, onThemeMode, size]);

  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        top: position.top,
        left: position.left,
        width: style.width,
        height: style.height,
        backgroundColor:
          onThemeMode === "dark_mode" ? "#ffffff27" : "#00000027",
        backdropFilter: "blur(24px)",
        opacity:
          hoveredIndex === null || hoveredIndex === undefined
            ? 0
            : style.opacity,
        borderRadius: style.borderRadius,
        pointerEvents: "none",
      }}
    ></div>
  );
};
const Header = ({ items = [] }) => {
  const { theme, windowSize } = useContext(ConfigContext);
  const itemRefs = useRef([]);
  itemRefs.current = items.map((_, i) => itemRefs.current[i] || createRef());

  const [navigateTo, setNavigateTo] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: windowSize.width,
  });
  const [highlightSize, setHighlightSize] = useState({ width: 50, height: 50 });

  useEffect(() => {
    if (hoveredIndex !== null && itemRefs.current[hoveredIndex]) {
      const rect =
        itemRefs.current[hoveredIndex].current.getBoundingClientRect();
      setHighlightPosition({
        top:
          rect.top -
          highlighter_margin_top +
          (rect.height + highlighter_margin_top * 2) / 2,
        left:
          rect.left -
          highlighter_margin_left +
          (rect.width + highlighter_margin_left * 2) / 2,
      });
      setHighlightSize({
        width: rect.width + highlighter_margin_left * 2,
        height: rect.height + highlighter_margin_top * 2,
      });
    }
  }, [hoveredIndex]);

  const render_item_componet = (item) => {
    if (item === "light switch") {
      return (
        <LightSwitch
          style={{
            width: 70,
            height: 32,
            backgroundColor_on: "#CCCCCC00",
            backgroundColor: "#44464a00",
            color: theme?.font.color || "#21252b",
            boxShadow_on: "none",
            boxShadow: "none",
          }}
        />
      );
    }
    if (item === "user") {
      return (
        <SettingsFragment>
          <Icon
            src="user"
            color={theme?.font.color || "#21252b"}
            style={{ width: 18, height: 18 }}
          />
        </SettingsFragment>
      );
    }
    return item;
  };

  return (
    <div
      className="top-menu"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "60px",
      }}
    >
      <HoverHighlightor
        hoveredItem={items[hoveredIndex]}
        hoveredIndex={hoveredIndex}
        position={highlightPosition}
        size={highlightSize}
      />
      <div
        className="top-menu-items"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingLeft: `${default_margin}px`,
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {items.map((item, index) => (
          <div
            key={item}
            ref={itemRefs.current[index]}
            style={{
              marginRight: default_margin,
              cursor: "pointer",
              fontFamily: "Jost",
              color: theme?.font.color || "#000000",

              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
            onClick={() => {
              if (item === "sign up") {
                setNavigateTo("/register");
              } else if (item === "login") {
                setNavigateTo("/auth");
              }
            }}
            onMouseEnter={() => {
              setHoveredIndex(index);
            }}
          >
            {render_item_componet(item)}
          </div>
        ))}
      </div>
      {navigateTo && <Navigate to={navigateTo} />}
    </div>
  );
};

export default Header;
