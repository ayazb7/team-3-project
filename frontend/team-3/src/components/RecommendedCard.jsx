const RecommendedCard = ({ title, rating, id }) => (
  <a href={'/dashboard/course/' + id} className="block rounded-xl overflow-hidden shadow-sm transform transition-transform duration-300 hover:scale-105 bg-white">
    <div className="relative h-32 bg-gray-200">
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
        <span className="py-1.5 px-4 text-white rounded text-sm font-medium">
          View
        </span>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-medium text-gray-900 text-lg mb-1 truncate">{title}</h3>
      <p className="text-sm text-gray-500">{rating}</p>
    </div>
  </a>
);

export default RecommendedCard;
