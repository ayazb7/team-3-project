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
  const [activeVideo, setActiveVideo] = useState("password"); // "password" or "email"
 
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
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-8 lg:p-12">
      {/* Unified Card with gradient background */}
      <div className="w-full max-w-[1400px] bg-gradient-to-br from-[#001433] via-[#002147] to-[#001433] rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Decorative gradient glows */}
        <div className="pointer-events-none absolute -top-20 -right-24 h-96 w-96 rounded-full bg-[#1c50fe]/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-[#ac1ec4]/20 blur-3xl"></div>
 
        <div className="flex flex-col md:flex-row items-stretch min-h-[calc(100vh-160px)] relative z-10">
          {/* Left: Registration Form */}
          <div className="w-full md:w-[42%] lg:w-[38%] bg-white/95 backdrop-blur-sm p-8 md:p-10 lg:p-12 flex flex-col justify-center relative">
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe]"></div>
            
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Create an account
              </h2>
              <p className="text-slate-600 mb-8">
                Join us and start your learning journey
              </p>
 
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  type="email"
                  name="email"
                  label="Email"
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
                  label="Password"
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
 
                <div className="text-center text-slate-600 text-sm">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#1c50fe] font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </div>
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
 
              {/* <div className="mt-6 text-center text-slate-600 text-xs">
                <p>
                  Don't have an email address? Click{" "}
                  <a
                    href="https://www.youtube.com/watch?v=5pq4QOmjsW4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1c50fe] font-semibold hover:underline"
                  >
                    here
                  </a>{" "}
                  for instructions.
                </p>
              </div> */}
            </div>
          </div>
 
          {/* Right: Video Section */}
          <div className="w-full md:w-[58%] lg:w-[62%] flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 space-y-6">
            {/* Humorous/Inviting Text */}
            <div className="text-center max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Need a hand getting set up?
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                Watch these short, <span className="text-[#ff8a01] font-semibold">exclusive tutorials</span>.
                It's one of many step-by-step guides you'll unlock on our platform when you sign up.
              </p>
            </div>
 
            {/* Video Player */}
            <iframe
              key={activeVideo}
              title={activeVideo === "password" ? "How to Create a Password" : "How to Create an Email"}
              src={
                activeVideo === "password"
                  ? "https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb"
                  : "https://share.synthesia.io/embeds/videos/796fe9dd-1eff-4e2b-af05-fc0db9625342"
              }
              loading="lazy"
              allow="encrypted-media"
              allowFullScreen
              className="w-full max-w-[900px] aspect-video rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
            ></iframe>
 
            {/* Video Toggle Buttons */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setActiveVideo("password")}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    activeVideo === "password"
                      ? "bg-white text-slate-900 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Password Tutorial
                </button>
                <button
                  onClick={() => setActiveVideo("email")}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    activeVideo === "email"
                      ? "bg-white text-slate-900 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Email Tutorial
                </button>
              </div>
              
              {/* Video Timestamp */}
              <p className="text-white/60 text-sm">
                {activeVideo === "password" ? "Timestamp: 1:11 - 1:56" : "Timestamp: 00:30 - 00:56"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Register;
 
 
