import { useState } from "react";
import { MenuIcon, HomeIcon } from "../assets";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
const Navbar = ({ children }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const options = [
    { Label: "Home", Render: <HomeIcon />, Link: "/" },
    { Label: "About", Render: <HomeIcon />, Link: "/about" },
    { Label: "Courses", Render: <HomeIcon />, Link: "/login" },
    { Label: "Support", Render: <HomeIcon />, Link: "/support" },
  ];
  // temporary button until we make one :)
  const Button = () => {
    return (
      <button
        onClick={() => {
          navigate("/login");
        }}
        className="!bg-blue-500 text-center !text-white mt-auto"
      >
        Sign In
      </button>
    );
  };
  return (
    <>
      <div className="fixed flex flex-col w-full h-auto overflow-hidden">
        <div className="w-full bg-white h-20 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-4 border z-99 p-3">
          <div className="flex justify-content items-center px-5 md:hidden">
            <MenuIcon
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
              }}
            />
          </div>
          <div className="flex w-full justify-center md:justify-start md:ml-10 items-center">
            <p className="font-bold">Sky Wise</p>
          </div>

          <div className="hidden md:flex flex-row w-full col-start-3">
            <nav className="flex items-center gap-3">
              {options.map((item, index) => {
                return (
                  <Link
                    to={item["Link"]}
                    key={index}
                    className="flex flex-row cursor-pointer "
                  >
                    {item["Label"]}
                  </Link>
                );
              })}
            </nav>
            <Outlet />
          </div>
          <div className="hidden md:flex items-center justify-center col-start-5">
            <Button />
          </div>
        </div>

        <div
          className={`${
            showMobileMenu ? "" : "hidden"
          } flex flex-col w-3/4 h-[calc(100vh-5rem)] bg-white shadow-lg p-5 gap-5`}
        >
          {options.map((item, index) => {
            return (
              <div key={index} className="flex h-15 items-center ">
                <Link
                  to={item["Link"]}
                  className={`flex flex-row h-full w-full p-2  rounded-sm items-center gap-5 ${
                    location.pathname === item["Link"] ? "bg-blue-100" : ""
                  }`}
                >
                  {item["Render"]}
                  {item["Label"]}
                </Link>
              </div>
            );
          })}
          <Button />
        </div>
      </div>
      <div className="pt-20 overflow-scroll h-full w-full">{children}</div>
    </>
  );
};

export default Navbar;
