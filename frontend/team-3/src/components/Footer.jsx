import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-12 px-6 md:px-12 lg:px-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2 text-center md:text-left">
            <div className="mb-4 flex justify-center md:justify-start">
              <img src={logo} alt="SkyWise Logo" className="w-12 h-10" />
            </div>
            <p className="text-gray-400 max-w-md mx-auto md:mx-0">
              Empowering digital beginners to confidently navigate the modern world. Learn essential tech skills at your own pace.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <div className="font-semibold text-lg mb-4">Quick Links</div>
            <ul className="space-y-2 text-gray-400 list-none ml-0">
              <li 
                className="hover:text-white cursor-pointer transition-colors"
                onClick={() => navigate("/")}
              >
                Home
              </li>
              <li 
                className="hover:text-white cursor-pointer transition-colors" 
                onClick={() => navigate("/courses")}
              >
                Courses
              </li>
              <li 
                className="hover:text-white cursor-pointer transition-colors" 
                onClick={() => navigate("/about")}
              >
                About Us
              </li>
              <li 
                className="hover:text-white cursor-pointer transition-colors" 
                onClick={() => navigate("/support")}
              >
                Support
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div className="text-center md:text-left">
            <div className="font-semibold text-lg mb-4">Get Started</div>
            <ul className="space-y-2 text-gray-400 list-none ml-0">
              <li 
                className="hover:text-white cursor-pointer transition-colors" 
                onClick={() => navigate("/register")}
              >
                Sign Up
              </li>
              <li 
                className="hover:text-white cursor-pointer transition-colors" 
                onClick={() => navigate("/login")}
              >
                Login
              </li>
              <li 
                className="hover:text-white cursor-pointer transition-colors" 
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; 2025 SkyWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

