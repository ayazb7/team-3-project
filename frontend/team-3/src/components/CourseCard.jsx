const CourseCard = ({ title, progress }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <div className="h-32 bg-gray-100 rounded-lg mb-4"></div>
    <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div 
        className="bg-blue-500 h-1.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default CourseCard;