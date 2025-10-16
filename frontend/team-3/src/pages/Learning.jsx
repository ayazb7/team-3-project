import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5 w-full p-10 h-full">
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="h-48 bg-gray-300 rounded w-full min-h-1/2"></div>
    </div>
  );
};

const Learning = () => {
  const [tutorialData, setTutorialData] = useState();
  const [courseData, setCourseData] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const { courseId, tutorialId } = useParams();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/courses/${courseId}/tutorials/${tutorialId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setTutorialData(res.data);

        const courseRes = await axios.get(
          `http://localhost:5000/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log("success", res.data);
        setCourseData(courseRes.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex flex-col justify-start items-start h-full w-full p-10 gap-5 text-sidebar-foreground !text-start overflow-scroll">
      <div className="flex flex-row gap-2">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Dashboard
        </Link>
        <Link to={`/dashboard/course/${courseData?.id}`}>
          / {courseData?.name || "Course"}
        </Link>
        / {tutorialData?.category || "Tutorial"}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-black text-xl font-bold">{tutorialData?.title}</p>
        <p>Browse this tutorial</p>
      </div>
      <div className="w-full h-1/2 shrink-0">
        <iframe
          src={tutorialData?.video_url}
          loading="lazy"
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
          <p className="mt-auto">{tutorialData?.created_at || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
};

export default Learning;
