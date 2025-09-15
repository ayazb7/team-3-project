import React from "react";
import VideoCard from "./VideoCard";

const VideoCardList = ({ videos }) => {
  return (
    <div className="h-full flex flex-wrap flex-row justify-center items-center gap-4 p-4 items-stretch">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          title={video.title}
          description={video.description}
        />
      ))}
    </div>
  );
};

export default VideoCardList;
