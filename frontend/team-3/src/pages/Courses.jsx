import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { useDebouncedCallback } from "use-debounce";

const RenderSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full h-lvh p-5 gap-10 overflow-y-scroll animate-pulse">
      <div className="h-10 w-1/2 bg-gray-200 rounded-xl" />
      <div className="flex flex-col gap-5 justify-start items-start h-full w-full">
        <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center w-full gap-2 items-stretch grid-flow-row-dense h-full">
          {Array.from({ length: 6 }, (_, index) => {
            return (
              <div
                key={index}
                className="h-full bg-gray-200 rounded-lg dark:bg-gray-700 w-full"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RenderCourses = (label, courses) => {
  return (
    <div className="flex flex-col gap-5 justify-start items-start h-auto">
      <p className="text-lg font-medium">{label}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center w-full gap-2 items-stretch grid-flow-row-dense">
        {courses.map((item, index) => {
          return <CourseCard {...item} key={index} />;
        })}
      </div>
    </div>
  );
};

const Courses = () => {
  const location = useLocation();
  const isInDashboard = location.pathname === "/dashboard/courses";
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchedCourses, setSearchedCourses] = useState(null);
  const [recCourses, setRecCourses] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5003";
  const { accessToken, api } = useAuth();

  const handleOnChange = (value) => {
    if (!value) {
      setSearchedCourses(null);
      return;
    }

    try {
      api
        .post("/embedding/course", { text: value })
        .then((res) => {
          setSearchedCourses(res.data);
        })
        .catch((e) => {
          console.log(e);
          if (e.response?.status === 503) {
            console.log("Embeddings still initializing...");
          } else if (e.response?.status === 404) {
            console.log("No matching courses found");
          }
          setSearchedCourses(null);
        });
    } catch (e) {
      console.log(e);
      setSearchedCourses(null);
    }
  };

  const debouncedHandleOnChange = useDebouncedCallback(handleOnChange, 500);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      try {
        if (isInDashboard && accessToken) {
          try {
            const res = await axios.get(`${API_URL}/courses/unenrolled-courses`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log("successfully requested unenrolled courses", res.data);
            setCourses(res.data);
          } catch (err) {
            console.log(err);
            setCourses([]);
          }

          try {
            const recRes = await api.get("/embedding/recommended");
            setRecCourses(recRes.data);
          } catch (e) {
            console.log(e);
            if (e.response?.status === 503) {
              console.log("Embeddings still initializing...");
            } else if (e.response?.status === 404) {
              console.log("No enrolled courses for recommendations");
            }
            setRecCourses(null);
          }
        } else {
          // Public courses page - show all public courses
          const res = await axios.get(`${API_URL}/courses/public`);
          console.log("successfully requested public courses", res.data);
          setCourses(res.data);
        }
      } catch (err) {
        console.log("Error fetching courses", err);
        setCourses([]);
      }
      setLoading(false);
    };

    getCourses();
  }, [isInDashboard, accessToken, api]);

  if (loading) {
    return RenderSkeleton();
  }

  return (
    <div className="flex flex-col items-center w-full min-h-lvh p-5 gap-10">
      {isInDashboard && (
        <div className="w-[90%] lg:w-[40%] h-[10%] relative pb-10">
          <input
            type="text"
            className="absolute w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500 border-1 rounded-lg pl-5 p-2 focus:border-blue-500 flex flex-row"
            placeholder="How to set up email.."
            onChange={(e) => debouncedHandleOnChange(e.target.value)}
          />
          <button className="absolute end-2.5 top-2 rounded-lg bg-blue-500 text-white w-19">
            Search
          </button>
        </div>
      )}
      {!searchedCourses &&
        isInDashboard &&
        recCourses &&
        RenderCourses("Recommended based on your enrolled courses", recCourses)}
      {!searchedCourses && RenderCourses(isInDashboard ? "Courses Available to Enroll" : "Explore Our Courses", courses)}
      {searchedCourses && RenderCourses("Search Results", searchedCourses)}
    </div>
  );
};

export default Courses;
