import { useState } from "react";
import "./App.css";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import ModelViewer from "./components/ModelViewer";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
<<<<<<< HEAD
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
=======
    <div className="App">
      <Dashboard />
    </div>
>>>>>>> main
  );
}

export default App;
