import { useContext, useRef, createRef, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import { LightSwitch } from "../../BUILTIN_COMPONENTs/switch/switch";

const default_margin = 30;
const highlighter_margin_top = 4;
const highlighter_margin_left = 12;

const HoverHighlightor = ({ hoveredItem, hoveredIndex, position, size }) => {
  const { onThemeMode } = useContext(ConfigContext);
  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        top: position.top,
        left: position.left,
        width: hoveredItem === "light switch" ? size.width - 18 : size.width,
        height: hoveredItem === "light switch" ? size.height - 4 : size.height,
        backgroundColor: onThemeMode === "dark_mode" ? "#ffffff" : "#000000",
        opacity:
          hoveredIndex === null || hoveredIndex === undefined
            ? 0
            : onThemeMode === "dark_mode"
            ? hoveredItem === "light switch" ? 0.12 : 0.08
            : 0.12,
        borderRadius: hoveredItem === "light switch" ? "32px" : "8px",
        pointerEvents: "none",
      }}
    ></div>
  );
};
const TopMenu = ({ items = [] }) => {
  const { theme, onThemeMode, windowSize } = useContext(ConfigContext);
  const itemRefs = useRef([]);
  itemRefs.current = items.map((_, i) => itemRefs.current[i] || createRef());

  const [navigateTo, setNavigateTo] = useState(null);
  const [itemPositions, setItemPositions] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: windowSize.width,
  });
  const [highlightSize, setHighlightSize] = useState({ width: 50, height: 50 });

  useEffect(() => {
    const positions = {};
    itemRefs.current.forEach((ref, index) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        positions[items[index]] = {
          right: rect.right + default_margin,
        };
      }
    });
    setItemPositions(positions);
  }, [items]);
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
            onMouseEnter={() => setHoveredIndex(index)}
          >
            {item === "light switch" ? (
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
            ) : (
              item
            )}
          </div>
        ))}
      </div>
      <HoverHighlightor
        hoveredItem={items[hoveredIndex]}
        hoveredIndex={hoveredIndex}
        position={highlightPosition}
        size={highlightSize}
      />
      {navigateTo && <Navigate to={navigateTo} />}
    </div>
  );
};

export default TopMenu;
