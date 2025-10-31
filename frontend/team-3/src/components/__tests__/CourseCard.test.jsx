import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CourseCard from '../CourseCard';

// ---- Mocks ----

vi.mock('react-icons/fa', () => ({
  FaGraduationCap: () => <div data-testid="icon-graduation" />,
  FaClock: () => <div data-testid="icon-clock" />,
}));

vi.mock('../utils', () => ({
  courseDifficultyColorMap: {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-purple-100 text-purple-700',
  },
}));

// ---- Helper ----
const defaultProps = {
  id: 1,
  name: 'Web Development 101',
  difficulty: 'Beginner',
  duration_min_minutes: 120,
  duration_max_minutes: 240,
  thumbnail_url: '/img/course-thumbnail.png',
};

const renderCourseCard = (props = {}) => {
  return render(
    <MemoryRouter>
      <CourseCard {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CourseCard component', () => {
  describe('basic rendering', () => {
    test('renders course name', () => {
      renderCourseCard();
      expect(screen.getByText('Web Development 101')).toBeInTheDocument();
    });

    test('renders course thumbnail', () => {
      renderCourseCard();
      const image = screen.getByAltText('catImg');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/img/course-thumbnail.png');
    });

    test('renders difficulty badge', () => {
      renderCourseCard();
      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByTestId('icon-graduation')).toBeInTheDocument();
    });

    test('renders duration', () => {
      renderCourseCard();
      expect(screen.getByText('120 - 240 mins')).toBeInTheDocument();
      expect(screen.getByTestId('icon-clock')).toBeInTheDocument();
    });

    test('links to correct course page', () => {
      renderCourseCard();
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/dashboard/course/1');
    });
  });

  describe('thumbnail handling', () => {
    test('uses provided thumbnail URL', () => {
      renderCourseCard({ thumbnail_url: '/custom-thumbnail.jpg' });
      const image = screen.getByAltText('catImg');
      expect(image).toHaveAttribute('src', '/custom-thumbnail.jpg');
    });

    test('uses default image when thumbnail_url is not provided', () => {
      renderCourseCard({ thumbnail_url: null });
      const image = screen.getByAltText('catImg');
      // Should have default catImg src
      expect(image).toBeInTheDocument();
    });
  });

  describe('difficulty styling', () => {
    test('applies correct styling for Beginner difficulty', () => {
      renderCourseCard({ difficulty: 'Beginner' });
      const badge = screen.getByText('Beginner').closest('span');
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-700');
    });

    test('applies correct styling for Intermediate difficulty', () => {
      renderCourseCard({ difficulty: 'Intermediate' });
      const badge = screen.getByText('Intermediate').closest('span');
      expect(badge).toHaveClass('bg-yellow-100');
      expect(badge).toHaveClass('text-yellow-700');
    });

    test('applies correct styling for Advanced difficulty', () => {
      renderCourseCard({ difficulty: 'Advanced' });
      const badge = screen.getByText('Advanced').closest('span');
      expect(badge).toHaveClass('bg-purple-100');
      expect(badge).toHaveClass('text-purple-700');
    });

    test('handles case-insensitive difficulty', () => {
      renderCourseCard({ difficulty: 'BEGINNER' });
      const badge = screen.getByText('BEGINNER').closest('span');
      expect(badge).toHaveClass('bg-green-100');
    });

    test('shows default difficulty when not provided', () => {
      renderCourseCard({ difficulty: null });
      expect(screen.getByText('Digital Skills')).toBeInTheDocument();
    });
  });

  describe('progress bar', () => {
    test('shows progress bar when progress is provided', () => {
      renderCourseCard({ progress: 60 });
      const progressBar = screen.getByRole('link').querySelector('.bg-blue-500');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '60%' });
    });

    test('hides progress bar when progress is not provided', () => {
      renderCourseCard({ progress: null });
      const progressContainer = screen.getByRole('link').querySelector('.bg-gray-200.rounded-full');
      expect(progressContainer).toHaveClass('hidden');
    });

    test('shows 0% progress correctly', () => {
      renderCourseCard({ progress: 0 });
      const progressBar = screen.getByRole('link').querySelector('.bg-blue-500');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    test('shows 100% progress correctly', () => {
      renderCourseCard({ progress: 100 });
      const progressBar = screen.getByRole('link').querySelector('.bg-blue-500');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });

  describe('course name', () => {
    test('displays course name with title attribute', () => {
      renderCourseCard({ name: 'Very Long Course Name That Might Be Truncated' });
      const heading = screen.getByTitle('Very Long Course Name That Might Be Truncated');
      expect(heading).toHaveTextContent('Very Long Course Name That Might Be Truncated');
    });

    test('applies line-clamp styling to course name', () => {
      renderCourseCard();
      const heading = screen.getByText('Web Development 101');
      expect(heading).toHaveClass('line-clamp-2');
    });
  });

  describe('duration display', () => {
    test('displays correct duration range', () => {
      renderCourseCard({
        duration_min_minutes: 30,
        duration_max_minutes: 60,
      });
      expect(screen.getByText('30 - 60 mins')).toBeInTheDocument();
    });

    test('handles large duration values', () => {
      renderCourseCard({
        duration_min_minutes: 480,
        duration_max_minutes: 600,
      });
      expect(screen.getByText('480 - 600 mins')).toBeInTheDocument();
    });
  });

  describe('hover effects', () => {
    test('card has hover background transition', () => {
      renderCourseCard();
      const link = screen.getByRole('link');
      expect(link).toHaveClass('hover:bg-gray-300');
      expect(link).toHaveClass('transition-colors');
    });
  });

  describe('layout and styling', () => {
    test('card uses rounded corners', () => {
      renderCourseCard();
      const link = screen.getByRole('link');
      expect(link).toHaveClass('rounded-lg');
    });

    test('thumbnail has aspect ratio styling', () => {
      renderCourseCard();
      const thumbnailContainer = screen.getByAltText('catImg').closest('div');
      expect(thumbnailContainer).toHaveClass('aspect-video');
    });

    test('badges are displayed in flex layout', () => {
      renderCourseCard();
      const badgeContainer = screen.getByText('Beginner').closest('.flex');
      expect(badgeContainer).toHaveClass('flex-wrap');
      expect(badgeContainer).toHaveClass('gap-2');
    });

    test('difficulty badge has proper padding and styling', () => {
      renderCourseCard();
      const badge = screen.getByText('Beginner').closest('span');
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('rounded-full');
    });
  });

  describe('accessibility', () => {
    test('thumbnail has alt text', () => {
      renderCourseCard();
      const image = screen.getByAltText('catImg');
      expect(image).toHaveAttribute('alt');
    });

    test('course name is in heading element', () => {
      renderCourseCard();
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Web Development 101');
    });

    test('card link is keyboard accessible', () => {
      renderCourseCard();
      const link = screen.getByRole('link');
      expect(link).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe('different prop combinations', () => {
    test('renders correctly with minimal props', () => {
      renderCourseCard({
        id: 1,
        name: 'Test Course',
        duration_min_minutes: 60,
        duration_max_minutes: 90,
      });

      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('60 - 90 mins')).toBeInTheDocument();
    });

    test('renders correctly with all props', () => {
      renderCourseCard({
        id: 1,
        name: 'Complete Course',
        difficulty: 'Advanced',
        duration_min_minutes: 180,
        duration_max_minutes: 240,
        thumbnail_url: '/advanced-course.png',
        progress: 75,
      });

      expect(screen.getByText('Complete Course')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
      expect(screen.getByText('180 - 240 mins')).toBeInTheDocument();
      const progressBar = screen.getByRole('link').querySelector('.bg-blue-500');
      expect(progressBar).toHaveStyle({ width: '75%' });
    });
  });
});
