import * as React from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "Verify Your Details",
    description:
      "Confirm your contact info, employment dates, and key achievements so we start with perfectly accurate data.",
  },
  {
    label: "Share the Job Posting",
    description:
      "Paste the role title and full description; we’ll pull out keywords and align your resume to the employer’s needs.",
  },
  {
    label: "Finalize Your Resume",
    description:
      "Review the tailored draft, tweak wording or layout, and download a polished, application-ready PDF.",
  },
];

const FormStepper = () => {
  const { theme } = React.useContext(ConfigContext);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 120,
        left: 60,
        width: `calc(50% - 120px)`,
        bottom: 0,
        padding: 2,
      }}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              sx={{
                opacity: activeStep === index ? 1 : 0.5,
                transition: "all .25s ease",

                "& .MuiStepLabel-label": {
                  fontFamily: "Jost",
                  fontSize: activeStep === index ? "20px" : "14px",
                  color: theme ? theme.font.color : "#000",
                  letterSpacing: "0.5px",
                },
              }}
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <span
                style={{
                  position: "relative",
                  top: 0,
                  left: 0,
                  width: "100%",
                  fontFamily: "Jost",
                  fontSize: "14px",
                  opacity: 0.64,
                }}
              >
                {step.description}
              </span>
              <div
                style={{
                  position: "relative",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 200,
                  marginTop: 16,
                  marginBottom: 16,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              ></div>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{
                    mt: 1,
                    mr: 1,
                    borderRadius: "10px",
                    textTransform: "none",
                  }}
                  startIcon={
                    <Icon
                      src="arrow_left"
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  }
                >
                  back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, borderRadius: "10px", textTransform: "none" }}
                  endIcon={
                    <Icon
                      src="arrow_right"
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  }
                >
                  {index === steps.length - 1 ? "finish" : "continue"}
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
};
const ResumeForm = () => {
  const { theme } = React.useContext(ConfigContext);
  return (
    <div
      className="resume-form"
      style={{
        position: "absolute",
        top: 60,
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 0,
        width: "100%",
        maxWidth: "1300px",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          fontFamily: "Jost",
          fontSize: "36px",
          color: theme ? theme.font.color : "#000",
        }}
      >
        Quick Draft
      </span>
      <FormStepper />
    </div>
  );
};

export default ResumeForm;
