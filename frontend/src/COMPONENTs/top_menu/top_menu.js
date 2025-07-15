import { useContext, useRef, createRef, useState, useEffect, use } from "react";
import { ConfigContext } from "../../CONTAINERs/config/context";

const default_margin = 30;
const highlighter_margin_top = 4;
const highlighter_margin_left = 12;

const HoverHighlightor = ({ hoveredItem, position, size }) => {
  const { onThemeMode } = useContext(ConfigContext);
  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        top: position.top,
        left: position.left,
        width: size.width,
        height: size.height,
        backgroundColor:
          onThemeMode === "dark_mode" ? "#ffffffff" : "#ffffffff",
        opacity: hoveredItem === null || hoveredItem === undefined ? 0 : 0.08,
        borderRadius: "8px",
        pointerEvents: "none",
      }}
    ></div>
  );
};
const TopMenu = ({ items = [] }) => {
  const { theme, windowSize } = useContext(ConfigContext);
  const itemRefs = useRef([]);
  itemRefs.current = items.map((_, i) => itemRefs.current[i] || createRef());

  const [itemPositions, setItemPositions] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
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
    if (hoveredItem !== null && itemRefs.current[hoveredItem]) {
      const rect =
        itemRefs.current[hoveredItem].current.getBoundingClientRect();
      setHighlightPosition({
        top:
          rect.top -
          highlighter_margin_top +
          (rect.height + highlighter_margin_top * 2) / 2,
        left: rect.left - highlighter_margin_left + (rect.width + highlighter_margin_left * 2) / 2,
      });
      setHighlightSize({
        width: rect.width + highlighter_margin_left * 2,
        height: rect.height + highlighter_margin_top * 2,
      });
    }
  }, [hoveredItem]);

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
        onMouseLeave={() => setHoveredItem(null)}
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
            }}
            onClick={() => {
              if (item === "sign up") {
                window.location.href = "/register";
              } else if (item === "login") {
                window.location.href = "/auth";
              }
            }}
            onMouseEnter={() => setHoveredItem(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <HoverHighlightor
        hoveredItem={hoveredItem}
        position={highlightPosition}
        size={highlightSize}
      />
    </div>
  );
};

export default TopMenu;
