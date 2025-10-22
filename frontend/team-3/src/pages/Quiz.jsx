import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5 w-full p-10 h-full">
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="h-48 bg-gray-300 rounded w-full min-h-1/2"></div>
    </div>
  );
};

export default function Quiz() {
  const [quizData, setQuizData] = useState(null);
  const [tutorialData, setTutorialData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId, tutorialId, quizId } = useParams();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await axios.get(
          `http://localhost:5000/quizzes/${quizId}/full`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const tutorialRes = await axios.get(
          `http://localhost:5000/courses/${courseId}/tutorials/${tutorialId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const courseRes = await axios.get(
          `http://localhost:5000/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setQuizData(quizRes.data);
        setTutorialData(tutorialRes.data);
        setCourseData(courseRes.data);
        console.log("Quiz data fetched successfully", quizRes.data);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, tutorialId, quizId, accessToken]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="relative flex flex-col justify-start items-start h-full w-full p-10 gap-5 text-foreground !text-start overflow-scroll">
      <div className="flex flex-row gap-2 text-gray-700">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Dashboard
        </Link>
        <span className="text-gray-500">/</span>
        <Link
          to={`/dashboard/course/${courseData?.id}`}
          className="text-blue-500 hover:underline"
        >
          {courseData?.name || "Course"}
        </Link>
        <span className="text-gray-500">/</span>
        <Link
          to={`/dashboard/course/${courseId}/learning/${tutorialId}`}
          className="text-blue-500 hover:underline"
        >
          {tutorialData?.category || "Tutorial"}
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-900">{quizData?.title || "Quiz"}</span>
      </div>
      
      <div className="flex flex-col gap-2">
        <p className="text-black text-xl font-bold">{quizData?.title}</p>
      </div>

      <div className="w-full flex-grow bg-gray-100 rounded-lg p-8">
      </div>
    </div>
  );
}