import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Target, GraduationCap, Clock, MonitorPlay, Lock, Briefcase, Laptop, Wrench } from "lucide-react";
import CourseCard from "../components/CourseCard";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const getCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses/public`);
        setCourses(res.data.slice(0, 3));
      } catch (err) {
        console.log(err);
      }
    };

    getCourses();
  }, []);

  const features = [
    {
      Icon: Target,
      title: "Beginner Friendly",
      description: "Designed for digital beginners with step-by-step guidance"
    },
    {
      Icon: GraduationCap,
      title: "Expert-Led Courses",
      description: "Learn from experienced instructors who understand your needs"
    },
    {
      Icon: Clock,
      title: "Learn at Your Pace",
      description: "Study when it suits you, no deadlines or pressure"
    },
    {
      Icon: MonitorPlay,
      title: "Practice-Focused",
      description: "Hands-on exercises to build confidence with technology"
    }
  ];

  const categories = [
    { name: "Digital Basics", description: "Passwords, Email & Online Safety", Icon: Lock },
    { name: "Job Skills", description: "LinkedIn, CV & Job Applications", Icon: Briefcase },
    { name: "Devices", description: "Smartphones, Mac & Windows", Icon: Laptop },
    { name: "Workplace Tools", description: "MS Teams, Cloud & Collaboration", Icon: Wrench }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Wave Background */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 opacity-60"></div>
        
        {/* Wave SVG Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute bottom-0 w-full h-64" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" fill="url(#wave-gradient-1)"></path>
            <defs>
              <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#ac1ec4', stopOpacity: 0.3 }} />
                <stop offset="50%" style={{ stopColor: '#1c50fe', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#ac1ec4', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
          </svg>
          <svg className="absolute top-0 w-full h-64 rotate-180" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C150,80 350,20 600,60 C850,100 1050,40 1200,60 L1200,120 L0,120 Z" fill="url(#wave-gradient-2)"></path>
            <defs>
              <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#ff8a01', stopOpacity: 0.2 }} />
                <stop offset="50%" style={{ stopColor: '#ea0c3c', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#ac1ec4', stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="sky-gradient-text">SkyWise</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Your journey to digital confidence starts here
            </p>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
              Master essential tech skills at your own pace. From setting up your first email to navigating workplace tools, we make technology accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] rounded-full hover:shadow-lg hover:shadow-[#ac1ec4]/30 transition-all duration-200 hover:scale-105 w-full sm:w-auto"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:border-gray-400 transition-all transform hover:scale-105 shadow-md w-full sm:w-auto"
              >
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose SkyWise?
          </div>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We understand that starting with technology can feel overwhelming. That's why we've created a supportive learning environment just for you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.Icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  <div className="mb-4 flex justify-center">
                    <IconComponent className="w-12 h-12 text-[#ac1ec4]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-3xl md:text-4xl font-bold text-center mb-4">
            What You'll Learn
          </div>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive courses covering everything you need to thrive in today's digital world
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.Icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="group-hover:scale-110 transition-transform">
                      <IconComponent className="w-10 h-10 text-[#1c50fe]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 group-hover:sky-gradient-text transition-all">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      {courses.length > 0 && (
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-3xl md:text-4xl font-bold text-center mb-4">
              Featured Courses
            </div>
            <p className="text-lg text-gray-600 text-center mb-12">
              Start your learning journey with these popular courses
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  difficulty={course.difficulty}
                  thumbnail_url={course.thumbnail_url}
                  duration_max_minutes={course.duration_max_minutes}
                  duration_min_minutes={course.duration_min_minutes}
                  name={course.name}
                  id={course.id}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] rounded-full hover:shadow-lg hover:shadow-[#ac1ec4]/30 transition-all duration-200 hover:scale-105"
              >
                View All Courses
              </button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </div>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to begin your learning journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#ac1ec4]/30">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account in seconds. No credit card required.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#ac1ec4]/30">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3">Choose a Course</h3>
              <p className="text-gray-600">
                Browse our courses and pick one that matches your goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#ac1ec4]/30">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3">Start Learning</h3>
              <p className="text-gray-600">
                Follow along with videos and practice exercises at your own pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ready to Get Started?
            </div>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              Join thousands of learners building their digital confidence with SkyWise
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 text-lg font-semibold bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Learning Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
