import { useContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import ConfigPanel from "../../JOY_COMPONENTs/config_panel/config_panel";
import { Select } from "../../JOY_COMPONENTs/config_panel/config_panel";

const GeneralPage = () => {
  const {
    onThemeMode,
    setOnThemeMode,
    syncWithSystemTheme,
    setSyncWithSystemTheme,
  } = useContext(ConfigContext);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
      }}
    >
      <ConfigPanel
        title="General"
        structure={[
          {
            label: "system theme",
            component: Select,
            props: {
              defaultValue: "sync_with_browser",
              value: syncWithSystemTheme ? "sync_with_browser" : onThemeMode,
              onchange: (event, value) => {
                if (value === "sync_with_browser") {
                  setSyncWithSystemTheme(true);
                } else {
                  setSyncWithSystemTheme(false);
                  setOnThemeMode(value);
                }
              },
              options: [
                { value: "light_mode", label: "Light mode" },
                { value: "dark_mode", label: "Dark mode" },
                { value: "sync_with_browser", label: "Sync with browser" },
              ],
            },
            style: {
              fontFamily: "Jost",
              fontSize: 16,
            },
          },
        ]}
      />
      <div></div>
    </div>
  );
};

export default GeneralPage;
