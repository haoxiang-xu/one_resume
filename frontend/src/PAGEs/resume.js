import TopMenu from "../COMPONENTs/top_menu/top_menu";

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
      <TopMenu items={["light switch", "user"]} />
    </div>
  );
};

export default Resume;
