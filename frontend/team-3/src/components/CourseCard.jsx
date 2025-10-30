const CourseCard = ({ name, progress, rating, id, thumbnail_url }) => (
  <a
    href={'/dashboard/course/' + id}
    className="block rounded-xl overflow-hidden shadow-sm transform transition-transform hover:scale-105 bg-white"
  >
    <div 
      className="relative h-48 bg-gray-200 bg-cover bg-center group/card"
      style={thumbnail_url ? { backgroundImage: `url(${thumbnail_url})` } : {}}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
        <span className="py-1.5 px-4 text-white rounded text-sm font-medium">
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

      {progress !== undefined && progress !== null ? (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      ) : rating ? (
        <p className="text-sm text-gray-500 mt-1">{rating}</p>
      ) : null}
    </div>
  </a>
);

export default CourseCard;