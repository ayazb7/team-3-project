import { useState } from "react";
import "./App.css";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import ModelViewer from "./components/ModelViewer";
import LandingPage from "./pages/LandingPage";
function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
