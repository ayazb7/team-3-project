const EventCard = ({ title, location, date }) => (
  <div className="bg-blue-100 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="mt-1">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-600 mb-1">{location}</p>
        <p className="text-xs text-blue-600 mb-2">{date}</p>
        <button className="w-full py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded font-medium">
          RSVP
        </button>
      </div>
    </div>
  </div>
);

export default EventCard;