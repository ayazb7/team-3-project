const RecommendedCard = ({ title, rating}) => (
  <div className = "p-2 transform transition-all duration-300 hover:scale-105">
    <a href="#" className="group">
      <div className="bg-white block rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all">
        <div className="text-center mb-4 ">
          <h3 className="text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{rating}</p>
        {/* Image / placeholder wrapper */}
          <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden"> {/* Image / placeholder wrapper put thumbnail image here */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <span className="py-1.5 px-4 text-white rounded text-sm font-medium">
                View
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
);

export default RecommendedCard;