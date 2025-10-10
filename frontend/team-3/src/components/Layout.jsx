import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 overflow-scroll h-full w-full">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
