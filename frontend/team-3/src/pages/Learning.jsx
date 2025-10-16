import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const RenderOption = ({ label, onClick, roundDirection, className }) => {
  return (
    <span
      className={`hover:bg-gray-300 cursor-pointer h-full w-full flex justify-center items-center ${
        roundDirection === "left" ? "rounded-tl-lg" : "rounded-tr-lg"
      } ${className}`}
      onClick={onClick}
    >
      <p>{label}</p>
    </span>
  );
};

const Learning = () => {
  const [tutorialData, setTutorialData] = useState();
  const [courseData, setCourseData] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const { accessToken } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/courses/${id}/tutorials`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setTutorialData(res.data[0]);

        const courseRes = await axios.get(
          `http://localhost:5000/courses/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log("success", res.data);
        setCourseData(courseRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex flex-col justify-start items-start h-full w-full p-10 gap-5 text-sidebar-foreground !text-start overflow-scroll">
      <p className="">Dashboard / {courseData?.name} </p>
      <div className="flex flex-col gap-2">
        <p className="text-black text-xl font-bold">{tutorialData?.title}</p>
        <p>Browse this tutorial</p>
      </div>
      <div className="w-full h-1/2 shrink-0">
        <iframe
          src={tutorialData?.video_url}
          loading="lazy"
          title="Synthesia video player - How to create a strong password and stay safe online?"
          allow="encrypted-media; fullscreen;"
          className="w-full h-full"
        ></iframe>
      </div>
      <div className="w-full flex-grow h-auto flex flex-col bg-gray-200 rounded-lg">
        <div className="grid grid-cols-2 text-center items-center h-10 divide-x divide-gray-400 shadow-lg shrink-0">
          <RenderOption
            label="Overview"
            roundDirection="left"
            onClick={() => setActiveTab(0)}
            className={`${activeTab == 0 ? "bg-gray-300" : ""}`}
          />
          <RenderOption
            label="Transcript"
            roundDirection="right"
            onClick={() => setActiveTab(1)}
            className={`${activeTab == 1 ? "bg-gray-300" : ""}`}
          />
        </div>
        <div
          className={`${
            activeTab == 0 ? "flex" : "hidden"
          } flex-col w-full h-full p-5 gap-3`}
        >
          <p className="font-bold">Description</p>
          <p>{tutorialData?.description}</p>
          <p className="font-bold">Tutorial Category</p>
          <p>{tutorialData?.category}</p>
        </div>
      </div>
    </div>
  );
};

export default Learning;
