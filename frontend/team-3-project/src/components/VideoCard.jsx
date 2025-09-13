import React from "react";

const VideoCard = ({ title, description }) => {
  return (
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
      <div class="w-full h-50 bg-white" />
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{title}</div>
        <p class="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
