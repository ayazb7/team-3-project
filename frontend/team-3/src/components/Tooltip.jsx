import { MdInfoOutline } from "react-icons/md";
 
const Tooltip = ({ field, tooltipVisible, onToggle, content, ariaLabel }) => {
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => onToggle(field)}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
        aria-label={ariaLabel}
      >
        <MdInfoOutline className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
      </button>
      {/* Desktop: hover tooltip */}
      <div className="hidden md:block absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-20 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {content}
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
      </div>
      {/* Mobile: click tooltip */}
      {tooltipVisible && (
        <div className="md:hidden absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-20 shadow-lg">
          {content}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};
 
export default Tooltip;
 
 
