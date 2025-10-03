import { useState } from "react";
import { MenuIcon, HomeIcon } from "../assets";
import { Link, Outlet } from "react-router-dom";
const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const options = [
    { Label: "Home", Render: <HomeIcon />, Link: "/" },
    { Label: "About", Render: <HomeIcon />, Link: "/about" },
    { Label: "Courses", Render: <HomeIcon />, Link: "/login" },
    { Label: "Support", Render: <HomeIcon />, Link: "/login" },
  ];
  return (
    <>
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="w-full h-20 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-3 gap-4 border z-99 p-3">
          <div className="flex justify-content items-center px-5 md:hidden">
            <MenuIcon
              onClick={() => {
                console.log("hi");
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
            <button className="!bg-blue-500 text-center !text-white ">
              Sign In
            </button>
          </div>
        </div>

        <div
          className={`${
            showMobileMenu ? "" : "hidden"
          } flex flex-col w-3/4 flex-1 bg-white shadow-lg p-5 gap-5`}
        >
          {options.map((item, index) => {
            return (
              <div key={index} className="flex h-15 items-center ">
                <Link
                  to={item["Link"]}
                  className={`flex flex-row h-full w-full p-2  rounded-sm items-center gap-2 ${
                    selectedOption == index ? "bg-blue-100" : ""
                  }`}
                >
                  {item["Render"]}
                  {item["Label"]}
                </Link>
              </div>
            );
          })}
          <button className="!bg-blue-500 text-center !text-white mt-auto">
            Sign In
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
