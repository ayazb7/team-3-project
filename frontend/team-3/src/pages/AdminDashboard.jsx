import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { api } = useAuth();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Admin access required');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(err.response?.data?.error || 'Failed to load stats');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold sky-gradient-text">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and statistics</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.total_users}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Users (7d)"
          value={stats.active_users}
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.total_courses}
        />
        <StatCard
          icon={GraduationCap}
          label="Avg Completion"
          value={`${stats.avg_completion}%`}
        />
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">User Growth (Last 30 Days)</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {stats.user_growth.length === 0 ? (
            <p className="text-gray-500 text-center w-full">No user growth data available</p>
          ) : (
            stats.user_growth.map((day, index) => {
              const maxCount = Math.max(...stats.user_growth.map(d => d.count));
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: height > 0 ? '20px' : '0' }}
                    title={`${new Date(day.date).toLocaleDateString()}: ${day.count} users`}
                  />
                  <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Course Stats Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Course Performance</h2>
          <button
            onClick={() => navigate('/admin/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Manage Courses
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Course Name</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Enrolled</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Completed</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Progress</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {stats.course_stats.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No course data available
                  </td>
                </tr>
              ) : (
                stats.course_stats.map((course) => {
                  const completionRate = course.enrolled > 0
                    ? ((course.completed / course.enrolled) * 100).toFixed(1)
                    : 0;

                  return (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{course.name}</td>
                      <td className="py-3 px-4 text-center">{course.enrolled}</td>
                      <td className="py-3 px-4 text-center">{course.completed}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                              style={{ width: `${course.avg_progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{course.avg_progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          completionRate >= 50 ? 'bg-green-100 text-green-700' :
                          completionRate >= 25 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {completionRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow group"
        >
          <Users className="w-10 h-10 text-blue-600 mb-3" />
          <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
            User Management
          </h3>
          <p className="text-gray-600 text-sm">View and analyze user metrics</p>
        </button>

        <button
          onClick={() => navigate('/admin/courses')}
          className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow group"
        >
          <BookOpen className="w-10 h-10 text-purple-600 mb-3" />
          <h3 className="text-lg font-bold mb-1 group-hover:text-purple-600 transition-colors">
            Course Management
          </h3>
          <p className="text-gray-600 text-sm">Add, edit, or remove courses</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
