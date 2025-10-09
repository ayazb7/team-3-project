const RecommendedCard = ({ title, rating }) => (
  <div className="p-2 transform transition-transform duration-300 hover:scale-105">
    <a href="#" className="block rounded-xl overflow-hidden shadow-md">
      {/* Image or Placeholder with Overlay */}
      <div className="relative h-32 bg-gray-200">
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
          <span className="py-1.5 px-4 text-white rounded text-sm font-medium">
            View
          </span>
        </div>
        {/*insert an img here later */}
      </div>

      {/* Card Content */}
      <div className="p-4 bg-white">
        <h3 className="font-medium text-gray-900 text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{rating}</p>
      </div>
    </a>
  </div>
);

export default RecommendedCard;
