import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFormValidation } from "../useFormValidation";

describe("useFormValidation", () => {
  beforeEach(() => {
    // Mock window.innerWidth for mobile tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe("initial state", () => {
    it("should initialize with empty form data", () => {
      const { result } = renderHook(() => useFormValidation());

      expect(result.current.formData).toEqual({
        username: "",
        email: "",
        password: "",
      });
    });

    it("should initialize with no validation errors", () => {
      const { result } = renderHook(() => useFormValidation());

      expect(result.current.validationErrors).toEqual({
        email: "",
        username: "",
        password: "",
      });
    });

    it("should initialize with no fields touched", () => {
      const { result } = renderHook(() => useFormValidation());

      expect(result.current.fieldTouched).toEqual({
        email: false,
        username: false,
        password: false,
      });
    });

    it("should initialize with all tooltips hidden", () => {
      const { result } = renderHook(() => useFormValidation());

      expect(result.current.tooltipVisible).toEqual({
        email: false,
        username: false,
        password: false,
      });
    });
  });

  describe("handleChange", () => {
    it("should update form data when field changes", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        });
      });

      expect(result.current.formData.email).toBe("test@example.com");
    });

    it("should update username field", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "username", value: "testuser" },
        });
      });

      expect(result.current.formData.username).toBe("testuser");
    });

    it("should update password field", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "password", value: "Password123!" },
        });
      });

      expect(result.current.formData.password).toBe("Password123!");
    });

    it("should not validate if field has not been touched", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "invalid" },
        });
      });

      expect(result.current.validationErrors.email).toBe("");
    });

    it("should validate email in real-time after field is touched", () => {
      const { result } = renderHook(() => useFormValidation());

      // First touch the field via blur
      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "test@example.com" },
        });
      });

      // Then change to invalid value
      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "invalid" },
        });
      });

      expect(result.current.validationErrors.email).toBe(
        "Please enter a valid email address (e.g., test@test.com)"
      );
    });

    it("should validate email length exceeding 320 characters", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "test@example.com" },
        });
      });

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "a".repeat(321) },
        });
      });

      expect(result.current.validationErrors.email).toBe(
        "Email must be 320 characters or less"
      );
    });

    it("should validate username in real-time after touched", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "username", value: "validuser" },
        });
      });

      act(() => {
        result.current.handleChange({
          target: { name: "username", value: "usr" },
        });
      });

      expect(result.current.validationErrors.username).toBe(
        "Username must be between 5-20 characters"
      );
    });

    it("should validate password in real-time after touched", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "password", value: "Password123!" },
        });
      });

      act(() => {
        result.current.handleChange({
          target: { name: "password", value: "weak" },
        });
      });

      expect(result.current.validationErrors.password).toBe(
        "Password must be between 8-128 characters long"
      );
    });

    it("should clear validation errors when valid value entered", () => {
      const { result } = renderHook(() => useFormValidation());

      // Touch and set invalid
      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "invalid" },
        });
      });

      expect(result.current.validationErrors.email).not.toBe("");

      // Change to valid
      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        });
      });

      expect(result.current.validationErrors.email).toBe("");
    });
  });

  describe("handleBlur", () => {
    it("should mark field as touched on blur", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "test@example.com" },
        });
      });

      expect(result.current.fieldTouched.email).toBe(true);
    });

    it("should validate email on blur - required", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "" },
        });
      });

      expect(result.current.validationErrors.email).toBe("Email is required");
    });

    it("should validate email on blur - invalid format", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "invalid" },
        });
      });

      expect(result.current.validationErrors.email).toBe(
        "Please enter a valid email address (e.g., test@test.com)"
      );
    });

    it("should validate email on blur - too long", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "a".repeat(321) },
        });
      });

      expect(result.current.validationErrors.email).toBe(
        "Email must be 320 characters or less"
      );
    });

    it("should validate username on blur - required", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "username", value: "" },
        });
      });

      expect(result.current.validationErrors.username).toBe(
        "Username is required"
      );
    });

    it("should validate username on blur - invalid format", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "username", value: "usr" },
        });
      });

      expect(result.current.validationErrors.username).toBe(
        "Username must be between 5-20 characters"
      );
    });

    it("should validate password on blur - required", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "password", value: "" },
        });
      });

      expect(result.current.validationErrors.password).toBe(
        "Password is required"
      );
    });

    it("should validate password on blur - invalid format", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "password", value: "weak" },
        });
      });

      expect(result.current.validationErrors.password).toBe(
        "Password must be between 8-128 characters long"
      );
    });

    it("should accept valid email on blur", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "test@example.com" },
        });
      });

      expect(result.current.validationErrors.email).toBe("");
    });

    it("should handle whitespace-only values as empty", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleBlur({
          target: { name: "email", value: "   " },
        });
      });

      expect(result.current.validationErrors.email).toBe("Email is required");
    });
  });

  describe("toggleTooltip", () => {
    it("should toggle email tooltip visibility", () => {
      const { result } = renderHook(() => useFormValidation());

      expect(result.current.tooltipVisible.email).toBe(false);

      act(() => {
        result.current.toggleTooltip("email");
      });

      expect(result.current.tooltipVisible.email).toBe(true);

      act(() => {
        result.current.toggleTooltip("email");
      });

      expect(result.current.tooltipVisible.email).toBe(false);
    });

    it("should toggle username tooltip visibility", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.toggleTooltip("username");
      });

      expect(result.current.tooltipVisible.username).toBe(true);
    });

    it("should toggle password tooltip visibility", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.toggleTooltip("password");
      });

      expect(result.current.tooltipVisible.password).toBe(true);
    });

    it("should not affect other tooltip states", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.toggleTooltip("email");
      });

      expect(result.current.tooltipVisible.email).toBe(true);
      expect(result.current.tooltipVisible.username).toBe(false);
      expect(result.current.tooltipVisible.password).toBe(false);
    });
  });

  describe("validateForm", () => {
    it("should mark all fields as touched", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.fieldTouched).toEqual({
        email: true,
        username: true,
        password: true,
      });
    });

    it("should return false when all fields are empty", () => {
      const { result } = renderHook(() => useFormValidation());

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBeFalsy();
      expect(result.current.validationErrors.email).toBe("Email is required");
      expect(result.current.validationErrors.username).toBe(
        "Username is required"
      );
      expect(result.current.validationErrors.password).toBe(
        "Password is required"
      );
    });

    it("should return false when email is invalid", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "invalid" },
        });
        result.current.handleChange({
          target: { name: "username", value: "validuser" },
        });
        result.current.handleChange({
          target: { name: "password", value: "Password123!" },
        });
      });

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(false);
      expect(result.current.validationErrors.email).toBe(
        "Please enter a valid email address (e.g., test@test.com)"
      );
    });

    it("should return false when username is invalid", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        });
        result.current.handleChange({
          target: { name: "username", value: "usr" },
        });
        result.current.handleChange({
          target: { name: "password", value: "Password123!" },
        });
      });

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(false);
      expect(result.current.validationErrors.username).toBe(
        "Username must be between 5-20 characters"
      );
    });

    it("should return false when password is invalid", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        });
        result.current.handleChange({
          target: { name: "username", value: "validuser" },
        });
        result.current.handleChange({
          target: { name: "password", value: "weak" },
        });
      });

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(false);
      expect(result.current.validationErrors.password).toBe(
        "Password must be between 8-128 characters long"
      );
    });

    it("should return true when all fields are valid", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "test@example.com" },
        });
        result.current.handleChange({
          target: { name: "username", value: "validuser" },
        });
        result.current.handleChange({
          target: { name: "password", value: "Password123!" },
        });
      });

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(true);
      expect(result.current.validationErrors).toEqual({
        email: "",
        username: "",
        password: "",
      });
    });

    it("should handle email exceeding 320 characters", () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.handleChange({
          target: { name: "email", value: "a".repeat(321) },
        });
        result.current.handleChange({
          target: { name: "username", value: "validuser" },
        });
        result.current.handleChange({
          target: { name: "password", value: "Password123!" },
        });
      });

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(false);
      expect(result.current.validationErrors.email).toBe(
        "Email must be 320 characters or less"
      );
    });
  });

  describe("click outside behavior (mobile)", () => {
    beforeEach(() => {
      // Set mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 767,
      });
    });

    it("should close all tooltips on click outside on mobile", async () => {
      const { result } = renderHook(() => useFormValidation());

      // Open tooltips
      act(() => {
        result.current.toggleTooltip("email");
        result.current.toggleTooltip("username");
        result.current.toggleTooltip("password");
      });

      expect(result.current.tooltipVisible.email).toBe(true);
      expect(result.current.tooltipVisible.username).toBe(true);
      expect(result.current.tooltipVisible.password).toBe(true);

      // Simulate click outside
      act(() => {
        const div = document.createElement('div');
        const event = new MouseEvent("mousedown", { bubbles: true });
        Object.defineProperty(event, "target", {
          value: div,
          enumerable: true,
        });
        document.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.tooltipVisible.email).toBe(false);
        expect(result.current.tooltipVisible.username).toBe(false);
        expect(result.current.tooltipVisible.password).toBe(false);
      });
    });

    it("should not close tooltips when clicking tooltip button on mobile", async () => {
      const { result } = renderHook(() => useFormValidation());

      // Create a mock tooltip button
      const button = document.createElement("button");
      button.setAttribute("aria-label", "email requirements");
      document.body.appendChild(button);

      // Open tooltip
      act(() => {
        result.current.toggleTooltip("email");
      });

      expect(result.current.tooltipVisible.email).toBe(true);

      // Simulate click on tooltip button
      act(() => {
        const event = new MouseEvent("mousedown", { bubbles: true });
        Object.defineProperty(event, "target", {
          value: button,
          enumerable: true,
        });
        document.dispatchEvent(event);
      });

      // Should still be visible
      expect(result.current.tooltipVisible.email).toBe(true);

      // Cleanup
      document.body.removeChild(button);
    });

    it("should handle touchstart events on mobile", async () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.toggleTooltip("email");
      });

      expect(result.current.tooltipVisible.email).toBe(true);

      // Simulate touch outside
      act(() => {
        const div = document.createElement('div');
        const event = new TouchEvent("touchstart", { bubbles: true });
        Object.defineProperty(event, "target", {
          value: div,
          enumerable: true,
        });
        document.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.tooltipVisible.email).toBe(false);
      });
    });
  });

  describe("click outside behavior (desktop)", () => {
    it("should not close tooltips on desktop (width >= 768)", async () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.toggleTooltip("email");
      });

      expect(result.current.tooltipVisible.email).toBe(true);

      // Simulate click outside
      act(() => {
        const event = new MouseEvent("mousedown", { bubbles: true });
        document.dispatchEvent(event);
      });

      // Should still be visible on desktop
      expect(result.current.tooltipVisible.email).toBe(true);
    });
  });

  describe("cleanup", () => {
    it("should remove event listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(
        document,
        "removeEventListener"
      );
      const { unmount } = renderHook(() => useFormValidation());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "touchstart",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
