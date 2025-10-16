import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./pages/MainLayout";
import ModelViewer from "./components/ModelViewer";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register.jsx";
import Layout from "./components/Layout.jsx";
import Learning from "./pages/Learning.jsx";
import CourseView from "./pages/CourseView.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="find-local-events" element={<div />} />
        <Route path="activity" element={<div />} />
        <Route path="support" element={<div />} />
        <Route path="course/:id" element={<CourseView />} />
        <Route path="learning/:id" element={<Learning />} />
      </Route>
    </Routes>
  );
}

export default App;
