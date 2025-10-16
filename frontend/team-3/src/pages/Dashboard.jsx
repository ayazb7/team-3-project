import React, { useState, useRef, useEffect } from 'react';
import { Clock, Play, GraduationCap, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import CourseCard from '../components/CourseCard';
import RecommendedCard from '../components/RecommendedCard.jsx';
import EventCard from '../components/EventCard';
import WeekProgress from '../components/WeekProgress.jsx';

const Carousel = ({ items, renderItem, className }) => {
  const containerRef = useRef(null);
  const [isStartReached, setIsStartReached] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);

  const checkScrollPosition = () => {
    const container = containerRef.current;
    if (container) {
      setIsStartReached(container.scrollLeft <= 0);
      setIsEndReached(
        container.scrollLeft >= container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = container.clientWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newScroll = container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      
      container.scrollTo({
        left: Math.max(0, Math.min(maxScroll, newScroll)),
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  return (
    <div className="relative group">
      <div 
        ref={containerRef}
        className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 ${className}`}
      >
        {items.map((item, idx) => (
          <div key={idx} className="flex-none w-[85%] sm:w-[45%] lg:w-[30%] snap-start">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
      
      {!isStartReached && (
        <button
          onClick={() => scroll('left')}
          className="opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-transform"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      
      {!isEndReached && (
        <button
          onClick={() => scroll('right')}
          className="opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-transform"
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
  const stats = [
    { label: 'Courses Completed', value: '10', icon: GraduationCap, color: 'bg-blue-50' },
    { label: 'Tutorials Watched', value: '31', icon: Play, color: 'bg-green-50' },
    { label: 'Time Spent', value: '5.3', subtext: 'this week', icon: Clock, color: 'bg-red-50' }
  ];

  const continueCourses = [
    { id: 1, title: 'Borderlands 4 Walkthrough', progress: 15 },
    { id: 1, title: 'Fundamentals of AWS', progress: 65 },
    { id: 1, title: 'How to open an Email', progress: 35 }
  ];

  const recommended = [
    { id: 1, title: 'Borderlands 4', rating: '94% Rating' },
    { id: 1, title: 'Dying Light', rating: '87% Rating' },
    { id: 1, title: 'League of Legends', rating: '11% Rating' }
  ];

  const events = [
    { title: 'Sky Showcase', location: 'Sky Central - Osterley Campus', date: 'Thursday 13th November 2025' },
    { title: 'Sky Showcase', location: 'Sky Central - Osterley Campus', date: 'Thursday 13th November 2025' },
    { title: 'Sky Showcase', location: 'Sky Central - Osterley Campus', date: 'Thursday 13th November 2025' }
  ];

  const [scrolling, setScrolling] = useState(false);

  const preventScroll = (e) => {
    if (scrolling) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  React.useEffect(() => {
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [scrolling]);

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-left text-gray-500 mt-1">Welcome back</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-transform"
              onClick={() => console.log('Toggle light mode')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div>

            {/* Continue Section */}
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
                className="pb-8"
              />
            </div>

            {/* Recommended Section */}
            <div className="Recommended">
              <SectionHeader 
                title="Recommended For You" 
                subtitle="Tailored just for you." 
              />
              <Carousel
                items={recommended}
                renderItem={(item, idx) => (
                  <RecommendedCard key={idx} {...item} />
                )}
                className="pb-8"
              />
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Week Progress */}
            <WeekProgress />

            {/* Nearby Events */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
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