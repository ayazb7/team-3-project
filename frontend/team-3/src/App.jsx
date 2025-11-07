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
import Courses from "./pages/Courses.jsx";
import Quiz from "./pages/Quiz.jsx";
import About from "./pages/About.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CourseManagement from "./pages/CourseManagement.jsx";
import UserMetrics from "./pages/UserMetrics.jsx";
import ContactForm from "./components/ContactForm.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<ContactForm />} />
      </Route>
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="find-local-events" element={<div />} />
        <Route path="activity" element={<div />} />
        <Route path="support" element={<ContactForm />} />
        <Route path="settings" element={<Settings />} />
        <Route path="course/:id" element={<CourseView />} />
        <Route path="courses" element={<Courses />} />
        <Route
          path="course/:courseId/learning/:tutorialId"
          element={<Learning />}
        />
        <Route
          path="course/:courseId/learning/:tutorialId/quiz/:quizId"
          element={<Quiz />}
        />
      </Route>
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="users" element={<UserMetrics />} />
      </Route>
    </Routes>
  );
}

export default App;
