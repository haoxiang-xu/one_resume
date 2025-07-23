import * as React from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
import { RequestContext } from "../../CONTAINERs/request/container";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import Resume from "./resume";
import NameCard from "./name_card";
import Icon from "../../BUILTIN_COMPONENTs/icon/icon";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const steps = [
  {
    label: "Verify Your Details",
    description:
      "Edit as you like — your saved profile won't be changed. We'll use these updates to generate the draft you’re about to create.",
  },
  {
    label: "Share the Job Posting",
    description:
      "Paste the role title and full description; we'll pull out keywords and align your resume to the employer's needs.",
  },
  {
    label: "Finalize Your Resume",
    description:
      "Review the tailored draft, tweak wording or layout, and download a polished, application-ready PDF.",
  },
];

const DraftResumeFormContext = React.createContext();

const ResumeContainer = ({
  containerWidth,
  resumeOnFocus,
  setResumeOnFocus,
}) => {
  const [style, setStyle] = React.useState({
    left: "60%",
    width: 470,
    height: 470 * 1.414,
  });

  React.useEffect(() => {
    if (containerWidth >= 1200) {
      setStyle({
        left: "50%",
        width: 517,
        height: 517 * 1.414,
      });
    } else {
      if (resumeOnFocus) {
        setStyle({
          left: "0%",
          width: 490,
          height: 490 * 1.414,
        });
      } else {
        setStyle({
          left: "90%",
          width: 490,
          height: 490 * 1.414,
        });
      }
    }
  }, [containerWidth, resumeOnFocus]);

  return (
    <div
      className="resume-container"
      style={{
        transition: "all 0.36s ease",
        position: "absolute",
        top: 40,
        left: style.left,
        width: style.width,
        height: style.height,
        boxSizing: "border-box",
        zIndex: 1,
      }}
    >
      <Resume />
      {!resumeOnFocus ? (
        <div
          className="on-focus-listener"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
          onClick={() => {
            setResumeOnFocus(true);
          }}
        ></div>
      ) : null}
    </div>
  );
};
const FormStepper = ({ containerWidth }) => {
  const { theme } = React.useContext(ConfigContext);
  const { onNameCardEdit, setOnNameCardEdit } = React.useContext(
    DraftResumeFormContext
  );
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepContent, setStepContent] = React.useState(null);
  const [style, setStyle] = React.useState({
    left: -16,
    width: `calc(90% - 12px)`,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  React.useEffect(() => {
    if (activeStep === 0) {
      setStepContent(null);
      setTimeout(() => {
        setStepContent(
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 6,
              width: "calc(100% - 12px)",
              height: "100%",
            }}
          >
            <NameCard
              handleOnEdit={() => {
                setOnNameCardEdit(true);
              }}
              handleOnClose={() => {
                setOnNameCardEdit(false);
              }}
            />
          </div>
        );
      }, 160);
    } else if (activeStep === 1) {
      setStepContent(null);
      setTimeout(() => {
        setStepContent(
          <TextField
            id={`job-description-input`}
            label="Job Description"
            variant="outlined"
            multiline
            rows={7}
            fullWidth
            sx={{
              position: "absolute",
              inset: 0,
              height: "100%",
              fontFamily: "Jost",

              "& .MuiInputBase-input": {
                fontFamily: "inherit",
              },
              "& .MuiFormLabel-root": {
                fontFamily: "inherit",
              },
              "& .MuiOutlinedInput-root": {
                height: "100%",
                borderRadius: 2,
                fontFamily: "inherit",

                "& fieldset": {
                  borderRadius: 2,
                },
                "& textarea": {
                  height: "100%",
                  boxSizing: "border-box",
                  resize: "none",
                  fontFamily: "Jost",
                },
              },
            }}
          />
        );
      }, 160);
    } else {
      setStepContent(null);
    }
  }, [activeStep]);
  React.useEffect(() => {
    if (containerWidth === 1200) {
      setStyle({ left: 60, width: `calc(50% - 120px)` });
    } else if (containerWidth < 1200) {
      setStyle({ left: 6, width: `calc(90% - 12px)` });
    }
  }, [containerWidth]);

  return (
    <Box
      className="scrolling-space-v"
      sx={{
        transition: "all 0.36s ease",
        position: "absolute",
        top: 120,
        left: style.left,
        width: style.width,
        padding: "0px 8px",
        overflowY: "scroll",
      }}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              sx={{
                opacity: activeStep === index ? 1 : 0.5,
                transition: "all .25s ease",
                cursor: "pointer",

                "& .MuiStepLabel-label": {
                  fontFamily: "Jost",
                  fontSize: activeStep === index ? "20px" : "14px",
                  color: theme ? theme.font.color : "#000",
                  letterSpacing: "0.5px",

                  userSelect: "none",
                  webkitUserSelect: "none",
                  mozUserSelect: "none",
                  msUserSelect: "none",
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                setActiveStep(index);
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
                  height: activeStep === 2 ? 0 : activeStep === 0 ? 300 : 200,
                  marginTop: 16,
                  marginBottom: 16,
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                {stepContent || null}
              </div>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{
                    mt: 1,
                    mr: 1,
                    borderRadius: "8px",
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
                  sx={{ mt: 1, borderRadius: "8px", textTransform: "none" }}
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
        <Paper
          square
          elevation={0}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            backgroundColor: "transparent",
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: "Jost", fontSize: 20 }}>
            All steps completed — your resume is ready!
          </Typography>

          <Button onClick={handleReset} sx={{ mt: 2 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
};
const DraftResumeForm = () => {
  const { theme, windowSize, DialogTransition } = React.useContext(ConfigContext);
  const { get_user_info } = React.useContext(RequestContext);

  const [formData, setFormData] = React.useState(null);
  const [onNameCardEdit, setOnNameCardEdit] = React.useState(false);
  const [style, setStyle] = React.useState({
    header_left: 6,
    container_width: 490,
    container_height: 811,
  });
  const [resumeOnFocus, setResumeOnFocus] = React.useState(false);

  React.useEffect(() => {
    get_user_info()
      .then((data) => {
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [get_user_info]);
  React.useEffect(() => {
    if (windowSize.width >= 1200) {
      setStyle({
        header_left: 30,
        container_width: 1200,
        container_height: 811,
      });
    } else {
      setStyle({ header_left: 6, container_width: 490, container_height: 811 });
    }
  }, [windowSize]);
  React.useEffect(() => {
    if (windowSize.width >= 1200) {
      setResumeOnFocus(false);
    }
  }, [windowSize]);

  return (
    <DraftResumeFormContext.Provider
      value={{
        formData,
        resumeOnFocus,
        setResumeOnFocus,
        onNameCardEdit,
        setOnNameCardEdit,
      }}
    >
      <div
        className="draft-resume-form-container"
        style={{
          transition: "all 0.36s ease",
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          height: style.container_height,
          width: style.container_width,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 30,
            left: style.header_left,
            fontFamily: "Jost",
            fontSize: "36px",
            color: theme ? theme.font.color : "#000",

            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
          }}
        >
          Quick Draft
        </span>
        <FormStepper containerWidth={style.container_width} />
        <ResumeContainer
          containerWidth={style.container_width}
          resumeOnFocus={resumeOnFocus}
          setResumeOnFocus={setResumeOnFocus}
        />
      </div>
      {onNameCardEdit ? (
        <Dialog
          open={onNameCardEdit}
          onClose={() => {
            setOnNameCardEdit(false);
          }}
          slots={{
            transition: DialogTransition,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              height: "792px",
              width: "490px",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <DialogContent>
            <NameCard
              handleOnEdit={null}
              handleOnClose={null}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </DraftResumeFormContext.Provider>
  );
};

export default DraftResumeForm;
export { DraftResumeFormContext };
