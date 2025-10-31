import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Register from '../Register';

// ---- Mocks ----

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    useNavigate: () => navigateMock,
  };
});

const registerMock = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    register: registerMock,
  }),
}));

// Mock useFormValidation hook
const mockHandleChange = vi.fn();
const mockHandleBlur = vi.fn();
const mockToggleTooltip = vi.fn();
const mockValidateForm = vi.fn();

let mockFormData = {
  username: '',
  email: '',
  password: '',
};

let mockValidationErrors = {
  email: '',
  username: '',
  password: '',
};

let mockFieldTouched = {
  email: false,
  username: false,
  password: false,
};

let mockTooltipVisible = {
  email: false,
  username: false,
  password: false,
};

vi.mock('../../hooks/useFormValidation', () => ({
  useFormValidation: () => ({
    formData: mockFormData,
    validationErrors: mockValidationErrors,
    fieldTouched: mockFieldTouched,
    tooltipVisible: mockTooltipVisible,
    handleChange: mockHandleChange,
    handleBlur: mockHandleBlur,
    toggleTooltip: mockToggleTooltip,
    validateForm: mockValidateForm,
  }),
}));

// Mock FormField component
vi.mock('../../components/FormField', () => ({
  default: ({ name, label, value, onChange, onBlur, validationError, fieldTouched, placeholder, type }) => (
    <div data-testid={`formfield-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={label}
      />
      {validationError && fieldTouched && (
        <p data-testid={`error-${name}`}>{validationError}</p>
      )}
    </div>
  ),
}));

// ---- Helper ----
const renderWithRouter = (initialPath = '/register') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  mockFormData = {
    username: '',
    email: '',
    password: '',
  };
  mockValidationErrors = {
    email: '',
    username: '',
    password: '',
  };
  mockFieldTouched = {
    email: false,
    username: false,
    password: false,
  };
  mockTooltipVisible = {
    email: false,
    username: false,
    password: false,
  };
});

describe('Register page', () => {
  describe('rendering', () => {
    test('renders page heading and description', () => {
      renderWithRouter();
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
      expect(screen.getByText('Join us and start your learning journey')).toBeInTheDocument();
    });

    test('renders all three form fields', () => {
      renderWithRouter();
      expect(screen.getByTestId('formfield-email')).toBeInTheDocument();
      expect(screen.getByTestId('formfield-username')).toBeInTheDocument();
      expect(screen.getByTestId('formfield-password')).toBeInTheDocument();
    });

    test('renders submit button', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    test('renders sign in button', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /Already have an account/i })).toBeInTheDocument();
    });

    test('renders help link for email setup', () => {
      renderWithRouter();
      const link = screen.getByRole('link', { name: /here/i });
      expect(link).toHaveAttribute('href', expect.stringContaining('youtube.com'));
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });

  describe('form submission', () => {
    test('calls validateForm on submit', async () => {
      mockValidateForm.mockReturnValue(false);
      renderWithRouter();

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockValidateForm).toHaveBeenCalled();
      });
    });

    test('shows validation error message when form is invalid', async () => {
      mockValidateForm.mockReturnValue(false);
      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      expect(await screen.findByText('Please fix the validation errors below')).toBeInTheDocument();
      expect(registerMock).not.toHaveBeenCalled();
    });

    test('calls register with form data when validation passes', async () => {
      mockValidateForm.mockReturnValue(true);
      mockFormData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
      };
      registerMock.mockResolvedValue({ success: true });

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      await waitFor(() => {
        expect(registerMock).toHaveBeenCalledWith(mockFormData);
      });
    });

    test('shows loading state during registration', async () => {
      mockValidateForm.mockReturnValue(true);
      let resolveRegister;
      const registerPromise = new Promise((res) => (resolveRegister = res));
      registerMock.mockReturnValue(registerPromise);

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      expect(await screen.findByRole('button', { name: /Creating Account.../i })).toBeDisabled();

      resolveRegister({ success: true });
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Sign Up/i })).not.toBeDisabled();
      });
    });

    test('shows success message on successful registration', async () => {
      mockValidateForm.mockReturnValue(true);
      registerMock.mockResolvedValue({ success: true });

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      const successMessage = await screen.findByText(/Account created successfully! Redirecting.../i);
      expect(successMessage).toBeInTheDocument();
      expect(successMessage.closest('div')).toHaveClass('text-green-600');
    });
  });

  describe('error handling', () => {
    test('handles "already exists" error', async () => {
      mockValidateForm.mockReturnValue(true);
      registerMock.mockResolvedValue({
        success: false,
        message: 'User already exists',
      });

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      const errorMessage = await screen.findByText(
        /An account with this email already exists. Please sign in instead./i
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.closest('div')).toHaveClass('text-red-600');
    });

    test('handles "missing fields" error', async () => {
      mockValidateForm.mockReturnValue(true);
      registerMock.mockResolvedValue({
        success: false,
        message: 'Missing required fields',
      });

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      expect(await screen.findByText(/Please fill in all required fields./i)).toBeInTheDocument();
    });

    test('handles generic registration error', async () => {
      mockValidateForm.mockReturnValue(true);
      registerMock.mockResolvedValue({
        success: false,
        message: 'Server error',
      });

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      expect(await screen.findByText('Server error')).toBeInTheDocument();
    });

    test('handles registration error without message', async () => {
      mockValidateForm.mockReturnValue(true);
      registerMock.mockResolvedValue({
        success: false,
        message: '',
      });

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      expect(await screen.findByText(/Registration failed. Please try again./i)).toBeInTheDocument();
    });

    test('clears previous error message on new submission', async () => {
      mockValidateForm.mockReturnValue(true);

      // First submission fails
      registerMock.mockResolvedValueOnce({
        success: false,
        message: 'First error',
      });

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
      expect(await screen.findByText('First error')).toBeInTheDocument();

      // Second submission succeeds
      registerMock.mockResolvedValueOnce({ success: true });
      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });
  });

  describe('navigation', () => {
    test('navigates to login when "Already have an account" is clicked', () => {
      renderWithRouter();

      const signInButton = screen.getByRole('button', { name: /Already have an account/i });
      fireEvent.click(signInButton);

      expect(navigateMock).toHaveBeenCalledWith('/login');
    });

    test('sign in button does not submit form', () => {
      renderWithRouter();

      const signInButton = screen.getByRole('button', { name: /Already have an account/i });
      expect(signInButton).toHaveAttribute('type', 'button');

      fireEvent.click(signInButton);

      expect(registerMock).not.toHaveBeenCalled();
    });
  });

  describe('form validation integration', () => {
    test('passes onChange events to useFormValidation', () => {
      renderWithRouter();

      const emailInput = screen.getByLabelText('Your Email');
      fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });

    test('passes onBlur events to useFormValidation', () => {
      renderWithRouter();

      const emailInput = screen.getByLabelText('Your Email');
      fireEvent.blur(emailInput, { target: { name: 'email', value: 'test@example.com' } });

      expect(mockHandleBlur).toHaveBeenCalled();
    });

    test('displays validation errors when field is touched', () => {
      mockValidationErrors = {
        email: 'Please enter a valid email address',
        username: '',
        password: '',
      };
      mockFieldTouched = {
        email: true,
        username: false,
        password: false,
      };

      renderWithRouter();

      expect(screen.getByTestId('error-email')).toHaveTextContent(
        'Please enter a valid email address'
      );
    });

    test('does not display validation errors when field is not touched', () => {
      mockValidationErrors = {
        email: 'Please enter a valid email address',
        username: '',
        password: '',
      };
      mockFieldTouched = {
        email: false,
        username: false,
        password: false,
      };

      renderWithRouter();

      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    test('submit button is keyboard accessible', () => {
      renderWithRouter();
      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      submitButton.focus();
      expect(submitButton).toHaveFocus();
    });

    test('form fields have proper labels', () => {
      renderWithRouter();
      expect(screen.getByLabelText('Your Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Your Password')).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    test('disables submit button during loading', async () => {
      mockValidateForm.mockReturnValue(true);
      let resolveRegister;
      const registerPromise = new Promise((res) => (resolveRegister = res));
      registerMock.mockReturnValue(registerPromise);

      renderWithRouter();

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveRegister({ success: true });
    });

    test('re-enables submit button after registration completes', async () => {
      mockValidateForm.mockReturnValue(true);
      registerMock.mockResolvedValue({ success: true });

      renderWithRouter();

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('re-enables submit button after validation error', async () => {
      mockValidateForm.mockReturnValue(false);

      renderWithRouter();

      const submitButton = screen.getByRole('button', { name: /Sign Up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('message display', () => {
    test('does not show message on initial render', () => {
      renderWithRouter();
      expect(screen.queryByText(/Account created successfully/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Please fix the validation errors/i)).not.toBeInTheDocument();
    });

    test('error message persists until next submission', async () => {
      mockValidateForm.mockReturnValue(false);

      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

      const errorMessage = await screen.findByText(/Please fix the validation errors below/i);
      expect(errorMessage).toBeInTheDocument();

      // Message should still be there after waiting
      await waitFor(() => {
        expect(errorMessage).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });
});
