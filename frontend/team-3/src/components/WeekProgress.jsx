const WeekProgress = ({ weeklyActivity = {} }) => {
  const weekDays = [
    { short: 'M', key: 'MO' },
    { short: 'T', key: 'TU' },
    { short: 'W', key: 'WE' },
    { short: 'T', key: 'TH' },
    { short: 'F', key: 'FR' },
    { short: 'S', key: 'SA' },
    { short: 'S', key: 'SU' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-around items-end h-32">
        {weekDays.map((day, idx) => {
          const isActive = weeklyActivity[day.key] || false;
          const height = isActive ? (idx + 80) : (idx + 60);
          const bgColor = isActive ? 'bg-blue-500' : 'bg-gray-300';

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="relative">
                <div
                  className={`w-8 ${bgColor} rounded-full transition-all`}
                  style={{ height: `${height}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-gray-600">{day.short}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekProgress;