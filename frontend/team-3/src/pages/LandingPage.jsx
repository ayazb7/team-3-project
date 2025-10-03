import React from "react";
import Navbar from "../components/Navbar";
import ModelViewer from "../components/ModelViewer";
import VideoBlock from "../components/VideoBlock";
const LandingPage = () => {
  return (
    <Navbar>
      <div className="h-full w-full pt-20">
        <div className=" flex flex-col gap-10 justify-center items-center">
          <div className="flex flex-col gap-5">
            <p className="font-bold text-4xl">Learn Anytime, Anywhere</p>
            <p className="px-5">
              Explore our diverse range of courses and expand your knowledge
            </p>
          </div>
          <button className="w-40 text-white !bg-blue-500">
            Browse Courses
          </button>
          <div>
            <p className="font-bold text-xl">Featured Courses</p>
          </div>
          {/* hard coding video blocks for now  */}
          <div className="flex flex-col gap-10">
            <VideoBlock />
            <VideoBlock />
            <VideoBlock />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default LandingPage;
