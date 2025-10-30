import { useState, useEffect } from "react";
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "../utils/validation";

export const useFormValidation = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
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
  const [tooltipVisible, setTooltipVisible] = useState({
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

  const toggleTooltip = (field) => {
    setTooltipVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Close tooltips when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only apply this behavior on mobile devices (screen width < 768px)
      if (window.innerWidth < 768) {
        // Check if the click is outside any tooltip button
        if (!event.target.closest('button[aria-label*="requirements"]')) {
          setTooltipVisible({
            email: false,
            username: false,
            password: false,
          });
        }
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const validateForm = () => {
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
    return (
      emailValid && usernameValidation.isValid && passwordValidation.isValid
    );
  };

  return {
    formData,
    validationErrors,
    fieldTouched,
    tooltipVisible,
    handleChange,
    handleBlur,
    toggleTooltip,
    validateForm,
  };
};
