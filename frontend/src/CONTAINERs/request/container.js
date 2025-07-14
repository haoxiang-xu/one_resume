import { createContext, useContext, useState } from "react";

const RequestContext = createContext();

const root_url = "http://localhost:8888/";

const RequestContainer = ({ children }) => {
  const register = async (data) => {
    try {
      const response = await fetch(`${root_url}api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Register failed");
        return null;
      }
      alert("Register successful!");
      return result;
    } catch (err) {
      alert("Error: " + err.message);
      return null;
    }
  };

  return (
    <RequestContext.Provider
      value={{
        register,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export { RequestContext, RequestContainer };
export default RequestContainer;
