const RecommendedCard = ({ title, rating }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="text-center mb-4">
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{rating}</p>
    </div>
    <div className="h-32 bg-gray-100 rounded-lg mb-4"></div>
    <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-900">
      View
    </button>
  </div>
);

export default RecommendedCard