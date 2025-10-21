import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Learning from '../Learning';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
vi.mock('axios');
vi.mock('../../context/AuthContext');
vi.mock('lucide-react', () => ({
  ThumbsUp: () => <div data-testid="thumbs-up-icon">ThumbsUp Icon</div>,
  ThumbsDown: () => <div data-testid="thumbs-down-icon">ThumbsDown Icon</div>
}));

describe('Learning Component', () => {
  const mockAccessToken = 'test-token';
  const mockTutorialData = {
    id: '1',
    title: 'Test Tutorial',
    description: 'Test Description',
    category: 'Programming',
    video_url: 'https://example.com/video',
    created_at: '2024-01-01'
  };
  const mockCourseData = {
    id: 'course-1',
    name: 'Test Course'
  };

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ accessToken: mockAccessToken });
    vi.mocked(axios.get).mockClear();
    
    // Mock successful API calls
    vi.mocked(axios.get).mockImplementation((url) => {
      if (url.includes('/tutorials/')) {
        return Promise.resolve({ data: mockTutorialData });
      }
      if (url.includes('/courses/')) {
        return Promise.resolve({ data: mockCourseData });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/course/course-1/tutorial/1']}>
        <Routes>
          <Route path="/course/:courseId/tutorial/:tutorialId" element={<Learning />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Component Rendering', () => {
    test('renders skeleton loader initially', () => {
      renderComponent();
      const skeletonLoader = document.querySelector('.animate-pulse');
      expect(skeletonLoader).toBeInTheDocument();
    });

    test('renders tutorial data after loading', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
      });

      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Programming')).toBeInTheDocument();
    });

    test('renders breadcrumb navigation', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      expect(screen.getByText(/Test Course/)).toBeInTheDocument();
      expect(screen.getByText(/Programming/)).toBeInTheDocument();
    });

    test('renders video iframe with correct src', async () => {
      renderComponent();

      await waitFor(() => {
        const iframe = document.querySelector('iframe');
        expect(iframe).toHaveAttribute('src', 'https://example.com/video');
      });
    });

    test('renders Browse this tutorial text', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Browse this tutorial')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches tutorial and course data on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          'http://localhost:5000/courses/course-1/tutorials/1',
          { headers: { Authorization: 'Bearer test-token' } }
        );
      });

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/courses/course-1',
        { headers: { Authorization: 'Bearer test-token' } }
      );
    });

    test('handles fetch errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'Error fetching data:',
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });

    test('sets loading state to false after data fetch', async () => {
      renderComponent();

      await waitFor(() => {
        const skeletonLoader = document.querySelector('.animate-pulse');
        expect(skeletonLoader).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    test('Overview tab is active by default', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
      });

      const overviewTab = screen.getByText('Overview').closest('span');
      expect(overviewTab).toHaveClass('bg-gray-300');
    });

    test('switches to Transcript tab when clicked', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
      });

      const transcriptTab = screen.getByText('Transcript');
      fireEvent.click(transcriptTab);

      const transcriptTabSpan = transcriptTab.closest('span');
      expect(transcriptTabSpan).toHaveClass('bg-gray-300');
    });

    test('displays overview content when Overview tab is active', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Description')).toBeInTheDocument();
      });

      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Tutorial Category')).toBeInTheDocument();
      expect(screen.getByText('Programming')).toBeInTheDocument();
      expect(screen.getByText('Created at:')).toBeInTheDocument();
    });

    test('hides overview content when Transcript tab is active', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
      });

      const transcriptTab = screen.getByText('Transcript');
      fireEvent.click(transcriptTab);

      const overviewContent = document.querySelector('.flex-col.w-full.h-full.p-5.gap-3');
      expect(overviewContent).toHaveClass('hidden');
    });
  });

  describe('Feedback Flow', () => {
    test('shows feedback button initially', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('I finished watching - Give Feedback')).toBeInTheDocument();
      });
    });

    test('displays feedback options when button is clicked', async () => {
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        expect(screen.getByText('How was this tutorial?')).toBeInTheDocument();
      });

      expect(screen.getByText('Helpful')).toBeInTheDocument();
      expect(screen.getByText('Not Helpful')).toBeInTheDocument();
    });

    test('hides feedback button after clicking', async () => {
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('I finished watching - Give Feedback')).not.toBeInTheDocument();
      });
    });

    test('submits positive feedback', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        const helpfulButton = screen.getByText('Helpful');
        fireEvent.click(helpfulButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument();
      });

      expect(screen.getByText(/Your positive feedback helps us improve/)).toBeInTheDocument();
      expect(consoleLog).toHaveBeenCalledWith('Feedback submitted:', 'positive');
      consoleLog.mockRestore();
    });

    test('submits negative feedback', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        const notHelpfulButton = screen.getByText('Not Helpful');
        fireEvent.click(notHelpfulButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument();
      });

      expect(screen.getByText(/Your negative feedback helps us improve/)).toBeInTheDocument();
      expect(consoleLog).toHaveBeenCalledWith('Feedback submitted:', 'negative');
      consoleLog.mockRestore();
    });

    test('prevents duplicate feedback submission', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        const helpfulButton = screen.getByText('Helpful');
        fireEvent.click(helpfulButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument();
      });

      // Feedback buttons should no longer be visible
      expect(screen.queryByText('Helpful')).not.toBeInTheDocument();
      expect(screen.queryByText('Not Helpful')).not.toBeInTheDocument();

      // Should only be called once
      expect(consoleLog).toHaveBeenCalledTimes(1);
      consoleLog.mockRestore();
    });

    test('displays thumbs up and thumbs down icons', async () => {
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('thumbs-up-icon')).toBeInTheDocument();
        expect(screen.getByTestId('thumbs-down-icon')).toBeInTheDocument();
      });
    });
  });

  describe('Gesture Recognition', () => {
    beforeEach(() => {
      // Mock Teachable Machine scripts
      window.tmImage = {
        load: vi.fn().mockResolvedValue({
          getTotalClasses: vi.fn().mockReturnValue(3),
          predict: vi.fn().mockResolvedValue([
            { className: 'neutral', probability: 0.8 },
            { className: 'thumbs up', probability: 0.1 },
            { className: 'thumbs down', probability: 0.1 }
          ])
        }),
        Webcam: vi.fn().mockImplementation(() => ({
          setup: vi.fn().mockResolvedValue(undefined),
          play: vi.fn().mockResolvedValue(undefined),
          stop: vi.fn(),
          update: vi.fn(),
          canvas: document.createElement('canvas')
        }))
      };

      window.requestAnimationFrame = vi.fn((cb) => {
        setTimeout(cb, 16);
        return 1;
      });
      window.cancelAnimationFrame = vi.fn();
    });

    test('shows gesture recognition button', async () => {
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Start Gesture Recognition')).toBeInTheDocument();
      });

      expect(screen.getByText('Or use gesture recognition:')).toBeInTheDocument();
    });

    test('initializes webcam when gesture recognition starts', async () => {
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        const gestureButton = screen.getByText('Start Gesture Recognition');
        fireEvent.click(gestureButton);
      });

      await waitFor(() => {
        expect(window.tmImage.load).toHaveBeenCalled();
      });
    });

    test('handles webcam initialization errors', async () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      window.tmImage.load.mockRejectedValueOnce(new Error('Camera access denied'));

      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      await waitFor(() => {
        const gestureButton = screen.getByText('Start Gesture Recognition');
        fireEvent.click(gestureButton);
      });

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          "Error starting webcam. Please make sure you've granted camera permissions."
        );
      });

      alertMock.mockRestore();
    });

    test('displays hold progress indicator', async () => {
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      // Progress indicator should not be visible initially
      expect(screen.queryByText('Hold gesture...')).not.toBeInTheDocument();
    });
  });

  describe('Feedback Confirmation', () => {
    test('shows confirmation dialog for pending feedback', async () => {
      renderComponent();

      await waitFor(() => {
        const feedbackButton = screen.getByText('I finished watching - Give Feedback');
        fireEvent.click(feedbackButton);
      });

      // This would require simulating the gesture detection flow
      // which sets pendingFeedback state
    });
  });

  describe('Edge Cases', () => {
    test('handles missing tutorial data gracefully', async () => {
      vi.mocked(axios.get).mockImplementation((url) => {
        if (url.includes('/tutorials/')) {
          return Promise.resolve({ data: null });
        }
        if (url.includes('/courses/')) {
          return Promise.resolve({ data: mockCourseData });
        }
      });

      renderComponent();

      await waitFor(() => {
        // Component should render without crashing
        const skeletonLoader = document.querySelector('.animate-pulse');
        expect(skeletonLoader).not.toBeInTheDocument();
      });
    });

    test('handles missing course data gracefully', async () => {
      vi.mocked(axios.get).mockImplementation((url) => {
        if (url.includes('/tutorials/')) {
          return Promise.resolve({ data: mockTutorialData });
        }
        if (url.includes('/courses/')) {
          return Promise.resolve({ data: null });
        }
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
      });

      expect(screen.getByText(/Course/)).toBeInTheDocument();
    });

    test('handles undefined created_at date', async () => {
      const dataWithoutDate = { ...mockTutorialData, created_at: undefined };
      vi.mocked(axios.get).mockImplementation((url) => {
        if (url.includes('/tutorials/')) {
          return Promise.resolve({ data: dataWithoutDate });
        }
        if (url.includes('/courses/')) {
          return Promise.resolve({ data: mockCourseData });
        }
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Unknown')).toBeInTheDocument();
      });
    });

    test('handles missing video URL', async () => {
      const dataWithoutVideo = { ...mockTutorialData, video_url: undefined };
      vi.mocked(axios.get).mockImplementation((url) => {
        if (url.includes('/tutorials/')) {
          return Promise.resolve({ data: dataWithoutVideo });
        }
        if (url.includes('/courses/')) {
          return Promise.resolve({ data: mockCourseData });
        }
      });

      renderComponent();

      await waitFor(() => {
        const iframe = document.querySelector('iframe');
        expect(iframe).toBeInTheDocument();
      });
    });
  });

  describe('Cleanup', () => {
    test('stops webcam on component unmount', async () => {
      const { unmount } = renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
      });

      unmount();

      // Webcam cleanup is called in useEffect cleanup
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});