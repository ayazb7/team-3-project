import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from '../FormField';

// ---- Mocks ----

vi.mock('react-icons/ci', () => ({
  CiLock: () => <div data-testid="icon-lock" />,
  CiUser: () => <div data-testid="icon-user" />,
}));

vi.mock('react-icons/md', () => ({
  MdAlternateEmail: () => <div data-testid="icon-email" />,
}));

vi.mock('../Tooltip', () => ({
  default: ({ field, content, ariaLabel, tooltipVisible, onToggle }) => (
    <button
      data-testid={`tooltip-${field}`}
      onClick={() => onToggle(field)}
      aria-label={ariaLabel}
    >
      {tooltipVisible ? 'Tooltip Open' : 'Tooltip'}
    </button>
  ),
}));

const defaultProps = {
  type: 'text',
  name: 'username',
  label: 'Username',
  placeholder: 'Enter username',
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  validationError: '',
  fieldTouched: false,
  tooltipVisible: false,
  onToggleTooltip: vi.fn(),
  tooltipContent: '5-20 characters',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('FormField component', () => {
  describe('basic rendering', () => {
    test('renders label', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByText(/Username:/i)).toBeInTheDocument();
    });

    test('renders input field', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    test('renders placeholder', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter username');
      expect(input).toBeInTheDocument();
    });

    test('renders tooltip button', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByTestId('tooltip-username')).toBeInTheDocument();
    });

    test('input has correct name attribute', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('name', 'username');
    });
  });

  describe('input types and icons', () => {
    test('renders email icon for email type', () => {
      render(<FormField {...defaultProps} type="email" name="email" label="Email" />);
      expect(screen.getByTestId('icon-email')).toBeInTheDocument();
    });

    test('renders user icon for text type', () => {
      render(<FormField {...defaultProps} type="text" />);
      expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    });

    test('renders lock icon for password type', () => {
      render(<FormField {...defaultProps} type="password" name="password" label="Password" />);
      expect(screen.getByTestId('icon-lock')).toBeInTheDocument();
    });

    test('input type is text for text field', () => {
      render(<FormField {...defaultProps} type="text" />);
      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('input type is email for email field', () => {
      render(<FormField {...defaultProps} type="email" name="email" label="Email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('input type is password for password field', () => {
      render(<FormField {...defaultProps} type="password" name="password" label="Password" />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('password visibility toggle', () => {
    test('renders Show Password checkbox for password field', () => {
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
          showPassword={false}
          onTogglePassword={vi.fn()}
        />
      );

      expect(screen.getByLabelText('Show Password')).toBeInTheDocument();
    });

    test('does not render Show Password checkbox for non-password field', () => {
      render(<FormField {...defaultProps} type="text" />);
      expect(screen.queryByLabelText('Show Password')).not.toBeInTheDocument();
    });

    test('password field shows text when showPassword is true', () => {
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
          showPassword={true}
          onTogglePassword={vi.fn()}
        />
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('password field shows password when showPassword is false', () => {
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
          showPassword={false}
          onTogglePassword={vi.fn()}
        />
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    test('clicking Show Password checkbox calls onTogglePassword', () => {
      const onTogglePassword = vi.fn();
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
          showPassword={false}
          onTogglePassword={onTogglePassword}
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'Show Password' });
      fireEvent.click(checkbox);

      expect(onTogglePassword).toHaveBeenCalled();
    });

    test('Show Password checkbox reflects showPassword state', () => {
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
          showPassword={true}
          onTogglePassword={vi.fn()}
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'Show Password' });
      expect(checkbox).toBeChecked();
    });
  });

  describe('validation errors', () => {
    test('displays validation error when field is touched', () => {
      render(
        <FormField
          {...defaultProps}
          validationError="Username is required"
          fieldTouched={true}
        />
      );

      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });

    test('does not display validation error when field is not touched', () => {
      render(
        <FormField
          {...defaultProps}
          validationError="Username is required"
          fieldTouched={false}
        />
      );

      expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
    });

    test('error message has correct styling', () => {
      render(
        <FormField
          {...defaultProps}
          validationError="Username is required"
          fieldTouched={true}
        />
      );

      const error = screen.getByText('Username is required');
      expect(error).toHaveClass('text-red-500');
      expect(error).toHaveClass('text-xs');
    });

    test('input has error styling when validation error exists', () => {
      render(
        <FormField
          {...defaultProps}
          validationError="Username is required"
          fieldTouched={true}
        />
      );

      const inputContainer = screen.getByLabelText('Username').closest('div');
      expect(inputContainer).toHaveClass('ring-red-300');
    });

    test('input has normal styling when no validation error', () => {
      render(<FormField {...defaultProps} validationError="" fieldTouched={true} />);

      const inputContainer = screen.getByLabelText('Username').closest('div');
      expect(inputContainer).toHaveClass('ring-[#ac1ec4]/30');
    });
  });

  describe('user interactions', () => {
    test('calls onChange when input value changes', () => {
      const onChange = vi.fn();
      render(<FormField {...defaultProps} onChange={onChange} />);

      const input = screen.getByLabelText('Username');
      fireEvent.change(input, { target: { value: 'testuser' } });

      expect(onChange).toHaveBeenCalled();
    });

    test('calls onBlur when input loses focus', () => {
      const onBlur = vi.fn();
      render(<FormField {...defaultProps} onBlur={onBlur} />);

      const input = screen.getByLabelText('Username');
      fireEvent.blur(input);

      expect(onBlur).toHaveBeenCalled();
    });

    test('input displays current value', () => {
      render(<FormField {...defaultProps} value="currentvalue" />);

      const input = screen.getByLabelText('Username');
      expect(input).toHaveValue('currentvalue');
    });

    test('clicking tooltip button calls onToggleTooltip', () => {
      const onToggleTooltip = vi.fn();
      render(<FormField {...defaultProps} onToggleTooltip={onToggleTooltip} />);

      const tooltipButton = screen.getByTestId('tooltip-username');
      fireEvent.click(tooltipButton);

      expect(onToggleTooltip).toHaveBeenCalledWith('username');
    });
  });

  describe('required attribute', () => {
    test('input is required by default', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeRequired();
    });

    test('input can be optional when required=false', () => {
      render(<FormField {...defaultProps} required={false} />);
      const input = screen.getByLabelText('Username');
      expect(input).not.toBeRequired();
    });
  });

  describe('styling and layout', () => {
    test('input container has proper styling', () => {
      render(<FormField {...defaultProps} />);
      const inputContainer = screen.getByLabelText('Username').closest('div');

      expect(inputContainer).toHaveClass('flex');
      expect(inputContainer).toHaveClass('items-center');
      expect(inputContainer).toHaveClass('bg-white/80');
      expect(inputContainer).toHaveClass('rounded-md');
    });

    test('label has proper styling', () => {
      render(<FormField {...defaultProps} />);
      const label = screen.getByText(/Username:/i).closest('label');

      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
      expect(label).toHaveClass('text-slate-600');
    });

    test('input has transparent background', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Username');

      expect(input).toHaveClass('bg-transparent');
      expect(input).toHaveClass('outline-none');
    });
  });

  describe('tooltip integration', () => {
    test('tooltip receives correct props', () => {
      render(
        <FormField
          {...defaultProps}
          tooltipContent="Test tooltip content"
          tooltipVisible={true}
        />
      );

      const tooltip = screen.getByTestId('tooltip-username');
      expect(tooltip).toBeInTheDocument();
    });

    test('tooltip aria-label is correct for email field', () => {
      render(
        <FormField
          {...defaultProps}
          type="email"
          name="email"
          label="Email"
        />
      );

      const tooltip = screen.getByTestId('tooltip-email');
      expect(tooltip).toHaveAttribute('aria-label', 'Show email requirements');
    });

    test('tooltip aria-label is correct for username field', () => {
      render(<FormField {...defaultProps} type="text" name="username" label="Username" />);

      const tooltip = screen.getByTestId('tooltip-username');
      expect(tooltip).toHaveAttribute('aria-label', 'Show username requirements');
    });

    test('tooltip aria-label is correct for password field', () => {
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
        />
      );

      const tooltip = screen.getByTestId('tooltip-password');
      expect(tooltip).toHaveAttribute('aria-label', 'Show password requirements');
    });
  });

  describe('accessibility', () => {
    test('input has aria-label', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('aria-label', 'Username');
    });

    test('label is properly associated with input', () => {
      render(<FormField {...defaultProps} />);
      const label = screen.getByText(/Username:/i).closest('label');
      const input = screen.getByLabelText('Username');

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    test('Show Password checkbox has proper label association', () => {
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
          showPassword={false}
          onTogglePassword={vi.fn()}
        />
      );

      const checkbox = screen.getByRole('checkbox', { name: 'Show Password' });
      const label = screen.getByText('Show Password');

      expect(checkbox).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  describe('different field types', () => {
    test('renders email field correctly', () => {
      render(
        <FormField
          {...defaultProps}
          type="email"
          name="email"
          label="Email"
          placeholder="Enter email"
        />
      );

      expect(screen.getByTestId('icon-email')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    test('renders password field correctly', () => {
      render(
        <FormField
          {...defaultProps}
          type="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          showPassword={false}
          onTogglePassword={vi.fn()}
        />
      );

      expect(screen.getByTestId('icon-lock')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
      expect(screen.getByLabelText('Show Password')).toBeInTheDocument();
    });

    test('renders text field correctly', () => {
      render(
        <FormField
          {...defaultProps}
          type="text"
          name="username"
          label="Username"
          placeholder="Enter username"
        />
      );

      expect(screen.getByTestId('icon-user')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toHaveAttribute('type', 'text');
    });
  });
});
