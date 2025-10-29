import { CiLock, CiUser } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import Tooltip from "./Tooltip";

const FormField = ({
  type,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  validationError,
  fieldTouched,
  tooltipVisible,
  onToggleTooltip,
  tooltipContent,
  showPassword,
  onTogglePassword,
  required = true,
}) => {
  const getIcon = () => {
    switch (type) {
      case "email":
        return <MdAlternateEmail className="w-5 h-5 text-slate-600 shrink-0" />;
      case "text":
        return <CiUser className="w-5 h-5 text-slate-600 shrink-0" />;
      case "password":
        return <CiLock className="w-5 h-5 text-slate-600 shrink-0" />;
      default:
        return null;
    }
  };

  const getAriaLabel = () => {
    switch (type) {
      case "email":
        return "Show email requirements";
      case "text":
        return "Show username requirements";
      case "password":
        return "Show password requirements";
      default:
        return "Show requirements";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2 text-left flex items-center gap-1">
        {label}:
        <Tooltip
          field={name}
          tooltipVisible={tooltipVisible}
          onToggle={onToggleTooltip}
          content={tooltipContent}
          ariaLabel={getAriaLabel()}
        />
      </label>
      <div
        className={`flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 transition-all ${
          validationError && fieldTouched
            ? "ring-red-300 focus-within:ring-2 focus-within:ring-red-500"
            : "ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4]"
        }`}
      >
        {getIcon()}
        <input
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          aria-label={label}
          className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
        />
      </div>
      {validationError && fieldTouched && (
        <p className="text-red-500 text-xs mt-1">{validationError}</p>
      )}
      {type === "password" && (
        <div className="flex items-center justify-start gap-2 mt-2 pt-3">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={onTogglePassword}
            className="w-4 h-4 accent-[#ac1ec4] cursor-pointer"
          />
          <label
            htmlFor="showPassword"
            className="text-sm text-slate-700 cursor-pointer select-none"
          >
            Show Password
          </label>
        </div>
      )}
    </div>
  );
};

export default FormField;
