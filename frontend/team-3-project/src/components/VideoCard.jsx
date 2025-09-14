import React from "react";

const VideoCard = ({ title, description }) => {
  return (
    <div className="min-h-full max-w-xs lg:max-h-100 lg:max-w-1/5 rounded-lg  shadow-lg bg-white text-gray-900 font-thin">
      <div className="h-1/2 w-full h-50 rounded-t-lg bg-gradient-to-r from-orange-400 to-indigo-600" />
      <div className="px-6 py-4 h-1/2">
        <div className="h-full flex flex-col justify-center items-center gap-4">
          <div className="font-medium text-xl lg:text-sm mb-2">{title}</div>
          <p class="text-base h-1/2 overflow-hidden text-ellipsis">
            {description}
          </p>
          <button className="!bg-blue-700 text-white mt-auto lg:!size-sm lg:!text-xs">
            START TUTORIAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
