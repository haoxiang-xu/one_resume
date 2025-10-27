import {
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const ExplorerContext = createContext();

const default_explorer_item_height = 36;
const default_explorer_item_border_radius = 6;

const HoverHighlightor = () => {
  const { onThemeMode } = useContext(ConfigContext);
  const {
    hoveredKey,
    selectedKey,
    get_item_top_position_by_key,
    get_item_style_by_key,
  } = useContext(ExplorerContext);

  return (
    <div
      style={{
        transition: "all 0.24s cubic-bezier(0.72, -0.16, 0.2, 1.16)",
        position: "absolute",
        top: hoveredKey
          ? get_item_top_position_by_key(hoveredKey)
          : get_item_top_position_by_key(selectedKey),
        left: 6,
        width: "calc(100% - 12px)",
        height: hoveredKey
          ? get_item_style_by_key(hoveredKey)?.height ||
            default_explorer_item_height
          : get_item_style_by_key(selectedKey)?.height ||
            default_explorer_item_height,
        backgroundColor:
          onThemeMode === "dark_mode" ? "#ffffff1f" : "#0000001f",
        backdropFilter: "blur(24px)",
        opacity: hoveredKey === null && selectedKey === null ? 0 : 1,
        borderRadius: default_explorer_item_border_radius,
        pointerEvents: "none",
      }}
    ></div>
  );
};
const ExplorerItem = ({ item }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const {
    setHoveredKey,
    selectedKey,
    setSelectedKey,
    get_item_top_position_by_key,
  } = useContext(ExplorerContext);

  return (
    <div
      style={{
        position: "absolute",
        top: get_item_top_position_by_key(item.key),
        left: 6,
        width: "calc(100% - 12px)",
        height: item?.style?.height || default_explorer_item_height,
        display: "flex",
        alignItems: "center",
        paddingLeft: item?.style?.paddingLeft || 13,
        borderRadius: item?.style?.borderRadius || default_explorer_item_border_radius,
        cursor: "pointer",
        ...item?.style,
        backgroundColor:
          selectedKey === item.key
            ? item?.style?.backgroundColor ||
              (onThemeMode === "dark_mode" ? "#ffffff0a" : "#0000000e")
            : "transparent",
      }}
      onMouseEnter={() => {
        setHoveredKey(item.key);
      }}
      onClick={() => {
        setSelectedKey(item.key);
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
          fontFamily: item?.style?.fontFamily || theme?.font.family || "Jost",
          fontSize: 15,
          color: item?.style?.fontColor || theme?.font.color || "#21252b",
          userSelect: "none",
        }}
      >
        {item.label}
      </span>
    </div>
  );
};

const Explorer = ({ items, selectedKey, setSelectedKey, ...props }) => {
  const [hoveredKey, setHoveredKey] = useState(null);

  const get_item_top_position_by_key = useCallback(
    (key) => {
      let top = 0;
      for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) {
          break;
        }
        top += items[i]?.style?.height || default_explorer_item_height;
      }
      return top;
    },
    [items]
  );
  const get_item_style_by_key = useCallback(
    (key) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) {
          return items[i]?.style || {};
        }
      }
      return {};
    },
    [items]
  );

  return (
    <ExplorerContext.Provider
      value={{
        items,
        hoveredKey,
        setHoveredKey,
        selectedKey,
        setSelectedKey,
        get_item_top_position_by_key,
        get_item_style_by_key,
      }}
    >
      <div
        style={{
          ...props.style,
        }}
        onMouseLeave={() => {
          setHoveredKey(null);
        }}
      >
        <HoverHighlightor />
        {items.map((item, index) => (
          <ExplorerItem key={item.key} index={index} item={item} />
        ))}
      </div>
    </ExplorerContext.Provider>
  );
};

export default Explorer;
