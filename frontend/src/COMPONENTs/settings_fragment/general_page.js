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
      <span
        style={{
          position: "absolute",
          top: 8,
          left: 16,
          fontSize: 32,
          fontFamily: "Jost",

          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
        }}
      >
        General
      </span>
    </div>
  );
};

export default GeneralPage;
