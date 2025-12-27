import { useState, useEffect } from "react";

/* { ENVIRONMENT LISTENERs } ------------------------------------------------------------------------------------ */
const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark_mode"
      : "light_mode"
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setSystemTheme(e.matches ? "dark_mode" : "light_mode");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return systemTheme;
};
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth || 0,
    height: window.innerHeight || 0,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return mousePosition;
};
const useWebBrowser = () => {
  const [envBrowser, setEnvBrowser] = useState(null);
  useEffect(() => {
    const getBrowserName = () => {
      const userAgent = navigator.userAgent;

      if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
      } else if (
        userAgent.indexOf("Opera") > -1 ||
        userAgent.indexOf("OPR") > -1
      ) {
        return "Opera";
      } else if (userAgent.indexOf("Trident") > -1) {
        return "Internet Explorer";
      } else if (userAgent.indexOf("Edge") > -1) {
        return "Edge";
      } else if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
      } else if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
      } else {
        return "Unknown";
      }
    };
    setEnvBrowser(getBrowserName());
  }, []);
  return envBrowser;
};
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("desktop");
  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = navigator.userAgent;
      if (
        /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        )
      ) {
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
    };
    checkDeviceType();
  }, []);
  return deviceType;
};
/* { ENVIRONMENT LISTENERs } ------------------------------------------------------------------------------------ */

export {
  useSystemTheme,
  useWindowSize,
  useMousePosition,
  useWebBrowser,
  useDeviceType,
};
