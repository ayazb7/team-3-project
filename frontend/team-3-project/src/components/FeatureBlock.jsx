import React from "react";

const FeatureBlock = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full text-center gap-4 bg-gray-200 p-10 rounded">
      <p className="text-4xl">{icon}</p>
      <p className="text-lg">{title}</p>
      <p className="font-thin">{description}</p>
    </div>
  );
};

export default FeatureBlock;
