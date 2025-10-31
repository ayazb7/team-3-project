import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Play,
  GraduationCap,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import CourseCard from "../components/CourseCard";
import EventCard from "../components/EventCard";
import WeekProgress from "../components/WeekProgress.jsx";

const Carousel = ({ items, renderItem, className }) => {
  const containerRef = useRef(null);
  const [isStartReached, setIsStartReached] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);

  const checkScrollPosition = () => {
    const container = containerRef.current;
    if (container) {
      setIsStartReached(container.scrollLeft <= 0);
      setIsEndReached(
        container.scrollLeft >=
          container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = container.clientWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newScroll =
        container.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);

      container.scrollTo({
        left: Math.max(0, Math.min(maxScroll, newScroll)),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, []);

  return (
    <div className="relative group/carousel">
      <div
        ref={containerRef}
        className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 md:gap-4 py-2 px-1 ${className}`}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex-none w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] snap-start"
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {!isStartReached && (
        <button
          onClick={() => scroll("left")}
          className="opacity-0 group-hover/carousel:opacity-100 md:opacity-100 transition-opacity absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-transform"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {!isEndReached && (
        <button
          onClick={() => scroll("right")}
          className="opacity-0 group-hover/carousel:opacity-100 md:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-transform"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
  </div>
);

export default function Dashboard() {
  const { api } = useAuth();

  const [stats, setStats] = useState([
    {
      label: "Courses Completed",
      value: "0",
      icon: GraduationCap,
      color: "bg-blue-50",
    },
    {
      label: "Tutorials Watched",
      value: "0",
      icon: Play,
      color: "bg-green-50",
    },
    {
      label: "Time Spent",
      value: "0",
      subtext: "this week",
      icon: Clock,
      color: "bg-red-50",
    },
  ]);

  const [continueCourses, setContinueCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const events = [
    {
      title: "Sky Showcase",
      location: "Sky Central - Osterley Campus",
      date: "Thursday 13th November 2025",
    },
    {
      title: "Sky Showcase",
      location: "Sky Central - Osterley Campus",
      date: "Thursday 13th November 2025",
    },
    {
      title: "Sky Showcase",
      location: "Sky Central - Osterley Campus",
      date: "Thursday 13th November 2025",
    },
  ];

  const [scrolling, setScrolling] = useState(false);

  const preventScroll = (e) => {
    if (scrolling) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [scrolling]);

  // Fetch dashboard stats
  useEffect(() => {
    let isMounted = true;

    if (!api) return;

    // Fetch dashboard stats
    api
      .get("/dashboard/stats")
      .then((res) => {
        if (!isMounted) return;

        const data = res.data;

        // Update stats with real data
        setStats([
          {
            label: "Courses Completed",
            value: data.courses_completed.toString(),
            icon: GraduationCap,
            color: "bg-blue-50",
          },
          {
            label: "Tutorials Watched",
            value: data.tutorials_watched.toString(),
            icon: Play,
            color: "bg-green-50",
          },
          {
            label: "Time Spent",
            value: data.time_spent_hours.toString(),
            subtext: "this week",
            icon: Clock,
            color: "bg-red-50",
          },
        ]);

        // Store weekly activity for WeekProgress component
        setWeeklyActivity(data.weekly_activity);
      })
      .catch((e) => {
        if (!isMounted) return;
        console.error("Error fetching dashboard stats:", e);
        // Keep default values on error
      });

    return () => {
      isMounted = false;
    };
  }, [api]);

  // Fetch courses
  useEffect(() => {
    let isMounted = true;

    if (!api) return;

    api
      .get("/courses")
      .then((res) => {
        if (!isMounted) return;

        const courses = res.data;
        const inProgressCourses = courses.filter(
          (course) => course.progress > 0 && course.progress < 100
        );
        const completedCourses = courses.filter(
          (course) => course.progress >= 100
        );

        setContinueCourses(inProgressCourses);
        setCompletedCourses(completedCourses);
        setAllCourses(courses);
      })
      .catch((e) => {
        if (!isMounted) return;
        console.error("Error fetching courses:", e);
        setError(e?.response?.data?.message || "Unable to load courses.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [api]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="mx-auto justify-center items-center">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-left text-gray-500 mt-1">Welcome back</p>
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-transform"
              onClick={() => console.log("Toggle light mode")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div>

            {/* Continue Section - Only show if there are courses in progress */}
            {!loading && continueCourses.length > 0 && (
              <div className="Continue">
                <SectionHeader
                  title="Continue?"
                  subtitle="View your recently accessed courses."
                />
                <Carousel
                  items={continueCourses}
                  renderItem={(course, idx) => (
                    <CourseCard key={idx} {...course} id={course.id} />
                  )}
                  className="pb-6"
                />
              </div>
            )}

            {/* Completed Courses Section */}
            {!loading && completedCourses.length > 0 && (
              <div className="CompletedCourses">
                <SectionHeader
                  title="Completed Courses"
                  subtitle="Courses you've finished — great work!"
                />
                <Carousel
                  items={completedCourses}
                  renderItem={(course, idx) => (
                    <CourseCard key={idx} {...course} id={course.id} />
                  )}
                  className="pb-6"
                />
              </div>
            )}

            {/* All Courses Section */}
            <div className="AllCourses">
              <SectionHeader
                title="All Courses"
                subtitle="Explore all available learning paths."
              />
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : allCourses.length > 0 ? (
                <Carousel
                  items={allCourses}
                  renderItem={(course, idx) => (
                    <CourseCard key={idx} {...course} id={course.id} />
                  )}
                  className="pb-6"
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No courses available at the moment.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Week Progress */}
            <WeekProgress weeklyActivity={weeklyActivity} />

            {/* Nearby Events */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Nearby Events</h3>
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Connect with other learners at these events!
              </p>
              <div className="space-y-3">
                {events.map((event, idx) => (
                  <EventCard key={idx} {...event} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
