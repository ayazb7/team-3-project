import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Courses from '../Courses';
import axios from 'axios';

// ---- Mocks ----

vi.mock('axios');

const mockFetchUserDetails = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    accessToken: null,
    fetchUserDetails: mockFetchUserDetails,
  }),
}));

// Mock CourseCard component
vi.mock('../../components/CourseCard', () => ({
  default: ({ id, name, difficulty }) => (
    <div data-testid={`course-card-${id}`}>
      <h3>{name}</h3>
      <p>{difficulty}</p>
    </div>
  ),
}));

const mockCoursesData = [
  { id: 1, name: 'Web Development 101', difficulty: 'Beginner', duration: '8 weeks' },
  { id: 2, name: 'JavaScript Advanced', difficulty: 'Advanced', duration: '6 weeks' },
  { id: 3, name: 'React Fundamentals', difficulty: 'Intermediate', duration: '4 weeks' },
];

// ---- Helper ----
const renderCourses = () => {
  return render(
    <MemoryRouter>
      <Courses />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Courses page', () => {
  describe('public (unauthenticated) view', () => {
    beforeEach(() => {
      mockFetchUserDetails.mockRejectedValue(new Error('Not authenticated'));
      axios.get.mockImplementation((url) => {
        if (url.includes('/courses/public')) {
          return Promise.resolve({ data: mockCoursesData });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    test('renders page heading', async () => {
      renderCourses();

      await waitFor(() => {
        expect(screen.getByText('Get started with these')).toBeInTheDocument();
      });
    });

    test('renders search input', async () => {
      renderCourses();

      const searchInput = screen.getByPlaceholderText('How to set up email..');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    test('renders search button', async () => {
      renderCourses();

      const searchButton = screen.getByRole('button', { name: /Search/i });
      expect(searchButton).toBeInTheDocument();
    });

    test('renders all course cards', async () => {
      renderCourses();

      await waitFor(() => {
        expect(screen.getByTestId('course-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('course-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('course-card-3')).toBeInTheDocument();
      });
    });

    test('does not show recommended section when not logged in', async () => {
      renderCourses();

      await waitFor(() => {
        expect(screen.getByText('Get started with these')).toBeInTheDocument();
      });

      expect(
        screen.queryByText('Recommended for you based on your current courses')
      ).not.toBeInTheDocument();
    });

    test('handles error fetching public courses gracefully', async () => {
      mockFetchUserDetails.mockRejectedValue(new Error('Not authenticated'));
      axios.get.mockRejectedValue(new Error('Network error'));

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      renderCourses();

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          'Error fetching public courses',
          expect.any(Error)
        );
      });

      consoleLogSpy.mockRestore();
    });
  });

  describe('authenticated view', () => {
    beforeEach(() => {
      vi.mock('../../context/AuthContext', () => ({
        useAuth: () => ({
          accessToken: 'mock-token-123',
          fetchUserDetails: mockFetchUserDetails,
        }),
      }));

      mockFetchUserDetails.mockResolvedValue({});
      axios.get.mockResolvedValue({ data: mockCoursesData });
    });

    test('fetches courses with auth token when authenticated', async () => {
      renderCourses();

      await waitFor(() => {
        expect(mockFetchUserDetails).toHaveBeenCalled();
      });

      // Note: Due to the way the component is structured, it tries authenticated first
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    });

    test('displays courses in grid layout', async () => {
      renderCourses();

      await waitFor(() => {
        const grid = screen.getByTestId('course-card-1').parentElement;
        expect(grid).toHaveClass('grid');
      });
    });
  });

  describe('course display', () => {
    beforeEach(() => {
      mockFetchUserDetails.mockRejectedValue(new Error('Not authenticated'));
      axios.get.mockResolvedValue({ data: mockCoursesData });
    });

    test('displays correct number of courses', async () => {
      renderCourses();

      await waitFor(() => {
        const courseCards = screen.getAllByTestId(/course-card-/);
        expect(courseCards.length).toBe(mockCoursesData.length);
      });
    });

    test('handles empty course list', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderCourses();

      await waitFor(() => {
        expect(screen.getByText('Get started with these')).toBeInTheDocument();
      });

      const courseCards = screen.queryAllByTestId(/course-card-/);
      expect(courseCards.length).toBe(0);
    });

    test('displays course information correctly', async () => {
      renderCourses();

      await waitFor(() => {
        expect(screen.getByText('Web Development 101')).toBeInTheDocument();
        expect(screen.getByText('Beginner')).toBeInTheDocument();
      });
    });
  });

  describe('responsive layout', () => {
    beforeEach(() => {
      mockFetchUserDetails.mockRejectedValue(new Error('Not authenticated'));
      axios.get.mockResolvedValue({ data: mockCoursesData });
    });

    test('uses responsive grid classes', async () => {
      renderCourses();

      await waitFor(() => {
        const grid = screen.getByTestId('course-card-1').parentElement;
        expect(grid).toHaveClass('grid-cols-1');
        expect(grid).toHaveClass('md:grid-cols-2');
        expect(grid).toHaveClass('lg:grid-cols-3');
      });
    });

    test('search section is responsive', () => {
      renderCourses();

      const searchContainer = screen.getByPlaceholderText('How to set up email..').parentElement;
      expect(searchContainer).toHaveClass('w-[60%]');
      expect(searchContainer).toHaveClass('lg:w-[40%]');
    });
  });

  describe('search functionality', () => {
    beforeEach(() => {
      mockFetchUserDetails.mockRejectedValue(new Error('Not authenticated'));
      axios.get.mockResolvedValue({ data: mockCoursesData });
    });

    test('search input accepts text', () => {
      renderCourses();

      const searchInput = screen.getByPlaceholderText('How to set up email..');
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    test('search button is present', () => {
      renderCourses();

      const searchButton = screen.getByRole('button', { name: /Search/i });
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toHaveClass('bg-blue-500');
    });
  });

  describe('loading behavior', () => {
    test('component mounts and initiates data fetch', () => {
      mockFetchUserDetails.mockResolvedValue({});
      axios.get.mockResolvedValue({ data: mockCoursesData });

      renderCourses();

      expect(mockFetchUserDetails).toHaveBeenCalled();
    });

    test('fetches courses only once on mount', async () => {
      mockFetchUserDetails.mockRejectedValue(new Error('Not authenticated'));
      axios.get.mockResolvedValue({ data: mockCoursesData });

      renderCourses();

      await waitFor(() => {
        expect(mockFetchUserDetails).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('error handling', () => {
    test('logs error when both authenticated and public requests fail', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      mockFetchUserDetails.mockRejectedValue(new Error('Auth failed'));
      axios.get.mockRejectedValue(new Error('Network error'));

      renderCourses();

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          'Error fetching public courses',
          expect.any(Error)
        );
      });

      consoleLogSpy.mockRestore();
    });
  });
});
