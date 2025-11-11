import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    Cookies.get("accessToken") || null
  );
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5003";

  const api = axios.create({ baseURL: API_URL });

  // Define logout and refreshAccessToken before interceptor uses them
  const logout = () => {
    setAccessToken(null);
    setUsername(null);
    setEmail(null);
    setRole(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login");
  };

  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      return false;
    }

    try {
      // Use raw axios to avoid interceptor loop - we need to bypass the interceptor for refresh calls
      const response = await axios.get(`${API_URL}/refresh`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      const newAccess = response.data?.access_token;
      if (newAccess) {
        const cookieOptions = {
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          expires: 7,
        };
        Cookies.set("accessToken", newAccess, cookieOptions);
        setAccessToken(newAccess);
        return true;
      }
      return false;
    } catch (err) {
      // Refresh token expired or invalid
      console.error("Token refresh failed:", err);
      return false;
    }
  };

  api.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error?.response?.status;
      const isAuthEndpoint =
        originalRequest?.url?.includes("/login") ||
        originalRequest?.url?.includes("/register") ||
        originalRequest?.url?.includes("/refresh");

      if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        try {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            const newAccess = Cookies.get("accessToken");
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          } else {
            logout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }

      if (status === 401 && originalRequest?.url?.includes("/refresh")) {
        logout();
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setAccessToken(token);
      fetchUserDetails().catch(() => {});
    } else {
      setAccessToken(null);
      setUsername(null);
      setEmail(null);
    }
  }, []);

  const setTokens = (access_token, refresh_token) => {
    const cookieOptions = {
      sameSite: "lax",
      secure: window.location.protocol === "https:",
      expires: 7,
    };
    Cookies.set("accessToken", access_token, cookieOptions);
    Cookies.set("refreshToken", refresh_token, cookieOptions);
    setAccessToken(access_token);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const data = response.data;
      setTokens(data.access_token, data.refresh_token);
      await fetchUserDetails().catch(() => {});
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  const register = async ({ username, email, password }) => {
    try {
      const response = await api.post("/register", {
        username,
        email,
        password,
      });
      const data = response.data;
      setTokens(data.access_token, data.refresh_token);
      await fetchUserDetails().catch(() => {});
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await api.get(`/user_details`);
      setUsername(res.data?.username || null);
      setEmail(res.data?.email || null);
      setRole(res.data?.role || null);
    } catch (_) {
      console.error("Error fetching user details");
    }
  };

  const value = {
    accessToken,
    username,
    email,
    role,
    login,
    register,
    logout,
    refresh: refreshAccessToken,
    api,
    fetchUserDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
