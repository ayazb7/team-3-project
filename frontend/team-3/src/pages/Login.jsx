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
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || data.error || "Login failed. Please try again."
        );
      } else {
        login(data);
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex justify-center items-start md:items-center py-10">
      <div className="w-11/12 max-w-2xl bg-[#EBF3FC] border border-blue-200 rounded-xl shadow-sm p-6 sm:p-28">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Welcome Back!
        </h2>
        <p className="text-center text-slate-600 mt-2 mb-8">
          Login to access your learning dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left">
              Your Email:
            </label>
            <div className="flex items-center gap-2 bg-[#CAE4FE] h-11 px-3 rounded-md ring-1 ring-blue-200 focus-within:ring-2 focus-within:ring-blue-500">
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
            <div className="flex items-center gap-2 bg-[#CAE4FE] h-11 px-3 rounded-md ring-1 ring-blue-200 focus-within:ring-2 focus-within:ring-blue-500">
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
                className="w-4 h-4 accent-blue-600 cursor-pointer"
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
            className="w-full h-11 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          {/* Sign up */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full h-11 rounded-md font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Invalid Credentials Message */}
        {message && (
          <p className="text-center text-red-600 text-sm mt-4">{message}</p>
        )}

        {/* Support & help text */}
        <div className="mt-6 space-y-2 text-center text-slate-600 text-sm">
          <p>
            Forgot your email or password?{" "}
            <span className="font-medium text-slate-700">
              Contact our team at{" "}
              <a
                href="mailto:jibril.abdi@sky.uk"
                className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors"
              >
                jibril.abdi@sky.uk
              </a>
            </span>
          </p>

          <p>
            Need to create an email? Click{" "}
            <a
              href="https://www.youtube.com/watch?v=5pq4QOmjsW4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors"
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

export default Login;
