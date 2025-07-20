import { useContext } from "react";

import satisfied_dark from "./satisfied_dark.png";
import satisfied_light from "./satisfied_light.png";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
import { DraftResumeFormContext } from "./draft_resume_form";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: "none",
  boxShadow: "none",
  borderRadius: "10px",
  "&::before": {
    display: "none",
  },
  "&.Mui-expanded": {
    boxShadow: "none",
    border: `1px solid ${theme.palette.divider}`,
  },
}));
const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  minHeight: 36,
  padding: `0 ${theme.spacing(2)}`,
  backgroundColor: "transparent",
  boxShadow: "none",
  "&.Mui-expanded": {
    backgroundColor: "rgba(0,0,0,.03)",
    boxShadow: "none",
  },

  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const InfoRow = ({ label, value }) => {
  const { theme } = useContext(ConfigContext);
  return (
    <Accordion>
      <AccordionSummary
        aria-controls="panel-content"
        id="panel-header"
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      >
        <span
          style={{
            fontFamily: "Jost",
            fontSize: "18px",
            color: theme ? theme.font.color : "#000000",
          }}
        >
          {label}
        </span>
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        malesuada lacus ex, sit amet blandit leo lobortis eget.
      </AccordionDetails>
    </Accordion>
  );
};
const InfoSection = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: "0px",
        marginRight: "8px",
        marginBottom: "16px",
        padding: "2px",
        gap: "8px",
      }}
    >
      {/* <InfoRow label="Contact" value="example@example.com" />
      <InfoRow label="Email" value="example@example.com" />
      <InfoRow label="Email" value="example@example.com" /> */}
    </div>
  );
};

const NameCard = () => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const { formData } = useContext(DraftResumeFormContext);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",

        backgroundColor: theme ? theme.foregroundColor : "#FFFFFF",
        border:
          onThemeMode === "dark_mode"
            ? "1px solid rgba(255, 255, 255, 0.16)"
            : "none",
        borderRadius: "8px",
        boxShadow: "0 0px 8px rgba(0, 0, 0, 0.16)",
      }}
    >
      <div
        className="scrolling-space-v"
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          width: "calc(100% - 16px)",
          height: "calc(100% - 16px)",
          overflowX: "hidden",
          overflowY: "scroll",
        }}
      >
        <img
          src={onThemeMode === "dark_mode" ? satisfied_light : satisfied_dark}
          alt="satisfied"
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
          }}
        />
        <span
          className="name-card-name-title"
          style={{
            position: "relative",
            marginLeft: "50px",
            fontFamily: "Jost",
            fontSize: "32px",
            color: theme ? theme.font.color : "#000000",
          }}
        >
          {formData?.first_name} {formData?.last_name}
        </span>
        <InfoSection />
      </div>
    </div>
  );
};

export default NameCard;
