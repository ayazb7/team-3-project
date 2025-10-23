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
import BotRender from "./pages/BotRender.jsx";
import Quiz from "./pages/Quiz.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/courses"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">Courses Page - Coming Soon</h1>
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">About Page - Coming Soon</h1>
            </div>
          }
        />
        <Route
          path="/support"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">Support Page - Coming Soon</h1>
            </div>
          }
        />
      </Route>
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="find-local-events" element={<div />} />
        <Route path="activity" element={<div />} />
        <Route path="support" element={<div />} />
        <Route path="course/:id" element={<CourseView />} />
        <Route
          path="course/:courseId/learning/:tutorialId"
          element={<Learning />}
        />
        <Route
          path="course/:courseId/learning/:tutorialId/quiz/:quizId"
          element={<Quiz />}
        />
      </Route>
    </Routes>
  );
}

export default App;
