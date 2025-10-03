const CourseCard = ({ title, progress }) => (
<div className="transform transition-all duration-300 hover:scale-105">
  <a href="#" className="bg-white block rounded-xl shadow-sm overflow-hidden group">
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">

        
      <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden"> {/* Image / placeholder wrapper put thumbnail image here */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <span className="py-1.5 px-4 text-white bg-grey-500 rounded text-sm font-medium">
                View
              </span>
            </div>
          </div>
      <h3 className="font-medium text-gray-900 mb-3">
        {title}
      </h3>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div 
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  </a>
</div>
);

export default CourseCard;