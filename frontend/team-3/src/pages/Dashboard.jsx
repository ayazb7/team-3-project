import React, { useState } from 'react';
import { Clock, Play, GraduationCap, MapPin } from 'lucide-react';
import StatCard from '../components/StatCard';
import CourseCard from '../components/CourseCard';
import RecommendedCard from '../components/RecommendedCard.jsx';
import EventCard from '../components/EventCard';
import WeekProgress from '../components/WeekProgress.jsx';

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
  </div>
);

export default function Dashboard() {
  const stats = [
    { label: 'Courses Completed', value: '10', icon: GraduationCap, color: 'bg-blue-50' },
    { label: 'Tutorials Watched', value: '31', icon: Play, color: 'bg-green-50' },
    { label: 'Time Spent', value: '5.3', subtext: 'this week', icon: Clock, color: 'bg-red-50' }
  ];

  const continueCourses = [
    { title: 'Borderlands 4 Walkthrough', progress: 15 },
    { title: 'Fundamentals of AWS', progress: 65 },
    { title: 'How to open an Email', progress: 35 }
  ];

  const recommended = [
    { title: 'Borderlands 4', rating: '94% Rating' },
    { title: 'Dying Light', rating: '87% Rating' },
    { title: 'League of Legends', rating: '11% Rating' }
  ];

  const events = [
    { title: 'Sky Showcase', location: 'Sky Central - Osterley Campus', date: 'Thursday 13th November 2025' },
    { title: 'Sky Showcase', location: 'Sky Central - Osterley Campus', date: 'Thursday 13th November 2025' },
    { title: 'Sky Showcase', location: 'Sky Central - Osterley Campus', date: 'Thursday 13th November 2025' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div>

            {/* Continue Section */}
            <div>
              <SectionHeader 
                title="Continue?" 
                subtitle="View your recently accessed courses." 
              />
              <div className="grid grid-cols-3 gap-4">
                {continueCourses.map((course, idx) => (
                  <CourseCard key={idx} {...course} />
                ))}
              </div>
            </div>

            {/* Recommended Section */}
            <div>
              <SectionHeader 
                title="Recommended For You" 
                subtitle="Tailored just for you." 
              />
              <div className="grid grid-cols-3 gap-4">
                {recommended.map((item, idx) => (
                  <RecommendedCard key={idx} {...item} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Week Progress */}
            <WeekProgress />

            {/* Nearby Events */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Nearby Events</h3>
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mb-4">Connect with other learners at these events!</p>
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