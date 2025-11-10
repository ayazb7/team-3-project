import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const AccessibilityContext = createContext();

const defaultSettings = {
  fontSize: 100,
};

export const AccessibilityProvider = ({ children }) => {
  const { accessToken, api } = useAuth();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("accessibility-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    if (accessToken) {
      fetchSettings();
    }
  }, [accessToken]);

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/preferences');
      if (response.data.preferences && Object.keys(response.data.preferences).length > 0) {
        setSettings(response.data.preferences);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const applySettings = (newSettings) => {
    const root = document.documentElement;

    root.style.fontSize = `${(newSettings.fontSize / 100) * 16}px`;
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};

