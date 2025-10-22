const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="font-bold text-gray-900 text-sm">{label}</span>
      <div className={`p-2 ${color} rounded-lg`}>
        <Icon className="w-5 h-5 text-gray-700" />
      </div>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-4xl font-bold text-gray-900">{value}</span>
      {subtext && <span className="text-sm text-gray-500 mb-1">{subtext}</span>}
    </div>
  </div>
);

export default StatCard;