import { createContext } from "react";
import placeholderData from "../data/placeholder.json";

console.log("Placeholder Data:", placeholderData);
const dataContext = createContext();

const DataProvider = ({ children }) => {
  return (
    <dataContext.Provider value={placeholderData}>
      {children}
    </dataContext.Provider>
  );
};

export { dataContext, DataProvider };
