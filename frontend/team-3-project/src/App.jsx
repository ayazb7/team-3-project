import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import placeholderData from "./data/placeholder.json";
import { DataProvider, dataContext } from "./context/DataContext";
import VideoCardList from "./components/VideoCardList";

{
  /* All work is proof of concept and will need to be refactored and optimized later */
}
function App() {
  const data = useContext(dataContext);
  return (
    <div className="flex flex-col justify-center items-center gap-10 min-h-screen w-full">
      <div className="flex flex-col justify-center gap-5 text-gray-700 items-center w-full min-h-1/3 bg-gray-300 p-10">
        <h1 className="text-black font-bold">
          BUILD YOUR DIGITAL SKILLS TODAY
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
          <div className="flex flex-col justify-center items-center w-full text-center gap-4 bg-gray-200 p-10 rounded">
            <p className="text-4xl">📸</p>
            <p className="text-lg">VIDEO TUTORIALS</p>
            <p className="font-thin">Watch step-by-step guides</p>
          </div>

          <div className="flex flex-col justify-center items-center w-full text-center gap-4 bg-gray-200 p-10 rounded">
            <p className="text-4xl">🧠</p>
            <p className="text-lg">INTERACTIVE QUIZZES</p>
            <p className="font-thin">Test your knowledge</p>
          </div>

          <div className="flex flex-col justify-center items-center w-full text-center gap-4 bg-gray-200 p-10 rounded">
            <p className="text-4xl">🗺️</p>
            <p className="text-lg">FIND LOCAL SUPPORT</p>
            <p className="font-thin">Connect with nearby help</p>
          </div>
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
        <footer className="w-full h-full bg-gray-300 flex justify-center items-center p-4 text-gray-700">
          <p className="text-sm">
            &copy; 2024 Digital Skills Training. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
