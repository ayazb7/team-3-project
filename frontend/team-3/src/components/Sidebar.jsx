import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { ChartLine, MapPinned, History, MessageCircleQuestionMark, PanelLeft, X, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FlowStateLogo from "../assets/flowstate_logo.png";

const MenuItem = ({ item, isCollapsed, location, navigate }) => {
    const IconComponent = item.icon;
    const isActive = location.pathname === item.to;

    return (
        <button
            key={item.id}
            className={`
                flex items-center w-full h-12 px-3 gap-3 rounded-lg sidebar-primary transition-colors duration-200
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer'
                }
            `}
            onClick={() => navigate(item.to)}
            title={isCollapsed ? item.label : undefined}
        >
            <IconComponent className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
        </button>
    );
};

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const displayUsername = "John Doe";
    const displayEmail = "john@email.com";
    const initial = "JD";

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: ChartLine, to: '/dashboard' },
        { id: 'local-events', label: 'Find Local Events', icon: MapPinned, to: '/dashboard/find-local-events' },
        { id: 'activity', label: 'Activity', icon: History, to: '/dashboard/activity' },
        { id: 'support', label: 'Support', icon: MessageCircleQuestionMark, to: '/dashboard/support' },
    ];

    const toggleDesktopSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    const handleLogout = () => {
        logout();
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
            {/* Logo and Brand */}
            <div className={`flex items-center h-20 px-4 border-b border-sidebar-border`}>
                <img src={FlowStateLogo} alt="FlowState" />
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 py-4 space-y-2">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        item={item}
                        isCollapsed={isCollapsed && !isMobileOpen}
                        location={location}
                        navigate={navigate}
                    />
                ))}
            </nav>

            {/* User Profile Section */}
            <div className={`
                p-4 border-t border-sidebar-border mt-auto
                transition-opacity duration-200
                ${isCollapsed && !isMobileOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}
            `}>
                <div className="flex gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-semibold flex-shrink-0">
                        {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-sidebar-foreground text-left">{displayUsername}</div>
                        <div className="text-xs text-muted-foreground truncate text-left">{displayEmail}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* <button className="flex items-center justify-center w-full h-8 text-sm rounded-md border border-sidebar-ring hover:bg-sidebar-accent hover:border-sidebar-accent-foreground transition-colors">
                        Settings
                    </button> */}
                     <button className="flex items-center justify-center w-full h-8 text-sm rounded-md border border-sidebar-ring hover:bg-sidebar-accent hover:border-sidebar-accent-foreground transition-colors" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Desktop Collapse Toggle */}
            <div className={`hidden md:flex p-3 border-t border-sidebar-border ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
                 <button onClick={toggleDesktopSidebar} className="p-2 rounded-md hover:bg-sidebar-accent">
                    <PanelLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    );
    
    return (
        <>
            {/* Mobile Header with Hamburger Menu */}
            <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-background border-b border-border">
                <img src={FlowStateLogo} alt="FlowState" className="h-8 w-auto" />
                <button onClick={toggleMobileSidebar} className="p-2">
                    <Menu className="w-6 h-6"/>
                </button>
            </header>

            {/* --- Desktop Sidebar --- */}
            <aside className={`
                hidden md:flex flex-col
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-20' : 'w-72'}
            `}>
                <SidebarContent />
            </aside>

            {/* --- Mobile Sidebar (Overlay) --- */}
            <div className={`
                md:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out
                ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60" onClick={toggleMobileSidebar}></div>
                
                {/* Sidebar Content with Animation */}
                <aside className={`
                    absolute top-0 left-0 flex flex-col w-72 h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border
                    transition-transform duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="absolute top-4 right-4">
                         <button onClick={toggleMobileSidebar} className="p-2 rounded-md hover:bg-sidebar-accent">
                            <X className="w-6 h-6"/>
                        </button>
                    </div>
                    <SidebarContent />
                </aside>
            </div>
        </>
    );
}
