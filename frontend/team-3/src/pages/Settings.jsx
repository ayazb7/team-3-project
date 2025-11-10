import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAccessibility } from "../context/AccessibilityContext";
import {
  Type,
  Save,
  RotateCcw,
} from "lucide-react";

export default function Settings() {
  const { api } = useAuth();
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveStatus, setSaveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus("");

    try {
      await api.post('/preferences', { preferences: localSettings });
      updateSettings(localSettings);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    const defaultSettings = {
      fontSize: 100,
    };
    setLocalSettings(defaultSettings);
    
    setIsLoading(true);
    try {
      await api.post('/preferences', { preferences: defaultSettings });
      updateSettings(defaultSettings);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error resetting preferences:", error);
      setSaveStatus("error");
      setLocalSettings(settings);
    } finally {
      setIsLoading(false);
    }
  };

  const SettingCard = ({ icon: Icon, title, description, children }) => (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <div className="ml-14">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Accessibility Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your experience with accessibility features designed for
            everyone
          </p>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              saveStatus === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {saveStatus === "success"
              ? "Settings saved successfully!"
              : "Error saving settings. Please try again."}
          </div>
        )}

        {/* Settings */}
        <div>
          {/* Font Size */}
          <SettingCard
            icon={Type}
            title="Font Size"
            description="Adjust text size for better readability"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {localSettings.fontSize}%
                </span>
                <button
                  onClick={() => handleChange("fontSize", 100)}
                  className="text-xs text-sidebar-primary hover:underline"
                >
                  Reset
                </button>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                step="10"
                value={localSettings.fontSize}
                onChange={(e) =>
                  handleChange("fontSize", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sidebar-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small (80%)</span>
                <span>Default (100%)</span>
                <span>Large (150%)</span>
              </div>
            </div>
          </SettingCard>
        </div>

        {/* Preview Text */}
        <div className="mt-8 p-6 bg-card rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-muted-foreground mb-4">
            Preview
          </h4>
          <p 
            className="text-foreground transition-all duration-200"
            style={{ fontSize: `${(localSettings.fontSize / 100) * 16}px` }}
          >
            This is how your text will appear with the current font size setting. 
            You can adjust the slider above to see the changes in real-time. 
            Click "Save Settings" to apply these changes across the entire application.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium shadow-md"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Settings"}
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

