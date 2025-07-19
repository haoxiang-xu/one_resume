import TopMenu from "../COMPONENTs/top_menu/top_menu";
import Logo from "../COMPONENTs/logo/logo";
import FormStepper from "../COMPONENTs/resume_form/resume_form";

const Resume = () => {
  return (
    <div
      className="resume-page"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <FormStepper />
      <TopMenu items={["light switch", "user"]} /> <Logo style={"stroke"} />
    </div>
  );
};

export default Resume;
