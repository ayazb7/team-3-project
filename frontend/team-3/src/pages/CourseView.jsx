import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Lottie from "react-lottie-player";
import lockAnim from "../assets/lock.json";
import {
  Clock,
  GraduationCap,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard.jsx";

const Skeleton = () => (
  <div className="animate-pulse space-y-6 text-left">
    <div className="h-5 bg-gray-200 rounded w-1/3" />
    <div className="h-56 bg-gray-200 rounded-2xl shadow-md" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="h-40 bg-gray-200 rounded-2xl shadow-md" />
      <div className="h-40 bg-gray-200 rounded-2xl shadow-md" />
      <div className="h-40 bg-gray-200 rounded-2xl shadow-md" />
    </div>
  </div>
);

export default function CourseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [course, setCourse] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // MVP hard-coded bits
  // const courseType = "Cyber Security";
  // const duration = "45–60 mins";

  const similar = [
    { title: "Password Managers 101", rating: "92% Rating" },
    { title: "Avoiding Phishing Emails", rating: "88% Rating" },
    { title: "Two-Factor Authentication", rating: "95% Rating" },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErr(null);

    axios
      .get(`http://localhost:5000/courses/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (!isMounted) return;
        setCourse(res.data);
      })
      .catch((e) => {
        if (!isMounted) return;
        setErr(e?.response?.data?.message || "Unable to load course.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    axios.get(`http://localhost:5000/courses/${id}/tutorials`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => {
      setTutorials(res.data);
    })
    .catch((e) => {
      console.error(e);
    });

    return () => {
      isMounted = false;
    };

  }, [id, accessToken]);

  const startCourse = () => {
    if (tutorials.length > 0) {
      navigate(`/dashboard/course/${id}/learning/${tutorials[0].id}`);
    } else {
      alert("No tutorials found for this course.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8 text-left">
      <div className="mx-auto space-y-6 text-left">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 text-left">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">
            {course?.name || "Course"}
          </span>
        </nav>

        {loading ? (
          <Skeleton />
        ) : err ? (
          <div className="bg-white border border-red-200 rounded-2xl p-6 flex items-start gap-3 shadow-md">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Couldn’t load this course
              </h3>
              <p className="text-sm text-gray-600 mb-4">{err}</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* HERO Card */}
            <section className="bg-white rounded-2xl shadow-md p-5 sm:p-6 lg:p-8 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: placeholder image */}
                <div className="order-1 lg:order-none">
                  <div className="rounded-xl overflow-hidden h-full bg-blue-50/80 flex items-center justify-center shadow-md">
                    <Lottie
                      loop
                      play
                      animationData={lockAnim}
                      className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col">
                  {/* Title + description */}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-left">
                      {course?.name ||
                        "How to create a strong password and stay safe online"}
                    </h1>
                    <p className="text-gray-600 leading-relaxed text-left mt-2">
                      {course?.description ||
                        "Learn the essentials of creating strong, unique passwords, how to use password managers safely, and practical tips to avoid scams and keep your online accounts secure."}
                    </p>
                  </div>

                  <div className="mt-auto pt-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 text-left mb-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                        <GraduationCap className="w-4 h-4" />
                        {course?.difficulty || "Digital Skills"}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        <Clock className="w-4 h-4" />
                        {course.duration_min_minutes} - {course.duration_max_minutes} mins
                      </span>
                      {/* <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                        Type: {courseType}
                      </span> */}
                    </div>

                    {/* Progress + CTA row */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Progress */}
                      <div className="w-full sm:max-w-sm">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{course?.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full transition-all"
                            style={{ width: `${course?.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* CTA bottom-right */}
                      <div className="flex sm:justify-end">
                        <button
                          onClick={startCourse}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-transform"
                        >
                          Start Course
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Course Summary + Prerequisites */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              {/* Summary with bolder bullet styling */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 text-left">
                    Course Summary
                  </h2>

                  <div className="text-gray-700 space-y-4 text-left">
                    <p>{course.summary}</p>

                    {/* Enhanced bullet list */}
                    <ul className="space-y-3">
                      {course.learning_objectives.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
                        >
                          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <aside>
                {/* -- Requirements Card -- */}
                {course.requirements && course.requirements.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 text-left mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 text-left">
                      Requirements
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      {course.requirements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* -- Prerequisites Card -- */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 text-left">
                      Prerequisites
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      {course.prerequisites.map((item, idx) => (
                        <li key={idx}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </section>

            {/* Similar Courses */}
            <section className="text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-left ml-1 sm:ml-2">
                Similar Courses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similar.map((c, idx) => (
                  <CourseCard key={idx} name={c.title} rating={c.rating} id={c.id || idx + 1} thumbnail_url={c.thumbnail_url} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
