// src/pages/__tests__/Login.test.jsx
import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

// ---- Mocks ----

// Make react-icons lightweight
vi.mock('react-icons/ci', () => ({
  CiLock: (props) => <svg data-testid="icon-lock" {...props} />,
  CiUser: (props) => <svg data-testid="icon-user" {...props} />,
}));

// Spy on navigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    useNavigate: () => navigateMock,
  };
});

// Mock useAuth -> we only need login()
const loginMock = vi.fn();
vi.mock('../../context/AuthContext', async () => {
  return {
    useAuth: () => ({
      login: loginMock,
    }),
  };
});

// ---- SUT ----
import Login from '../Login';

// ---- Helper ----
const renderWithRouter = (initialPath = '/login') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* simple placeholders for navigation targets */}
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Login page', () => {
  test('renders fields, labels, and buttons', () => {
    renderWithRouter();

    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();

    // icons present (from mocks)
    expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    expect(screen.getByTestId('icon-lock')).toBeInTheDocument();

    // required attrs
    expect(screen.getByLabelText('Email')).toBeRequired();
    expect(screen.getByLabelText('Password')).toBeRequired();
  });

  test('password visibility toggle works', () => {
    renderWithRouter();

    const pwdInput = screen.getByLabelText('Password');
    const checkbox = screen.getByRole('checkbox', { name: /Show Password/i });

    // default should be password
    expect(pwdInput).toHaveAttribute('type', 'password');

    // toggle on -> text
    fireEvent.click(checkbox);
    expect(pwdInput).toHaveAttribute('type', 'text');

    // toggle off -> password
    fireEvent.click(checkbox);
    expect(pwdInput).toHaveAttribute('type', 'password');
  });

  test('calls login(email, password) on submit with loading state', async () => {
    // make a deferred promise so we can check "Logging in..." while pending
    let resolveLogin;
    const loginPromise = new Promise((res) => (resolveLogin = res));
    loginMock.mockReturnValueOnce(loginPromise);

    renderWithRouter();

    // fill form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'elon@tesla.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret123' },
    });

    // submit
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // called with correct args
    expect(loginMock).toHaveBeenCalledWith('elon@tesla.com', 'secret123');

    // loading text and disabled state while promise pending
    expect(screen.getByRole('button', { name: /Logging in\.\.\./i })).toBeDisabled();

    // resolve as success
    resolveLogin({ success: true });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Sign In/i })).not.toBeDisabled()
    );

    // no error message shown on success
    expect(screen.queryByText(/Login failed/i)).not.toBeInTheDocument();
  });

  test('shows server error message on failed login', async () => {
    loginMock.mockResolvedValueOnce({
      success: false,
      message: 'Invalid credentials',
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bad@user.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // message appears
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();

    // button returns to normal text
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeEnabled();
  });

  test('Sign Up button navigates to /register', () => {
    renderWithRouter();

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    expect(navigateMock).toHaveBeenCalledWith('/register');
  });

  test('support links are present and correctly formed', () => {
    renderWithRouter();

    const mailto = screen.getByRole('link', { name: /jibril\.abdi@sky\.uk/i });
    expect(mailto).toHaveAttribute('href', 'mailto:jibril.abdi@sky.uk');

    const howTo = screen.getByRole('link', { name: /here/i });
    expect(howTo).toHaveAttribute('href', expect.stringContaining('youtube.com'));
    expect(howTo).toHaveAttribute('target', '_blank');
    expect(howTo).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  test('clears error message on resubmit', async () => {
    // First login fails
    loginMock.mockResolvedValueOnce({
      success: false,
      message: 'Invalid credentials',
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Error message appears
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();

    // Second login succeeds
    loginMock.mockResolvedValueOnce({ success: true });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Error message should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  test('handles network error gracefully', async () => {
    loginMock.mockResolvedValueOnce({
      success: false,
      message: 'Network error. Please try again.',
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText('Network error. Please try again.')).toBeInTheDocument();
  });

  test('email input has correct placeholder', () => {
    renderWithRouter();
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('placeholder', 'e.g: elon@tesla.com');
  });

  test('password input has correct placeholder', () => {
    renderWithRouter();
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('placeholder', 'e.g. ********');
  });

  test('form submission prevents default behavior', async () => {
    loginMock.mockResolvedValueOnce({ success: true });
    renderWithRouter();

    const form = screen.getByRole('button', { name: /Sign In/i }).closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  test('disables submit button during loading', async () => {
    let resolveLogin;
    const loginPromise = new Promise((res) => (resolveLogin = res));
    loginMock.mockReturnValueOnce(loginPromise);

    renderWithRouter();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    });

    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolveLogin({ success: true });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('Sign Up button does not submit form', () => {
    renderWithRouter();

    const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
    expect(signUpButton).toHaveAttribute('type', 'button');

    fireEvent.click(signUpButton);

    // login should not have been called
    expect(loginMock).not.toHaveBeenCalled();
  });

  test('email field accepts valid email format', () => {
    renderWithRouter();
    const emailInput = screen.getByLabelText('Email');

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    expect(emailInput).toHaveValue('user@example.com');
  });

  test('password field accepts any text', () => {
    renderWithRouter();
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(passwordInput, { target: { value: 'MySecretPassword123!' } });
    expect(passwordInput).toHaveValue('MySecretPassword123!');
  });

  test('displays correct heading and subheading', () => {
    renderWithRouter();
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText('Login to access your learning dashboard')).toBeInTheDocument();
  });

  test('show password checkbox is unchecked by default', () => {
    renderWithRouter();
    const checkbox = screen.getByRole('checkbox', { name: /Show Password/i });
    expect(checkbox).not.toBeChecked();
  });

  test('show password checkbox label is clickable', () => {
    renderWithRouter();
    const checkbox = screen.getByRole('checkbox', { name: /Show Password/i });
    const label = screen.getByText('Show Password');

    fireEvent.click(label);
    expect(checkbox).toBeChecked();
  });

  test('error message has proper styling classes', async () => {
    loginMock.mockResolvedValueOnce({
      success: false,
      message: 'Test error',
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    const errorMessage = await screen.findByText('Test error');
    expect(errorMessage).toBeInTheDocument();
    // Check it's in a container with red styling
    expect(errorMessage.closest('div')).toHaveClass('text-red-600');
  });

  test('maintains email and password values during loading', async () => {
    let resolveLogin;
    const loginPromise = new Promise((res) => (resolveLogin = res));
    loginMock.mockReturnValueOnce(loginPromise);

    renderWithRouter();

    const emailValue = 'test@example.com';
    const passwordValue = 'password123';

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: emailValue },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: passwordValue },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Values should be maintained during loading
    expect(screen.getByLabelText('Email')).toHaveValue(emailValue);
    expect(screen.getByLabelText('Password')).toHaveValue(passwordValue);

    resolveLogin({ success: true });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign In/i })).not.toBeDisabled();
    });
  });
});
