import React from "react";
import skyLogo from "../assets/Sky_Group_logo_2020.svg.png";

const NavBar = () => {
  return (
    <nav
      className="w-full flex items-center px-8 py-4 shadow"
      style={{ backgroundColor: "#489ee0ff" }}
    >
      {/* Left: Site Title */}
      <div className="font-bold text-2xl tracking-wide text-white uppercase flex-1 text-left">
        Digital Skills Training
      </div>
      {/* Center: Sky logo */}
      <div className="flex justify-center flex-1">
        <img
          src={skyLogo}
          alt="Sky Logo"
          className="h-16 object-contain"
          style={{ maxWidth: "180px" }}
        />
      </div>
      {/* Right: Nav links and Login */}
      <div className="flex items-center justify-end gap-6 flex-1">
        <ul className="flex gap-4">
          <li>
            <a
              href="#"
              className="hover:underline transition"
              style={{ color: "#fff" }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:underline transition"
              style={{ color: "#fff" }}
            >
              Tutorials
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:underline transition"
              style={{ color: "#fff" }}
            >
              Certifications
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:underline transition"
              style={{ color: "#fff" }}
            >
              Support
            </a>
          </li>
        </ul>
        <a
          href="#"
          className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          style={{ color: "#fff" }}
        >
          Login
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
