import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext'; 

function MainLayout() {
    const { accessToken } = useAuth();
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar /> 
            <main className="flex-1 overflow-y-auto">
                <Outlet context={{ location }} />
            </main>
        </div>
    );
}

export default MainLayout;