import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ArrowLeft, TrendingUp, BookOpen, Play, Award, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';

const UserMetrics = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Admin access required');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(err.response?.data?.error || 'Failed to load users');
      }
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/admin/users/${userId}`);
      setUserDetails(response.data);
      setDetailsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load user details');
      setDetailsLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user.id);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && !users.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // User List View
  if (!selectedUser) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold sky-gradient-text">User Metrics</h1>
          <p className="text-gray-600 mt-1">View detailed statistics for all users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Enrolled</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Watched</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Progress</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{user.courses_enrolled}</td>
                    <td className="py-3 px-4 text-center">{user.tutorials_watched}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            style={{ width: `${user.avg_progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{user.avg_progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // User Details View
  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBackToList}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold sky-gradient-text">{selectedUser.username}</h1>
          <p className="text-gray-600 mt-1">{selectedUser.email}</p>
        </div>
      </div>

      {detailsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : userDetails ? (
        <>
          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium mt-1 capitalize">{userDetails.user.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p className="font-medium mt-1">{userDetails.user.language_preference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium mt-1">
                  {new Date(userDetails.user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium mt-1">{userDetails.user.id}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icon={BookOpen}
              label="Courses Enrolled"
              value={userDetails.stats.courses_enrolled}
            />
            <StatCard
              icon={TrendingUp}
              label="Courses Completed"
              value={userDetails.stats.courses_completed}
            />
            <StatCard
              icon={Play}
              label="Tutorials Watched"
              value={userDetails.stats.tutorials_watched}
            />
            <StatCard
              icon={Award}
              label="Quizzes Submitted"
              value={userDetails.stats.quizzes_submitted}
            />
            <StatCard
              icon={Award}
              label="Avg Quiz Score"
              value={`${userDetails.stats.avg_quiz_score}%`}
            />
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Weekly Activity</h2>
            <div className="flex items-end justify-between gap-2 h-32">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const count = userDetails.weekly_activity[day] || 0;
                const maxCount = Math.max(...Object.values(userDetails.weekly_activity), 1);
                const height = (count / maxCount) * 100;

                return (
                  <div key={day} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        count > 0 ? 'bg-gradient-to-t from-blue-600 to-purple-600' : 'bg-gray-200'
                      }`}
                      style={{ height: count > 0 ? `${height}%` : '10%' }}
                      title={`${day}: ${count} activities`}
                    />
                    <span className="text-xs text-gray-500 mt-2">{day.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Course Progress</h2>
            {userDetails.course_progress.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No courses enrolled yet</p>
            ) : (
              <div className="space-y-3">
                {userDetails.course_progress.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{course.course_name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(course.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default UserMetrics;
