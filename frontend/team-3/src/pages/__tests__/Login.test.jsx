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
});
