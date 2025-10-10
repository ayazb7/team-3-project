import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Learning = () => {
  const [tutorialData, setTutorialData] = useState();
  const [courseData, setCourseData] = useState();
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
    <div className="flex flex-col justify-start items-start h-full w-full p-10 gap-5 text-sidebar-foreground !text-start">
      <p className="">Dashboard / {courseData?.name} /</p>
      <div className="flex flex-col gap-2">
        <p className="text-black text-xl font-bold">{tutorialData?.title}</p>
        <p>{tutorialData?.description}</p>
      </div>
      <div className="w-full h-96">
        <iframe
          src="https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb"
          loading="lazy"
          title="Synthesia video player - How to create a strong password and stay safe online?"
          allow="encrypted-media; fullscreen;"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default Learning;
