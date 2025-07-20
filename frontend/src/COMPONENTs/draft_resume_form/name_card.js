import { useState, useContext, useEffect } from "react";

import satisfied_dark from "./satisfied_dark.png";
import satisfied_light from "./satisfied_light.png";

import Icon from "../../BUILTIN_COMPONENTs/icon/icon";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { ConfigContext } from "../../CONTAINERs/config/context";
import { DraftResumeFormContext } from "./draft_resume_form";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

const ContactInfoTag = ({ icon, text }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const [onHover, setOnHover] = useState(false);
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (onHover) {
      setStyle({
        width: "60px",
        opacity: 1,
        pointerEvents: "auto",
      });
    } else {
      setStyle({
        width: "0px",
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [onHover]);

  return (
    <div
      className="contact-info-tag"
      style={{
        position: "relative",
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "2px 8px",
        borderRadius: "16px",
        backgroundColor: theme ? theme.backgroundColor : "rgba(0, 0, 0, 0.04)",
        marginRight: "6px",
        marginBottom: "2px",
        border:
          onThemeMode === "dark_mode"
            ? "1px solid rgba(255, 255, 255, 0.16)"
            : "1px solid rgba(0, 0, 0, 0.16)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <Icon
        src={icon}
        style={{
          flex: "0 0 18px",
          width: "18px",
          height: "18px",
          opacity: 0.5,
        }}
        color={theme ? theme.font.color : "#000000"}
      />
      <span
        className="contact-info-text"
        style={{
          fontFamily: "Jost",
          fontSize: "14px",
          color: theme ? theme.font.color : "#000000",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        {text}
      </span>
      <div
        style={{
          transition: "all 0.16s ease",
          position: "absolute",
          top: -6,
          right: -6,
          width: style.width,
          height: "calc(100% + 12px)",
          borderRadius: "124px",
          zIndex: 1,
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(255, 255, 255, 0.8)",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.32)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          boxShadow: "0 0px 8px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          opacity: style.opacity,
          pointerEvents: style.pointerEvents,
        }}
      >
        <Icon
          src={"delete"}
          style={{
            width: "18px",
            height: "18px",
            position: "absolute",
            top: "50%",
            right: "0px",
            transform: "translate(-50%, -50%)",
          }}
          color={"red"}
        />
        <Icon
          src={"edit"}
          style={{
            width: "18px",
            height: "18px",
            position: "absolute",
            top: "50%",
            left: "0px",
            transform: "translate(50%, -50%)",
          }}
          color={theme ? theme.font.color : "#000000"}
        />
      </div>
    </div>
  );
};
const ContactSection = () => {
  const { formData } = useContext(DraftResumeFormContext);
  const contactTypeOptions = {
    linkedin: { icon: "linkedin" },
    github: { icon: "github" },
    personal_website: { icon: "link" },
    portfolio: { icon: "passport" },
    other: { icon: "link" },
  };

  return (
    <div
      className="contact-section"
      style={{
        padding: "6px",
      }}
    >
      <ContactInfoTag icon="phone" text={formData?.contact?.cell?.number} />
      <ContactInfoTag icon="email" text={formData?.contact?.email} />
      {formData?.contact?.extra?.map((item, index) => (
        <ContactInfoTag
          key={index}
          icon={contactTypeOptions[item.contact_type].icon}
          text={item.contact_value}
        />
      ))}
    </div>
  );
};
const EducationTag = ({ icon, text }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const [onHover, setOnHover] = useState(false);
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (onHover) {
      setStyle({
        width: "60px",
        opacity: 1,
        pointerEvents: "auto",
      });
    } else {
      setStyle({
        width: "0px",
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [onHover]);

  return (
    <div
      className="contact-info-tag"
      style={{
        position: "relative",
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "2px 8px",
        borderRadius: "16px",
        backgroundColor: theme ? theme.backgroundColor : "rgba(0, 0, 0, 0.04)",
        marginRight: "6px",
        marginBottom: "2px",
        border:
          onThemeMode === "dark_mode"
            ? "1px solid rgba(255, 255, 255, 0.16)"
            : "1px solid rgba(0, 0, 0, 0.16)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <Icon
        src={icon}
        style={{
          flex: "0 0 18px",
          width: "18px",
          height: "18px",
          opacity: 0.5,
        }}
        color={theme ? theme.font.color : "#000000"}
      />
      <span
        className="contact-info-text"
        style={{
          fontFamily: "Jost",
          fontSize: "14px",
          color: theme ? theme.font.color : "#000000",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        {text}
      </span>
      <div
        style={{
          transition: "all 0.16s ease",
          position: "absolute",
          top: -6,
          right: -6,
          width: style.width,
          height: "calc(100% + 12px)",
          borderRadius: "124px",
          zIndex: 1,
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(255, 255, 255, 0.8)",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.32)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          boxShadow: "0 0px 8px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          opacity: style.opacity,
          pointerEvents: style.pointerEvents,
        }}
      >
        <Icon
          src={"delete"}
          style={{
            width: "18px",
            height: "18px",
            position: "absolute",
            top: "50%",
            right: "0px",
            transform: "translate(-50%, -50%)",
          }}
          color={"red"}
        />
        <Icon
          src={"edit"}
          style={{
            width: "18px",
            height: "18px",
            position: "absolute",
            top: "50%",
            left: "0px",
            transform: "translate(50%, -50%)",
          }}
          color={theme ? theme.font.color : "#000000"}
        />
      </div>
    </div>
  );
};
const EducationSection = () => {
  const { theme } = useContext(ConfigContext);
  const { formData } = useContext(DraftResumeFormContext);
  return (
    <div
      className="education-section"
      style={{
        padding: "6px",
      }}
    >
      <span
        className="education-title"
        style={{
          fontFamily: "Jost",
          fontSize: "20px",
          color: theme ? theme.font.color : "#000000",
          marginBottom: "8px",
        }}
      >
        Education
      </span>
      {formData?.education?.map((item, index) => (
        <div key={index} className="education-item">
          <EducationTag
            icon={"education"}
            text={`${item.degree + " @ " + item.institution}`}
          />
        </div>
      ))}
    </div>
  );
};
const ExperienceTag = ({ icon, text }) => {
  const { theme, onThemeMode } = useContext(ConfigContext);
  const [onHover, setOnHover] = useState(false);
  const [style, setStyle] = useState({
    width: "0px",
    opacity: 0,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (onHover) {
      setStyle({
        width: "60px",
        opacity: 1,
        pointerEvents: "auto",
      });
    } else {
      setStyle({
        width: "0px",
        opacity: 0,
        pointerEvents: "none",
      });
    }
  }, [onHover]);

  return (
    <div
      className="contact-info-tag"
      style={{
        position: "relative",
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "2px 8px",
        borderRadius: "16px",
        backgroundColor: theme ? theme.backgroundColor : "rgba(0, 0, 0, 0.04)",
        marginRight: "6px",
        marginBottom: "2px",
        border:
          onThemeMode === "dark_mode"
            ? "1px solid rgba(255, 255, 255, 0.16)"
            : "1px solid rgba(0, 0, 0, 0.16)",
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <Icon
        src={icon}
        style={{
          flex: "0 0 18px",
          width: "18px",
          height: "18px",
          opacity: 0.5,
        }}
        color={theme ? theme.font.color : "#000000"}
      />
      <span
        className="contact-info-text"
        style={{
          fontFamily: "Jost",
          fontSize: "14px",
          color: theme ? theme.font.color : "#000000",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        {text}
      </span>
      <div
        style={{
          transition: "all 0.16s ease",
          position: "absolute",
          top: -6,
          right: -6,
          width: style.width,
          height: "calc(100% + 12px)",
          borderRadius: "124px",
          zIndex: 1,
          backgroundColor: theme
            ? theme.backgroundColor
            : "rgba(255, 255, 255, 0.8)",
          border:
            onThemeMode === "dark_mode"
              ? "1px solid rgba(255, 255, 255, 0.32)"
              : "1px solid rgba(0, 0, 0, 0.16)",
          boxShadow: "0 0px 8px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          opacity: style.opacity,
          pointerEvents: style.pointerEvents,
        }}
      >
        <Icon
          src={"delete"}
          style={{
            width: "18px",
            height: "18px",
            position: "absolute",
            top: "50%",
            right: "0px",
            transform: "translate(-50%, -50%)",
          }}
          color={"red"}
        />
        <Icon
          src={"edit"}
          style={{
            width: "18px",
            height: "18px",
            position: "absolute",
            top: "50%",
            left: "0px",
            transform: "translate(50%, -50%)",
          }}
          color={theme ? theme.font.color : "#000000"}
        />
      </div>
    </div>
  );
};
const ExperienceSection = () => {
  const { theme } = useContext(ConfigContext);
  const { formData } = useContext(DraftResumeFormContext);
  return (
    <div
      className="experience-section"
      style={{
        padding: "6px",
      }}
    >
      <span
        className="experience-title"
        style={{
          fontFamily: "Jost",
          fontSize: "20px",
          color: theme ? theme.font.color : "#000000",
          marginBottom: "8px",
        }}
      >
        Experience
      </span>
      {formData?.experience?.map((item, index) => (
        <div key={index} className="experience-item">
          <ExperienceTag
            icon={"pin"}
            text={`${item.role + " @ " + item.company}`}
          />
        </div>
      ))}
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
          draggable="false"
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",

            pointerEvents: "none",

            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
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
        <ContactSection />
        <EducationSection />
        <ExperienceSection />
      </div>
    </div>
  );
};

export default NameCard;
