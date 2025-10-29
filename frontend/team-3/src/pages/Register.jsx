import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFormValidation } from "../hooks/useFormValidation";
import FormField from "../components/FormField";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    formData,
    validationErrors,
    fieldTouched,
    tooltipVisible,
    handleChange,
    handleBlur,
    toggleTooltip,
    validateForm,
  } = useFormValidation();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    // Validate form
    if (!validateForm()) {
      setMessage("Please fix the validation errors below");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (!result.success) {
      if (result.message.includes("already exists")) {
        setMessage(
          "An account with this email already exists. Please sign in instead."
        );
      } else if (
        result.message.includes("Missing") ||
        result.message.includes("required")
      ) {
        setMessage("Please fill in all required fields.");
      } else {
        setMessage(result.message || "Registration failed. Please try again.");
      }
      setMessageType("error");
    } else {
      setMessage("Account created successfully! Redirecting...");
      setMessageType("success");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex justify-center items-start md:items-center py-10">
      <div className="w-11/12 max-w-2xl bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] border border-[#ac1ec4]/20 rounded-xl shadow-xl p-6 sm:p-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe]"></div>

        <h2 className="text-center text-3xl font-bold text-slate-900">
          Create Your Account
        </h2>
        <p className="text-center text-slate-600 mt-2 mb-8">
          Join us and start your learning journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            type="email"
            name="email"
            label="Your Email"
            placeholder="e.g: test@test.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            validationError={validationErrors.email}
            fieldTouched={fieldTouched.email}
            tooltipVisible={tooltipVisible.email}
            onToggleTooltip={toggleTooltip}
            tooltipContent="Valid email format, max 320 characters (e.g., test@test.com)"
          />

          <FormField
            type="text"
            name="username"
            label="Username"
            placeholder="e.g: MrRobot"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            validationError={validationErrors.username}
            fieldTouched={fieldTouched.username}
            tooltipVisible={tooltipVisible.username}
            onToggleTooltip={toggleTooltip}
            tooltipContent="5-20 characters and must start with a letter"
          />

          <FormField
            type="password"
            name="password"
            label="Your Password"
            placeholder="e.g. ********"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            validationError={validationErrors.password}
            fieldTouched={fieldTouched.password}
            tooltipVisible={tooltipVisible.password}
            onToggleTooltip={toggleTooltip}
            tooltipContent="8-128 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char, no spaces"
            showPassword={showPassword}
            onTogglePassword={handleTogglePassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-md font-semibold text-white bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] hover:shadow-lg hover:shadow-[#ac1ec4]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full h-11 rounded-md font-semibold border-2 border-[#ac1ec4] text-[#ac1ec4] hover:bg-[#ac1ec4]/5 transition-all duration-200"
          >
            Already have an account? Sign In
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm text-center ${
              messageType === "error"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 space-y-2 text-center text-slate-600 text-sm">
          <p>
            Don't have an email address? Click{" "}
            <a
              href="https://www.youtube.com/watch?v=5pq4QOmjsW4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ac1ec4] font-semibold hover:underline hover:text-[#1c50fe] transition-colors"
            >
              here
            </a>{" "}
            for instructions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
