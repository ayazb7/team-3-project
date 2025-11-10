import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { InterpolateSmooth } from "three";
import { useDebouncedCallback } from "use-debounce";

const RenderSkeleton = () => {
  return (
    <div className="flex flex-col  items-center w-full h-lvh p-5 gap-10 overflow-y-scroll animate-pulse">
      <div className="h-10 w-1/2 bg-gray-200 rounded-xl" />
      <div className="flex flex-col gap-5 justify-start items-start h-full w-full">
        <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4" />
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 justify-center items-center w-full gap-2 items-stretch grid-flow-row-dense h-full">
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
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 justify-center items-center w-full gap-2 items-stretch grid-flow-row-dense">
        {courses.map((item, index) => {
          return <CourseCard {...item} />;
        })}
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { accessToken, fetchUserDetails } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchedCourses, setSearchedCourses] = useState(null);
  const [recCourses, setRecCourses] = useState(null);
  const [loading, setLoading] = useState(false);

  const { api } = useAuth();

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
        });
    } catch (e) {
      console.log(e);
      setsearchedCourses(null);
    }
  };

  const debouncedHandleOnChange = useDebouncedCallback(handleOnChange, 500);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      try {
        await fetchUserDetails();
        setIsLoggedIn(true && accessToken);

        try {
          const res = await axios.get("http://localhost:5000/courses", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          console.log("successfully requested data", res.data);
          setCourses(res.data);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log("Error fetching user details using public route....", err);

        try {
          const publicRes = await axios.get(
            "http://localhost:5000/courses/public"
          );
          console.log("successfully requested public data", publicRes.data);
          setCourses(publicRes.data);
        } catch (publicErr) {
          console.log("Error fetching public courses", publicErr);
        }
      }

      try {
        api.get("/embedding/recommended").then((res) => {
          setRecCourses(res.data);
        });
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    getCourses();
  }, []);

  useEffect(() => {
    console.log(searchedCourses);
    console.log(!searchedCourses);
  }, [searchedCourses]);

  if (loading) {
    return RenderSkeleton();
  }

  return (
    <div className="flex flex-col  items-center w-full min-h-lvh p-5 gap-10 ">
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
      {!searchedCourses && RenderCourses("Get started with these", courses)}
      {!searchedCourses &&
        isLoggedIn &&
        recCourses &&
        RenderCourses("Recommended based on your enrolled courses", recCourses)}
      {searchedCourses && RenderCourses("", searchedCourses)}
    </div>
  );
};

export default Courses;
