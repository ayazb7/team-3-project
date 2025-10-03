import React from "react";

const VideoBlock = ({ width, height }) => {
  return (
    <div className={`${width} ${height} rounded-lg`}>
      <div className="bg-gray-200 h-full w-full"></div>
      <div className="absolute"></div>
    </div>
  );
};

export default VideoBlock;
