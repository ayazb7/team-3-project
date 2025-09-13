import React from "react";

const VideoCard = ({ title, description }) => {
  return (
    <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white text-gray-900 font-thin">
      <div class="w-full h-50 bg-gradient-to-r from-orange-400 to-indigo-600" />
      <div class="px-6 py-4 ">
        <div className="flex flex-col justify-center items-center gap-4">
          <div class="font-medium text-xl mb-2">{title}</div>
          <p class="text-base">{description}</p>
          <button className="!bg-blue-700 text-white">START TUTORIAL</button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
