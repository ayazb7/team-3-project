import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login.jsx";
import ModelViewer from "./components/ModelViewer";
import LandingPage from "./pages/LandingPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-full h-full">
        <LandingPage />
      <div>
        <Login />
      </div>
    </>
  );
}

export default App;
