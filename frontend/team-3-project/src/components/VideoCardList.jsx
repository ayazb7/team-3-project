import React from "react";
import VideoCard from "./VideoCard";

const VideoCardList = ({ videos }) => {
  return (
    <div className="flex flex-wrap flex-row justify-center gap-4 p-4">
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
