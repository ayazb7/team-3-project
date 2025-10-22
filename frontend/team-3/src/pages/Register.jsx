import { useState } from "react";
import { CiLock, CiUser } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    if (!formData.email.trim() || !formData.username.trim() || !formData.password.trim()) {
      setMessage("All fields are required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (!result.success) {
      if (result.message.includes("already exists")) {
        setMessage("An account with this email already exists. Please sign in instead.");
      } else if (result.message.includes("Missing") || result.message.includes("required")) {
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
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
              Your Email:
            </label>
            <div className="flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
              <MdAlternateEmail className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="e.g: bryanbarakat@outlook.com"
                aria-label="Email"
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
              Username:
            </label>
            <div className="flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
              <CiUser className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="e.g: MrRobot"
                aria-label="Username"
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
              Your Password:
            </label>
            <div className="flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
              <CiLock className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="e.g. ********"
                required
                aria-label="Password"
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
              />
            </div>
            <div className="flex items-center justify-start gap-2 mt-2 pt-3">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 accent-[#ac1ec4] cursor-pointer"
              />
              <label
                htmlFor="showPassword"
                className="text-sm text-slate-700 cursor-pointer select-none"
              >
                Show Password
              </label>
            </div>
          </div>

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
          <div className={`mt-4 p-3 rounded-md text-sm text-center ${
            messageType === "error" 
              ? "bg-red-50 text-red-600 border border-red-200" 
              : "bg-green-50 text-green-600 border border-green-200"
          }`}>
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
