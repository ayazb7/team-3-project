import React from "react";
import Navbar from "../components/Navbar";
import ModelViewer from "../components/ModelViewer";
import VideoBlock from "../components/VideoBlock";
import catImg from "../../public/landing_placeholder.png";
import Button from "../components/Button";

const LandingPage = () => {
  return (
    <div className="h-full w-full pt-20 md:text-lg lg:text-xl xl:text-3xl">
      <div className=" flex flex-col gap-10 justify-center items-center md:justify-start md:items-start md:p-15 lg:p-20 mt-auto w-full">
        <div className="flex flex-col gap-5 items-center justify-center md:justify-start md:items-start w-full">
          <div className="md:grid md:grid-cols-2 w-full content-center">
            <div className="flex flex-col gap-5 items-center md:gap-10 md:items-start">
              <p className="font-bold text-4xl md:text-4xl md:text-left lg:text-5xl xl:text-7xl px-5 md:px-0">
                Learn Anytime, Anywhere
              </p>

              <p className="px-5 text-center md:text-left md:p-0 md:w-3/4">
                Explore our diverse range of courses and expand your knowledge
              </p>

              <Button
                className="w-40 h-10 lg:h-15 text-white !bg-blue-500 md:w-50 lg:w-70 xl:w-80 xl:text-xl rounded-lg"
                label="Browse Courses"
              />
            </div>
            <img
              src={catImg}
              alt="cat"
              className="hidden md:block w-1/2 md:w-full lg:w-3/4 mx-auto"
            />
          </div>
        </div>
        <div>
          <p className="font-bold text-xl md:text-3xl xl:text-4xl">
            Featured Courses
          </p>
        </div>
        {/* hard coding video blocks for now  */}
        <div className="flex flex-col md:flex-row gap-10">
          <VideoBlock />
          <VideoBlock />
          <VideoBlock />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
