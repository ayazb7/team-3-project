import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import placeholderData from "./data/placeholder.json";
import { DataProvider, dataContext } from "./context/DataContext";
import { FeatureBlock, VideoCardList } from "./components";
import { Link } from "react-router-dom";
import NavBar from "./components/NavBar";

{
  /* All work is proof of concept and will need to be refactored and optimized later */
}
function App() {
  const data = useContext(dataContext);
  return (
    <div className="flex flex-col justify-center items-center gap-10 min-h-screen w-full">
      <NavBar />
      <div className="flex flex-col justify-center gap-5 text-gray-700 items-center w-full min-h-1/3 bg-gray-300 p-10">
        <h1 className="text-black font-bold">
          BUILD YOUR DIGITAL SKILLS TODAY!!
        </h1>
        <p className="p-5">
          Free tutorials, videos, and interactive exercises to help you get
          started online.
        </p>
        <button className="!bg-blue-700 text-white">START LEARNING</button>
      </div>
      {/* alot of repated flex definitions here, could create custom class later */}
      <div className="flex flex-col gap-4 justify-center items-center w-full min-h-3/4 text-gray-700">
        <div className="flex w-full flex-col justify-center items-center text-center gap-4 md:p-4 md:flex-row items-stretch">
          <FeatureBlock
            icon="💻"
            title="VIDEO TUTORIALS"
            description="Learn at your own pace"
          />

          <FeatureBlock
            icon="🧠"
            title="INTERACTIVE QUIZZES"
            description="Test your knowledge"
          />

          <FeatureBlock
            icon="🗺️"
            title="FIND LOCAL SUPPORT"
            description="Connect with nearby help"
          />
        </div>
        <p className="h-full text-xl text-gray-700 font-medium">
          TUTORIAL PREVIEW
        </p>
        <div className="h-full w-full">
          <VideoCardList videos={data.videos} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full text-gray-700 justify-center items-center gap-4 p-10 ">
        <p className="md:w-1/2">
          Earn simple certifications for the skills you've learned
        </p>
        <button className="!bg-blue-700 text-white !text-sm">
          VIEW CERTIFICATION PATH
        </button>
      </div>
      <div className="w-full ">
        <footer className="flex flex-col gap-4 w-full h-full bg-gray-300 flex justify-center items-center p-4 text-gray-700">
          <p className="text-sm">
            &copy; 2024 Digital Skills Training. All rights reserved.
          </p>
          <Link to="/Login">Login</Link>
        </footer>
      </div>
    </div>
  );
}

export default App;
