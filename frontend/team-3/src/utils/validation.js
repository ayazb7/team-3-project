// Validation helper functions
export const validateEmail = (email) => {
  // Check length first (max 320 characters)
  if (email.length > 320) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
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

export const validatePassword = (password) => {
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
