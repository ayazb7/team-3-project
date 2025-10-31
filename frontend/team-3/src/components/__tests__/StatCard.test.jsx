import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

// Mock icon component
const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('StatCard component', () => {
  describe('basic rendering', () => {
    test('renders label', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('Courses Completed')).toBeInTheDocument();
    });

    test('renders value', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('12')).toBeInTheDocument();
    });

    test('renders icon', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    test('applies color prop to icon container', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const iconContainer = screen.getByTestId('mock-icon').parentElement;
      expect(iconContainer.className).toContain('bg-blue-100');
    });
  });

  describe('subtext', () => {
    test('renders subtext when provided', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          subtext="this month"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('this month')).toBeInTheDocument();
    });

    test('does not render subtext when not provided', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      // Check that no subtext element exists
      const subtextElement = screen.queryByText(/this month/i);
      expect(subtextElement).not.toBeInTheDocument();
    });

    test('subtext has correct styling', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          subtext="this month"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const subtext = screen.getByText('this month');
      expect(subtext).toHaveClass('text-sm');
      expect(subtext).toHaveClass('text-gray-500');
    });
  });

  describe('styling and layout', () => {
    test('card has white background and shadow', () => {
      const { container } = render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('rounded-xl');
    });

    test('label has correct styling', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const label = screen.getByText('Courses Completed');
      expect(label).toHaveClass('font-bold');
      expect(label).toHaveClass('text-gray-900');
      expect(label).toHaveClass('text-sm');
    });

    test('value has correct styling', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const value = screen.getByText('12');
      expect(value).toHaveClass('text-4xl');
      expect(value).toHaveClass('font-bold');
      expect(value).toHaveClass('text-gray-900');
    });

    test('icon container has rounded corners and padding', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const iconContainer = screen.getByTestId('mock-icon').parentElement;
      expect(iconContainer.className).toContain('p-2');
      expect(iconContainer.className).toContain('rounded-lg');
    });

    test('header uses flex layout with space between', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const label = screen.getByText('Courses Completed');
      const header = label.closest('div');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('items-center');
      expect(header).toHaveClass('justify-between');
    });

    test('value and subtext use flex layout', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          subtext="this month"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const value = screen.getByText('12');
      const container = value.closest('div');
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('items-end');
      expect(container).toHaveClass('gap-2');
    });
  });

  describe('different color variations', () => {
    test('applies green color correctly', () => {
      render(
        <StatCard
          label="Active Users"
          value="150"
          icon={MockIcon}
          color="bg-green-100"
        />
      );

      const iconContainer = screen.getByTestId('mock-icon').parentElement;
      expect(iconContainer.className).toContain('bg-green-100');
    });

    test('applies purple color correctly', () => {
      render(
        <StatCard
          label="New Courses"
          value="5"
          icon={MockIcon}
          color="bg-purple-100"
        />
      );

      const iconContainer = screen.getByTestId('mock-icon').parentElement;
      expect(iconContainer.className).toContain('bg-purple-100');
    });

    test('applies orange color correctly', () => {
      render(
        <StatCard
          label="Pending Reviews"
          value="23"
          icon={MockIcon}
          color="bg-orange-100"
        />
      );

      const iconContainer = screen.getByTestId('mock-icon').parentElement;
      expect(iconContainer.className).toContain('bg-orange-100');
    });
  });

  describe('different value types', () => {
    test('renders numeric string values', () => {
      render(
        <StatCard
          label="Total"
          value="1,234"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    test('renders percentage values', () => {
      render(
        <StatCard
          label="Progress"
          value="75%"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    test('renders time values', () => {
      render(
        <StatCard
          label="Time Spent"
          value="24h"
          subtext="this week"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('24h')).toBeInTheDocument();
    });

    test('renders decimal values', () => {
      render(
        <StatCard
          label="Average Score"
          value="4.8"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('4.8')).toBeInTheDocument();
    });
  });

  describe('with different labels', () => {
    test('renders long labels correctly', () => {
      render(
        <StatCard
          label="Total Courses Completed This Year"
          value="42"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('Total Courses Completed This Year')).toBeInTheDocument();
    });

    test('renders short labels correctly', () => {
      render(
        <StatCard
          label="Score"
          value="95"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('Score')).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    test('maintains correct DOM hierarchy', () => {
      const { container } = render(
        <StatCard
          label="Test"
          value="10"
          subtext="today"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const card = container.firstChild;
      expect(card).toBeInTheDocument();
      expect(card.children.length).toBe(2); // Header and value container
    });

    test('header contains label and icon', () => {
      render(
        <StatCard
          label="Test Label"
          value="10"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      const label = screen.getByText('Test Label');
      const icon = screen.getByTestId('mock-icon');
      const header = label.closest('div');

      expect(header).toContainElement(label);
      expect(header).toContainElement(icon.closest('div'));
    });
  });

  describe('real-world scenarios', () => {
    test('renders dashboard stats card correctly', () => {
      render(
        <StatCard
          label="Courses Completed"
          value="12"
          subtext="of 20"
          icon={MockIcon}
          color="bg-blue-100"
        />
      );

      expect(screen.getByText('Courses Completed')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('of 20')).toBeInTheDocument();
    });

    test('renders time tracking card correctly', () => {
      render(
        <StatCard
          label="Learning Time"
          value="45h"
          subtext="this month"
          icon={MockIcon}
          color="bg-green-100"
        />
      );

      expect(screen.getByText('Learning Time')).toBeInTheDocument();
      expect(screen.getByText('45h')).toBeInTheDocument();
      expect(screen.getByText('this month')).toBeInTheDocument();
    });

    test('renders achievement card correctly', () => {
      render(
        <StatCard
          label="Certificates Earned"
          value="8"
          icon={MockIcon}
          color="bg-purple-100"
        />
      );

      expect(screen.getByText('Certificates Earned')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });
});
