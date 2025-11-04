import { useState } from "react";
import { CiLock, CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await login(email, password);
    if (!result.success) setMessage(result.message);

    setLoading(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex justify-center items-start md:items-center py-10">
      <div className="w-11/12 max-w-2xl bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff] border border-[#ac1ec4]/20 rounded-xl shadow-xl p-6 sm:p-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff8a01] via-[#ac1ec4] to-[#1c50fe]"></div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Welcome Back!
        </h3>
        <p className="text-center text-slate-600 mt-2 mb-8">
          Login to access your learning dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
              Your Email:
            </label>
            <div className="flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
              <CiUser className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g: elon@tesla.com"
                aria-label="Email"
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
              Your Password:
            </label>
            <div className="flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4] transition-all">
              <CiLock className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-md font-semibold text-white bg-gradient-to-r from-[#ac1ec4] to-[#1c50fe] hover:shadow-lg hover:shadow-[#ac1ec4]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          {/* Sign up */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full h-11 rounded-md font-semibold border-2 border-[#ac1ec4] text-[#ac1ec4] hover:bg-[#ac1ec4]/5 transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Invalid Credentials Message */}
        {message && (
          <div className="mt-4 p-3 rounded-md text-sm text-center bg-red-50 text-red-600 border border-red-200">
            {message}
          </div>
        )}

        {/* Support & help text */}
        <div className="mt-6 space-y-2 text-center text-slate-600 text-sm">
          <p>
            Forgot your email or password?{" "}
            <span className="font-medium text-slate-700">
              Contact our team at{" "}
              <a
                href="mailto:jibril.abdi@sky.uk"
                className="text-[#ac1ec4] font-semibold hover:underline hover:text-[#1c50fe] transition-colors"
              >
                jibril.abdi@sky.uk
              </a>
            </span>
          </p>

          
        </div>
      </div>
    </div>
  );
}

export default Login;
