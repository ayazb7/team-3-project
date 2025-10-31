import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from "../validation";

describe("validateEmail", () => {
  describe("valid emails", () => {
    it("should accept standard email format", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("test.user@example.com")).toBe(true);
      expect(validateEmail("user+tag@example.co.uk")).toBe(true);
    });

    it("should accept email with numbers", () => {
      expect(validateEmail("user123@example.com")).toBe(true);
      expect(validateEmail("123user@example.com")).toBe(true);
    });

    it("should accept email with special characters", () => {
      expect(validateEmail("user_name@example.com")).toBe(true);
      expect(validateEmail("user-name@example.com")).toBe(true);
      expect(validateEmail("user.name@example.com")).toBe(true);
      expect(validateEmail("user%test@example.com")).toBe(true);
    });

    it("should accept email at maximum length (320 chars)", () => {
      // Create an email exactly 320 characters
      const localPart = "a".repeat(64); // Max local part is 64
      const domain = "b".repeat(251) + ".com"; // Total 255 for domain
      const email = localPart + "@" + domain.substring(0, 254); // Total 320
      expect(validateEmail(email)).toBe(true);
    });
  });

  describe("invalid emails", () => {
    it("should reject email without @", () => {
      expect(validateEmail("userexample.com")).toBe(false);
    });

    it("should reject email without domain", () => {
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user@.com")).toBe(false);
    });

    it("should reject email without local part", () => {
      expect(validateEmail("@example.com")).toBe(false);
    });

    it("should reject email without TLD", () => {
      expect(validateEmail("user@example")).toBe(false);
    });

    it("should reject email with spaces", () => {
      expect(validateEmail("user @example.com")).toBe(false);
      expect(validateEmail("user@ example.com")).toBe(false);
    });

    it("should reject email exceeding 320 characters", () => {
      const longEmail = "a".repeat(310) + "@example.com";
      expect(validateEmail(longEmail)).toBe(false);
    });

    it("should reject empty string", () => {
      expect(validateEmail("")).toBe(false);
    });

    it("should reject email with multiple @ symbols", () => {
      expect(validateEmail("user@@example.com")).toBe(false);
      expect(validateEmail("user@test@example.com")).toBe(false);
    });
  });
});

describe("validateUsername", () => {
  describe("valid usernames", () => {
    it("should accept username with exactly 5 characters", () => {
      const result = validateUsername("user1");
      expect(result.isValid).toBe(true);
      expect(result.message).toBe("");
    });

    it("should accept username with exactly 20 characters", () => {
      const result = validateUsername("a".repeat(20));
      expect(result.isValid).toBe(true);
      expect(result.message).toBe("");
    });

    it("should accept username starting with uppercase letter", () => {
      const result = validateUsername("Username");
      expect(result.isValid).toBe(true);
    });

    it("should accept username starting with lowercase letter", () => {
      const result = validateUsername("username");
      expect(result.isValid).toBe(true);
    });

    it("should accept username with numbers after first character", () => {
      const result = validateUsername("user123");
      expect(result.isValid).toBe(true);
    });

    it("should accept username with mixed case and numbers", () => {
      const result = validateUsername("TestUser123");
      expect(result.isValid).toBe(true);
    });
  });

  describe("invalid usernames", () => {
    it("should reject username shorter than 5 characters", () => {
      const result = validateUsername("user");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Username must be between 5-20 characters");
    });

    it("should reject username longer than 20 characters", () => {
      const result = validateUsername("a".repeat(21));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Username must be between 5-20 characters");
    });

    it("should reject empty username", () => {
      const result = validateUsername("");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Username must be between 5-20 characters");
    });

    it("should reject username starting with number", () => {
      const result = validateUsername("1user");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Username must start with a letter");
    });

    it("should reject username starting with special character", () => {
      const result = validateUsername("_user");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Username must start with a letter");
    });

    it("should reject username starting with hyphen", () => {
      const result = validateUsername("-user");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Username must start with a letter");
    });
  });
});

describe("validatePassword", () => {
  describe("valid passwords", () => {
    it("should accept password meeting all requirements", () => {
      const result = validatePassword("Password123!");
      expect(result.isValid).toBe(true);
      expect(result.message).toBe("");
    });

    it("should accept password with exactly 8 characters", () => {
      const result = validatePassword("Pass123!");
      expect(result.isValid).toBe(true);
    });

    it("should accept password with exactly 128 characters", () => {
      const longPass =
        "A".repeat(120) + "a1!Pass"; // 128 total with requirements
      const result = validatePassword(longPass);
      expect(result.isValid).toBe(true);
    });

    it("should accept password with various special characters", () => {
      expect(validatePassword("Pass123!").isValid).toBe(true);
      expect(validatePassword("Pass123@").isValid).toBe(true);
      expect(validatePassword("Pass123#").isValid).toBe(true);
      expect(validatePassword("Pass123$").isValid).toBe(true);
      expect(validatePassword("Pass123%").isValid).toBe(true);
      expect(validatePassword("Pass123^").isValid).toBe(true);
      expect(validatePassword("Pass123&").isValid).toBe(true);
      expect(validatePassword("Pass123*").isValid).toBe(true);
    });

    it("should accept password with multiple uppercase and lowercase letters", () => {
      const result = validatePassword("PASSword123!");
      expect(result.isValid).toBe(true);
    });
  });

  describe("invalid passwords - length", () => {
    it("should reject password shorter than 8 characters", () => {
      const result = validatePassword("Pass1!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password must be between 8-128 characters long");
    });

    it("should reject password longer than 128 characters", () => {
      const longPass = "A".repeat(129) + "a1!";
      const result = validatePassword(longPass);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password must be between 8-128 characters long");
    });

    it("should reject empty password", () => {
      const result = validatePassword("");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password must be between 8-128 characters long");
    });
  });

  describe("invalid passwords - spaces", () => {
    it("should reject password with spaces", () => {
      const result = validatePassword("Pass word123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password cannot contain spaces");
    });

    it("should reject password with leading space", () => {
      const result = validatePassword(" Password123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password cannot contain spaces");
    });

    it("should reject password with trailing space", () => {
      const result = validatePassword("Password123! ");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password cannot contain spaces");
    });
  });

  describe("invalid passwords - missing uppercase", () => {
    it("should reject password without uppercase letter", () => {
      const result = validatePassword("password123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Password must contain at least 1 uppercase letter"
      );
    });
  });

  describe("invalid passwords - missing lowercase", () => {
    it("should reject password without lowercase letter", () => {
      const result = validatePassword("PASSWORD123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Password must contain at least 1 lowercase letter"
      );
    });
  });

  describe("invalid passwords - missing number", () => {
    it("should reject password without number", () => {
      const result = validatePassword("Password!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password must contain at least 1 number");
    });
  });

  describe("invalid passwords - missing special character", () => {
    it("should reject password without special character", () => {
      const result = validatePassword("Password123");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Password must contain at least 1 special character"
      );
    });
  });

  describe("invalid passwords - multiple missing requirements", () => {
    it("should validate in order (length first)", () => {
      const result = validatePassword("short");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password must be between 8-128 characters long");
    });

    it("should check spaces before character requirements", () => {
      const result = validatePassword("password 123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Password cannot contain spaces");
    });

    it("should check uppercase before lowercase", () => {
      const result = validatePassword("password123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Password must contain at least 1 uppercase letter"
      );
    });
  });
});
