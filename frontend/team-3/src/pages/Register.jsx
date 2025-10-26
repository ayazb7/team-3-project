import { useState } from "react";
import { CiLock, CiUser } from "react-icons/ci";
import { MdAlternateEmail, MdInfoOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Validation helper functions
const validateEmail = (email) => {
  // Check length first (max 320 characters)
  if (email.length > 320) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validateUsername = (username) => {
  // Length between 5-20 characters
  if (username.length < 5 || username.length > 20) {
    return {
      isValid: false,
      message: "Username must be between 5-20 characters",
    };
  }

  // Must start with a letter
  if (!/^[a-zA-Z]/.test(username)) {
    return { isValid: false, message: "Username must start with a letter" };
  }

  return { isValid: true, message: "" };
};

const validatePassword = (password) => {
  // Length between 8-128 characters
  if (password.length < 8 || password.length > 128) {
    return {
      isValid: false,
      message: "Password must be between 8-128 characters long",
    };
  }

  // No spaces
  if (/\s/.test(password)) {
    return { isValid: false, message: "Password cannot contain spaces" };
  }

  // At least 1 uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least 1 uppercase letter",
    };
  }

  // At least 1 lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least 1 lowercase letter",
    };
  }

  // At least 1 number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least 1 number",
    };
  }

  // At least 1 special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least 1 special character",
    };
  }

  return { isValid: true, message: "" };
};

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
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [fieldTouched, setFieldTouched] = useState({
    email: false,
    username: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (fieldTouched[name]) {
      let error = "";
      if (name === "email") {
        if (value && value.length > 320) {
          error = "Email must be 320 characters or less";
        } else if (value && !validateEmail(value)) {
          error = "Please enter a valid email address (e.g., test@test.com)";
        }
      } else if (name === "username") {
        if (value) {
          const validation = validateUsername(value);
          if (!validation.isValid) {
            error = validation.message;
          }
        }
      } else if (name === "password") {
        if (value) {
          const validation = validatePassword(value);
          if (!validation.isValid) {
            error = validation.message;
          }
        }
      }

      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFieldTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    let error = "";
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (value.length > 320) {
        error = "Email must be 320 characters or less";
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email address (e.g., test@test.com)";
      }
    } else if (name === "username") {
      if (!value.trim()) {
        error = "Username is required";
      } else {
        const validation = validateUsername(value);
        if (!validation.isValid) {
          error = validation.message;
        }
      }
    } else if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else {
        const validation = validatePassword(value);
        if (!validation.isValid) {
          error = validation.message;
        }
      }
    }

    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    // Mark all fields as touched to show validation errors
    setFieldTouched({
      email: true,
      username: true,
      password: true,
    });

    // Validate all fields
    const emailValid = formData.email.trim() && validateEmail(formData.email);
    const usernameValidation = formData.username.trim()
      ? validateUsername(formData.username)
      : { isValid: false, message: "Username is required" };
    const passwordValidation = formData.password.trim()
      ? validatePassword(formData.password)
      : { isValid: false, message: "Password is required" };

    // Update validation errors
    setValidationErrors({
      email: !formData.email.trim()
        ? "Email is required"
        : formData.email.length > 320
        ? "Email must be 320 characters or less"
        : !emailValid
        ? "Please enter a valid email address (e.g., test@test.com)"
        : "",
      username: !usernameValidation.isValid ? usernameValidation.message : "",
      password: !passwordValidation.isValid ? passwordValidation.message : "",
    });

    // Check if form is valid
    if (
      !emailValid ||
      !usernameValidation.isValid ||
      !passwordValidation.isValid
    ) {
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
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left flex items-center gap-1">
              Your Email:
              <div className="group relative">
                <MdInfoOutline className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Valid email format, max 320 characters (e.g., test@test.com)
                </div>
              </div>
            </label>
            <div
              className={`flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 transition-all ${
                validationErrors.email && fieldTouched.email
                  ? "ring-red-300 focus-within:ring-2 focus-within:ring-red-500"
                  : "ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4]"
              }`}
            >
              <MdAlternateEmail className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="e.g: test@test.com"
                aria-label="Email"
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
              />
            </div>
            {validationErrors.email && fieldTouched.email && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
            {validationErrors.email && fieldTouched.email && (
              <div className="text-xs text-slate-500 mt-1">
                <p>
                  Valid email format, max 320 characters (e.g., test@test.com)
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left flex items-center gap-1">
              Username:
              <div className="group relative">
                <MdInfoOutline className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  5-20 characters and must start with a letter
                </div>
              </div>
            </label>
            <div
              className={`flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 transition-all ${
                validationErrors.username && fieldTouched.username
                  ? "ring-red-300 focus-within:ring-2 focus-within:ring-red-500"
                  : "ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4]"
              }`}
            >
              <CiUser className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="e.g: MrRobot"
                aria-label="Username"
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
              />
            </div>
            {validationErrors.username && fieldTouched.username && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.username}
              </p>
            )}
            {validationErrors.username && fieldTouched.username && (
              <div className="text-xs text-slate-500 mt-1">
                <p>5-20 characters and must start with a letter</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-left flex items-center gap-1">
              Your Password:
              <div className="group relative">
                <MdInfoOutline className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  8-128 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
                  char, no spaces
                </div>
              </div>
            </label>
            <div
              className={`flex items-center gap-2 bg-white/80 h-11 px-3 rounded-md ring-1 transition-all ${
                validationErrors.password && fieldTouched.password
                  ? "ring-red-300 focus-within:ring-2 focus-within:ring-red-500"
                  : "ring-[#ac1ec4]/30 focus-within:ring-2 focus-within:ring-[#ac1ec4]"
              }`}
            >
              <CiLock className="w-5 h-5 text-slate-600 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. ********"
                required
                aria-label="Password"
                className="w-full bg-transparent outline-none focus:ring-0 placeholder-slate-500"
              />
            </div>
            {validationErrors.password && fieldTouched.password && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.password}
              </p>
            )}
            {validationErrors.password && fieldTouched.password && (
              <div className="text-xs text-slate-500 mt-1">
                <p>
                  8-128 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
                  char, no spaces
                </p>
              </div>
            )}
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
