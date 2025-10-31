import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { InterpolateSmooth } from "three";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { accessToken } = useAuth();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/courses", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("successfully requested data", res.data);
        setCourses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getCourses();
  }, []);
  return (
    <div className="flex flex-col  items-center w-full h-full p-5 gap-10">
      <div className="w-[60%] lg:w-[40%] h-[10%] relative pb-10">
        <input
          type="text"
          className="absolute w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500 border-1 rounded-lg pl-5 p-2 focus:border-blue-500 flex flex-row"
          placeholder="How to set up email.."
        />
        <button className="absolute end-2.5 top-2 rounded-lg bg-blue-500 text-white w-19">
          Search
        </button>
      </div>
      <div className="flex flex-col gap-5 justify-start items-start h-auto">
        <p className="text-lg font-medium">Get started with these</p>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 justify-center items-center w-full gap-2 items-stretch grid-flow-row-dense">
          {courses.map((item, index) => {
            return <CourseCard {...item} />;
          })}
        </div>
      </div>
      <div className="w-full flex flex-col gap-5 justify-start items-start">
        <p className="text-lg font-medium">
          Recommended for you based on your current courses
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify center items-center w-full gap-2 items-stretch grid-flow-row-dense">
          {courses.map((item, index) => {
            return <CourseCard {...item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
