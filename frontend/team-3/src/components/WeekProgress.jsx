const WeekProgress = () => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayColors = ['bg-gray-300', 'bg-gray-300', 'bg-orange-500', 'bg-gray-300', 'bg-purple-500', 'bg-blue-500', 'bg-blue-600'];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-around items-end h-32">
        {weekDays.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className="relative">
              <div 
                className={`w-8 ${dayColors[idx]} rounded-full transition-all`}
                style={{ height: `${(idx + 60)}px` }}
              ></div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <span className="text-xs font-medium text-gray-600">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekProgress;