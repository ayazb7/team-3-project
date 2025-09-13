import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import placeholderData from "./data/placeholder.json";
import { DataProvider, dataContext } from "./context/DataContext";
import VideoCardList from "./components/VideoCardList";

function App() {
  const data = useContext(dataContext);
  return (
    <div>
      <div className="flex flex-col justify-center gap-5 text-gray-700 items-center w-full min-h-1/3 bg-gray-300 p-10">
        <h1 className="text-black font-bold">
          BUILD YOUR DIGITAL SKILLS TODAY
        </h1>
        <p className="p-5">
          Free tutorials, videos, and interactive exercises to help you get
          started online
        </p>
        <button className="!bg-blue-700 text-white">START LEARNING</button>
      </div>
      <div className="flex justify-center items-center w-full min-h-3/4">
        <div className="w-full">
          <VideoCardList videos={data.videos} />
        </div>
      </div>
      <div className="w-full min-h-20"></div>
    </div>
  );
}

export default App;
