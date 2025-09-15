import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DataProvider, dataContext } from "./context/DataContext";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <>
    <StrictMode>
      <BrowserRouter>
        <DataProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </DataProvider>
      </BrowserRouter>
    </StrictMode>
  </>
);
