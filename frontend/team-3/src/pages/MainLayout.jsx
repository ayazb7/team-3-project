import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import AskAno from "../components/AskAno";

function MainLayout() {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 w-full overflow-y-auto">
        <Outlet context={{ location }} />
      </main>
      <AskAno />
    </div>
  );
}

export default MainLayout;
