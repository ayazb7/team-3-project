const CourseCard = ({ name, progress, progress_percentage, id }) => {
  const displayProgress = progress_percentage !== undefined ? progress_percentage : (progress || 0);

  return (
    <a
      href={'/dashboard/course/' + id}
      className="block rounded-xl overflow-hidden shadow-sm transform transition-transform hover:scale-105 bg-white group"
    >
      <div className="relative h-32 bg-gray-200 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="py-1.5 px-4 text-white rounded-full text-sm font-medium">
            View
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-medium text-gray-900 text-lg truncate"
          title={name}
        >
          {name}
        </h3>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    </a>
  );
};

export default CourseCard;