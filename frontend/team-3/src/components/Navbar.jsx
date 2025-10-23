import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { X, Menu, Home, Info, BookOpen, HelpCircle } from "lucide-react";
import FlowStateLogo from "../assets/flowstate_logo.png";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const options = [
    { Label: "Home", Icon: Home, Link: "/" },
    { Label: "About", Icon: Info, Link: "/about" },
    { Label: "Courses", Icon: BookOpen, Link: "/courses" },
    { Label: "Support", Icon: HelpCircle, Link: "/support" },
  ];

  const NavButton = ({ onClick }) => (
    <Link to="/login" className="w-full md:w-auto" onClick={onClick}>
      <button className="w-full px-6 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] text-white hover:shadow-lg hover:shadow-[#ac1ec4]/30 transition-all duration-200 hover:scale-105">
        Sign In
      </button>
    </Link>
  );

  return (
    <>
      <div className="fixed z-50 flex flex-col w-full h-auto overflow-hidden shadow-2xl">
        <div className="w-full bg-[#001433] text-white h-20 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-4 z-99 p-3 relative border-b border-white/10">
          <div className="flex justify-content items-center px-5 md:hidden relative z-10">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-white/10 rounded-md transition-all"
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          <div className="flex w-full justify-center md:justify-start md:ml-10 items-center relative z-10">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={FlowStateLogo} alt="FlowState" className="h-10" />
            </Link>
          </div>

          <div className="hidden md:flex flex-row w-full col-start-3 relative z-10">
            <nav className="flex items-center gap-8">
              {options.map((item, index) => {
                const isActive = location.pathname === item["Link"];
                return (
                  <Link
                    to={item["Link"]}
                    key={index}
                    className={`
                      flex flex-row cursor-pointer px-4 py-2 rounded-md font-medium transition-all duration-200 relative group
                      ${
                        isActive
                          ? "text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {item["Label"]}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe]"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center justify-center col-start-4 relative z-10">
            <NavButton />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff8a01] via-[#ea0c3c] via-[#ac1ec4] to-[#1c50fe]"></div>
        </div>

        <div
          className={`
          md:hidden fixed inset-x-0 top-20 bottom-0 z-40 transition-opacity duration-300 ease-in-out
          ${
            showMobileMenu
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileMenu(false)}
          ></div>

          <aside
            className={`
            absolute top-0 left-0 bottom-0 flex flex-col w-3/4 bg-[#001433] text-white shadow-2xl p-5 gap-3 overflow-hidden border-r border-white/10
            transition-transform duration-300 ease-in-out
            ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            {options.map((item, index) => {
              const isActive = location.pathname === item["Link"];
              const IconComponent = item.Icon;
              return (
                <div key={index} className="flex items-center relative z-10">
                  <Link
                    to={item["Link"]}
                    className={`
                      flex flex-row w-full h-12 px-3 gap-3 rounded-lg items-center transition-all duration-200 relative group
                      ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md hover:shadow-sidebar-accent/20"
                      }
                    `}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <div
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-[#ac1ec4] to-[#1c50fe] rounded-r-full transition-all duration-200 ${
                        isActive ? "w-1" : "w-0 group-hover:w-1"
                      }`}
                    ></div>
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item["Label"]}</span>
                  </Link>
                </div>
              );
            })}

            <div className="h-px bg-white/10 my-2"></div>

            <div className="relative z-10">
              <NavButton onClick={() => setShowMobileMenu(false)} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Navbar;
