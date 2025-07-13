import { useEffect, useContext } from "react";
import { ConfigContext } from "../../CONTAINERs/config/context";

const ScrollingSpace = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);

  useEffect(() => {
    const styleElement = document.createElement("style");
    const scrollingSpace = theme?.scrollingSpace || {};

    styleElement.innerHTML = `
    .scrolling-space-v::-webkit-scrollbar {
      width: 8px;
    }
    .scrolling-space-v::-webkit-scrollbar-track {
      background-color: rgb(225, 225, 225, 0);
    }
    .scrolling-space-v::-webkit-scrollbar-thumb {
      background-color: ${scrollingSpace.backgroundColor || "#CCCCCC00"};
      border-radius: 6px;
      border: ${scrollingSpace.border || "2px solid transparent"};
    }
    .scrolling-space-v::-webkit-scrollbar-thumb:hover {
    }
    .scrolling-space-v::-webkit-scrollbar:horizontal {
      display: none;
    }
  `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [theme, onThemeMode]);
};

export default ScrollingSpace;
