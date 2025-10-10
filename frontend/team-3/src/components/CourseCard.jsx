

const CourseCard = ({ title, progress, image }) => (
  <div className="p-2">
    <a
      href="https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden shadow-md transform transition-transform hover:scale-105"
    >
      {/* Image Container with Overlay */}
      <div className="relative h-32 overflow-hidden group">
        {/* Thumbnail Image */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
       
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="py-1.5 px-4 text-white rounded text-sm font-medium">
            View
          </span>
        </div>
      </div>
 
      {/* Content */}
      <div className="p-4 bg-white">
        <h3
          className="font-medium text-gray-900 text-lg truncate"
          title={title}
        >
          {title}
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