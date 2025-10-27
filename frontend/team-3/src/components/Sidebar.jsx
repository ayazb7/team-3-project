import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChartLine,
  MapPinned,
  History,
  MessageCircleQuestionMark,
  PanelLeft,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MenuItem = ({ item, isCollapsed, location, navigate, onClick }) => {
  const IconComponent = item.icon;
  const isActive = location.pathname === item.to;

  const handleClick = () => {
    navigate(item.to);
    onClick?.();
  };

  return (
    <button
      key={item.id}
      className={`
                flex items-center w-full h-12 px-3 gap-3 rounded-lg transition-all duration-200 relative group
                ${isCollapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer hover:shadow-md hover:shadow-sidebar-accent/20"
                }
            `}
      onClick={handleClick}
      title={isCollapsed ? item.label : undefined}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-b from-[#ac1ec4] to-[#1c50fe] rounded-r-full group-hover:w-1 transition-all duration-200"></div>
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && (
        <span className="truncate font-medium">{item.label}</span>
      )}
    </button>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, username, email } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const initial = username?.charAt(0).toUpperCase() ?? "TU";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: ChartLine, to: "/dashboard" },
    {
      id: "local-events",
      label: "Find Local Events",
      icon: MapPinned,
      to: "/dashboard/find-local-events",
    },
    {
      id: "activity",
      label: "Activity",
      icon: History,
      to: "/dashboard/activity",
    },
    {
      id: "support",
      label: "Support",
      icon: MessageCircleQuestionMark,
      to: "/dashboard/support",
    },
  ];

  const toggleDesktopSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  const SidebarContent = ({ showLogo = true, onItemClick }) => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-sidebar-accent/30 pointer-events-none"></div>

      {showLogo && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe] opacity-90 shadow-sm z-10"></div>
      )}

      {showLogo && (
        <div
          className={`flex items-center h-20 px-4 border-b border-sidebar-border relative z-10 ${
            isCollapsed && !isMobileOpen ? "justify-center" : ""
          }`}
        >
          <h1
            className={`font-bold bg-gradient-to-r from-[#e03ef4] to-[#4c80ff] bg-clip-text text-transparent ${
              isCollapsed && !isMobileOpen
                ? "text-base leading-tight"
                : "text-2xl"
            }`}
          >
            {isCollapsed && !isMobileOpen ? (
              <div className="text-center">
                <div>Sky</div>
                <div>Wise</div>
              </div>
            ) : (
              "SkyWise"
            )}
          </h1>
        </div>
      )}

      <nav
        className={`flex-1 px-3 space-y-2 relative z-10 ${
          showLogo ? "py-4" : "py-6"
        }`}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed && !isMobileOpen}
            location={location}
            navigate={navigate}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {(!isCollapsed || isMobileOpen) && (
        <div className="h-px bg-gradient-to-r from-transparent via-[#ac1ec4]/50 to-transparent mx-4 mb-0 relative z-10"></div>
      )}

      <div
        className={`
                p-4 border-t border-sidebar-border mt-auto bg-sidebar-accent/30 relative z-10
                transition-opacity duration-200
                ${
                  isCollapsed && !isMobileOpen
                    ? "opacity-0 invisible"
                    : "opacity-100 visible"
                }
            `}
      >
        <div className="flex gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#ac1ec4] to-[#1c50fe] text-white font-semibold flex-shrink-0 shadow-md">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate text-sidebar-foreground text-left">
              {username}
            </div>
            <div className="text-xs text-sidebar-foreground/60 truncate text-left">
              {email}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <button className="flex items-center justify-center w-full h-8 text-sm rounded-md border border-sidebar-ring hover:bg-sidebar-accent hover:border-sidebar-accent-foreground transition-colors">
                        Settings
                    </button> */}
          <button
            className="flex items-center justify-center w-full h-9 text-sm rounded-md border border-sidebar-primary/40 bg-sidebar-primary/10 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:border-sidebar-primary transition-all cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        className={`hidden md:flex p-3 border-t border-sidebar-border bg-sidebar-accent/20 relative z-10 ${
          isCollapsed ? "justify-center" : "justify-end"
        }`}
      >
        <button
          onClick={toggleDesktopSidebar}
          className="p-2 rounded-md hover:bg-sidebar-primary/20 hover:text-sidebar-primary transition-all cursor-pointer group z-10"
        >
          <PanelLeft
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1c50fe] via-[#ac1ec4] to-[#ff8a01] opacity-90 shadow-sm z-20"></div>
      </div>
    </div>
  );

  return (
    <>
      <header className="md:hidden sticky top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border relative shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-sidebar-accent/30 pointer-events-none"></div>

        <h1 className="text-xl font-bold bg-gradient-to-r from-[#e03ef4] to-[#4c80ff] bg-clip-text text-transparent relative z-10">
          SkyWise
        </h1>
        <button
          onClick={toggleMobileSidebar}
          className="p-2 hover:bg-sidebar-accent rounded-md transition-all hover:shadow-md relative z-10"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? (
            <X className="w-6 h-6 text-sidebar-foreground transition-transform duration-200" />
          ) : (
            <Menu className="w-6 h-6 text-sidebar-foreground transition-transform duration-200" />
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff8a01] via-[#ea0c3c] via-[#ac1ec4] to-[#1c50fe] z-10"></div>
      </header>

      <aside
        className={`
                hidden md:flex flex-col shadow-xl
                transition-all duration-300 ease-in-out
                ${isCollapsed ? "w-20" : "w-72"}
            `}
      >
        <SidebarContent />
      </aside>

      <div
        className={`
                md:hidden fixed inset-x-0 top-16 bottom-0 z-40 transition-opacity duration-300 ease-in-out
                ${
                  isMobileOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }
            `}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={toggleMobileSidebar}
        ></div>

        <aside
          className={`
                    absolute top-0 left-0 bottom-0 flex flex-col w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
        >
          <SidebarContent showLogo={false} onItemClick={toggleMobileSidebar} />
        </aside>
      </div>
    </>
  );
}
