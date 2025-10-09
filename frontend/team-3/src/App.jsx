import { Routes, Route } from 'react-router-dom'
import "./App.css";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import MainLayout from './pages/MainLayout'
import ModelViewer from "./components/ModelViewer";
import LandingPage from "./pages/LandingPage";

function App() {
  return (  
    <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="find-local-events" element={<div/>}/>
            <Route path="activity" element={<div/>}/>
            <Route path="support" element={<div/>}/>
          </Route>
          
    </Routes>
  );
}

export default App;
