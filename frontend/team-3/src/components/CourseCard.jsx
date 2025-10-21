const CourseCard = ({ name, progress, id }) => (
  <div className="p-2">
    <a
      href={'/dashboard/course/' + id}
      className="block rounded-xl overflow-hidden shadow-md transform transition-transform hover:scale-105"
    >
      {/* Overlay */}
      <div className="relative h-32 bg-black/40 flex items-center justify-center hover:opacity-100 opacity-0 transition-opacity">
        <span className="py-1.5 px-4 text-white rounded text-sm font-medium">
          View
        </span>
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        <h3
          className="font-medium text-gray-900 text-lg truncate"
          title={name}
        >
          {name}
        </h3>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </a>
  </div>
);

export default CourseCard;