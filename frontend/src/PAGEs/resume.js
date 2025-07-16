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
        // backgroundColor: theme?.backgroundColor || "#FFFFFF",
      }}
    >
      <TopMenu items={["light switch", "logout"]} />
    </div>
  );
};

export default Resume;
