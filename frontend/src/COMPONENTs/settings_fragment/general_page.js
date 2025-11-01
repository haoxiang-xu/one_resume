import { styled } from "@mui/joy";
import ConfigPanel from "../../JOY_COMPONENTs/config_panel/config_panel";
import { Select } from "../../JOY_COMPONENTs/config_panel/config_panel";

const GeneralPage = () => {
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
              defaultValue: "sync with system",
              options: [
                { value: "light_mode", label: "Light mode" },
                { value: "dark_mode", label: "Dark mode" },
                { value: "sync_with_system", label: "Sync with system" },
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
