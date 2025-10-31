import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';
import axios from 'axios';

// ---- Mocks ----

vi.mock('axios');

// Mock components
vi.mock('../../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock('../../components/ModelViewer', () => ({
  default: () => <div data-testid="model-viewer">Model Viewer</div>,
}));

vi.mock('../../components/VideoBlock', () => ({
  default: () => <div data-testid="video-block">Video Block</div>,
}));

vi.mock('../../components/CourseCard', () => ({
  default: ({ id, name, difficulty }) => (
    <div data-testid={`course-card-${id}`}>
      <h3>{name}</h3>
      <p>{difficulty}</p>
    </div>
  ),
}));

vi.mock('../../components/Button', () => ({
  default: ({ label, className }) => (
    <button className={className}>{label}</button>
  ),
}));

const mockCoursesData = [
  {
    id: 1,
    name: 'Web Development 101',
    difficulty: 'Beginner',
    thumbnail_url: '/img/web-dev.png',
    duration_min_minutes: 120,
    duration_max_minutes: 240,
  },
  {
    id: 2,
    name: 'JavaScript Advanced',
    difficulty: 'Advanced',
    thumbnail_url: '/img/js-adv.png',
    duration_min_minutes: 180,
    duration_max_minutes: 300,
  },
  {
    id: 3,
    name: 'React Fundamentals',
    difficulty: 'Intermediate',
    thumbnail_url: '/img/react.png',
    duration_min_minutes: 150,
    duration_max_minutes: 270,
  },
];

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: mockScrollTo,
});

// ---- Helper ----
const renderLandingPage = () => {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  axios.get.mockResolvedValue({ data: mockCoursesData });
});

describe('LandingPage', () => {
  describe('initial render', () => {
    test('renders hero heading', () => {
      renderLandingPage();

      expect(screen.getByText('Learn Anytime, Anywhere')).toBeInTheDocument();
    });

    test('renders hero description', () => {
      renderLandingPage();

      expect(
        screen.getByText('Explore our diverse range of courses and expand your knowledge')
      ).toBeInTheDocument();
    });

    test('renders "Browse Courses" button', () => {
      renderLandingPage();

      const button = screen.getByRole('button', { name: 'Browse Courses' });
      expect(button).toBeInTheDocument();
      expect(button.className).toContain('bg-blue-500');
    });

    test('renders featured courses heading', () => {
      renderLandingPage();

      expect(screen.getByText('Featured Courses')).toBeInTheDocument();
    });

    test('renders hero image', () => {
      renderLandingPage();

      const heroImage = screen.getByAltText('cat');
      expect(heroImage).toBeInTheDocument();
    });

    test('scrolls to top on mount', () => {
      renderLandingPage();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('courses fetching', () => {
    test('fetches public courses on mount', async () => {
      renderLandingPage();

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/courses/public');
      });
    });

    test('displays fetched courses', async () => {
      renderLandingPage();

      await waitFor(() => {
        expect(screen.getByText('Web Development 101')).toBeInTheDocument();
        expect(screen.getByText('JavaScript Advanced')).toBeInTheDocument();
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
    });

    test('renders correct number of course cards', async () => {
      renderLandingPage();

      await waitFor(() => {
        const courseCards = screen.getAllByTestId(/course-card-/);
        expect(courseCards.length).toBe(3);
      });
    });

    test('passes correct props to CourseCard', async () => {
      renderLandingPage();

      await waitFor(() => {
        expect(screen.getByTestId('course-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('course-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('course-card-3')).toBeInTheDocument();
      });
    });

    test('handles empty courses array', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderLandingPage();

      await waitFor(() => {
        const courseCards = screen.queryAllByTestId(/course-card-/);
        expect(courseCards.length).toBe(0);
      });
    });

    test('handles fetch error gracefully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      axios.get.mockRejectedValue(new Error('Network error'));

      renderLandingPage();

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      // Page should still render without courses
      expect(screen.getByText('Learn Anytime, Anywhere')).toBeInTheDocument();

      consoleLogSpy.mockRestore();
    });

    test('logs successful course fetch', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      renderLandingPage();

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          'successfully requested data',
          mockCoursesData
        );
      });

      consoleLogSpy.mockRestore();
    });
  });

  describe('responsive layout', () => {
    test('hero section uses responsive classes', () => {
      renderLandingPage();

      const heading = screen.getByText('Learn Anytime, Anywhere');
      expect(heading).toHaveClass('text-4xl');
      expect(heading).toHaveClass('md:text-4xl');
      expect(heading).toHaveClass('lg:text-5xl');
      expect(heading).toHaveClass('xl:text-7xl');
    });

    test('description uses responsive alignment', () => {
      renderLandingPage();

      const description = screen.getByText(
        'Explore our diverse range of courses and expand your knowledge'
      );
      expect(description.className).toContain('text-center');
      expect(description.className).toContain('md:text-left');
    });

    test('browse button uses responsive sizing', () => {
      renderLandingPage();

      const button = screen.getByRole('button', { name: 'Browse Courses' });
      expect(button).toHaveClass('w-40');
      expect(button).toHaveClass('md:w-50');
      expect(button).toHaveClass('lg:w-70');
      expect(button).toHaveClass('xl:w-80');
    });

    test('featured courses heading is responsive', () => {
      renderLandingPage();

      const heading = screen.getByText('Featured Courses');
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('md:text-3xl');
      expect(heading).toHaveClass('xl:text-4xl');
    });

    test('courses layout changes from column to row', async () => {
      renderLandingPage();

      await waitFor(() => {
        const coursesContainer = screen.getByTestId('course-card-1').parentElement;
        expect(coursesContainer.className).toContain('flex-col');
        expect(coursesContainer.className).toContain('md:flex-row');
      });
    });
  });

  describe('hero section', () => {
    test('hero image is hidden on mobile', () => {
      renderLandingPage();

      const heroImage = screen.getByAltText('cat');
      expect(heroImage.className).toContain('hidden');
      expect(heroImage.className).toContain('md:block');
    });

    test('hero uses grid layout on medium screens', () => {
      renderLandingPage();

      const heading = screen.getByText('Learn Anytime, Anywhere');
      const gridContainer = heading.closest('.md\\:grid');
      expect(gridContainer).toBeInTheDocument();
    });

    test('CTA button has correct styling', () => {
      renderLandingPage();

      const button = screen.getByRole('button', { name: 'Browse Courses' });
      expect(button).toHaveClass('text-white');
      expect(button.className).toContain('bg-blue-500');
      expect(button).toHaveClass('rounded-lg');
    });
  });

  describe('accessibility', () => {
    test('hero image has alt text', () => {
      renderLandingPage();

      const heroImage = screen.getByAltText('cat');
      expect(heroImage).toHaveAttribute('alt', 'cat');
    });

    test('all headings are properly structured', () => {
      renderLandingPage();

      expect(screen.getByText('Learn Anytime, Anywhere')).toBeInTheDocument();
      expect(screen.getByText('Featured Courses')).toBeInTheDocument();
    });

    test('Browse Courses button is keyboard accessible', () => {
      renderLandingPage();

      const button = screen.getByRole('button', { name: 'Browse Courses' });
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('page structure', () => {
    test('renders main container with correct spacing', () => {
      renderLandingPage();

      const mainContainer = screen.getByText('Learn Anytime, Anywhere').closest('div.h-full');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('pt-20');
    });

    test('content sections have proper gap spacing', () => {
      renderLandingPage();

      const heading = screen.getByText('Learn Anytime, Anywhere');
      const parentSection = heading.closest('.flex.flex-col');
      expect(parentSection.className).toContain('gap-5');
    });
  });

  describe('lifecycle', () => {
    test('fetches courses only once on mount', async () => {
      renderLandingPage();

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
      });
    });

    test('scrolls to top only once on mount', () => {
      renderLandingPage();

      expect(mockScrollTo).toHaveBeenCalledTimes(1);
    });
  });
});
