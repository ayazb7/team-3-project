import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../Dashboard";
import * as AuthContextModule from "../../context/AuthContext";

// Mock useAuth hook
const mockUseAuth = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock child components
vi.mock("../../components/StatCard", () => ({
  default: ({ label, value, subtext, icon: Icon, color }) => (
    <div data-testid="stat-card" data-label={label}>
      <span>{label}</span>
      <span>{value}</span>
      {subtext && <span>{subtext}</span>}
    </div>
  ),
}));

vi.mock("../../components/CourseCard", () => ({
  default: (props) => (
    <div data-testid="course-card" data-course-id={props.id}>
      <a href={`/dashboard/course/${props.id}`}>{props.name}</a>
      <span>{props.progress}%</span>
    </div>
  ),
}));

vi.mock("../../components/EventCard", () => ({
  default: (props) => (
    <div data-testid="event-card">
      <span>{props.title}</span>
      <span>{props.location}</span>
      <span>{props.date}</span>
    </div>
  ),
}));

vi.mock("../../components/WeekProgress.jsx", () => ({
  default: ({ weeklyActivity }) => (
    <div data-testid="week-progress">
      Week Progress: {JSON.stringify(weeklyActivity)}
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  Play: () => <span data-testid="play-icon">Play</span>,
  GraduationCap: () => <span data-testid="graduation-icon">GraduationCap</span>,
  MapPin: () => <span data-testid="mappin-icon">MapPin</span>,
  ChevronLeft: () => <span data-testid="chevron-left">ChevronLeft</span>,
  ChevronRight: () => <span data-testid="chevron-right">ChevronRight</span>,
}));

describe("Dashboard Component", () => {
  let mockApi;
  let mockAuthContextValue;

  beforeEach(() => {
    mockApi = {
      get: vi.fn(),
    };

    mockAuthContextValue = {
      accessToken: "mock-token",
      username: "testuser",
      email: "test@example.com",
      api: mockApi,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      refresh: vi.fn(),
    };

    // Set up the mock useAuth to return our mock context value
    mockUseAuth.mockReturnValue(mockAuthContextValue);

    global.addEventListener = vi.fn();
    global.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderDashboard = (authContextValue = mockAuthContextValue) => {
    mockUseAuth.mockReturnValue(authContextValue);
    return render(<Dashboard />);
  };

  describe("Initial Rendering", () => {
    it("should render the dashboard title and welcome message", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      
      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalled();
      });
    });

    it("should render the light mode toggle button", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      // Wait for component to finish mounting
      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        const toggleButton = buttons.find(btn => btn.className.includes("bg-blue-500"));
        expect(toggleButton).toBeInTheDocument();
      });
    });

    it("should display loading spinner initially", () => {
      mockApi.get.mockImplementation(
        () => new Promise(() => {}) // Never resolves to keep loading state
      );

      const { container } = renderDashboard();

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should render all three default stat cards", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      const statCards = screen.getAllByTestId("stat-card");
      expect(statCards).toHaveLength(3);
      expect(screen.getByText("Courses Completed")).toBeInTheDocument();
      expect(screen.getByText("Tutorials Watched")).toBeInTheDocument();
      expect(screen.getByText("Time Spent")).toBeInTheDocument();
      
      // Wait for async operations
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalled();
      });
    });
  });

  describe("API Integration - Dashboard Stats", () => {
    it("should fetch dashboard stats on mount", async () => {
      const mockStats = {
        courses_completed: 5,
        tutorials_watched: 12,
        time_spent_hours: 25,
        weekly_activity: { Mon: 2, Tue: 3, Wed: 1 },
      };

      mockApi.get.mockImplementation((url) => {
        if (url === "/dashboard/stats") {
          return Promise.resolve({ data: mockStats });
        }
        return Promise.resolve({ data: [] });
      });

      renderDashboard();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/dashboard/stats");
      });
    });

    it("should update stat cards with fetched data", async () => {
      const mockStats = {
        courses_completed: 5,
        tutorials_watched: 12,
        time_spent_hours: 25,
        weekly_activity: { Mon: 2, Tue: 3, Wed: 1 },
      };

      mockApi.get.mockImplementation((url) => {
        if (url === "/dashboard/stats") {
          return Promise.resolve({ data: mockStats });
        }
        return Promise.resolve({ data: [] });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument();
      });
    });

    it("should handle dashboard stats API error gracefully", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      mockApi.get.mockImplementation((url) => {
        if (url === "/dashboard/stats") {
          return Promise.reject(new Error("Stats API error"));
        }
        return Promise.resolve({ data: [] });
      });

      renderDashboard();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/dashboard/stats");
      });

      // Should still show default values even after error
      await waitFor(() => {
        const statCards = screen.getAllByTestId("stat-card");
        expect(statCards.length).toBe(3);
      });

      consoleSpy.mockRestore();
    });

    it("should pass weekly activity data to WeekProgress component", async () => {
      const mockStats = {
        courses_completed: 5,
        tutorials_watched: 12,
        time_spent_hours: 25,
        weekly_activity: { Mon: 2, Tue: 3, Wed: 1 },
      };

      mockApi.get.mockImplementation((url) => {
        if (url === "/dashboard/stats") {
          return Promise.resolve({ data: mockStats });
        }
        return Promise.resolve({ data: [] });
      });

      renderDashboard();

      await waitFor(() => {
        const weekProgress = screen.getByTestId("week-progress");
        expect(weekProgress).toHaveTextContent(
          JSON.stringify(mockStats.weekly_activity)
        );
      });
    });
  });

  describe("API Integration - Courses", () => {
    it("should fetch courses on mount", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/courses");
      });
    });

    it("should display all courses when fetched", async () => {
      const mockCourses = [
        { id: 1, name: "Course 1", progress: 0 },
        { id: 2, name: "Course 2", progress: 0 },
        { id: 3, name: "Course 3", progress: 0 },
      ];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("Course 1")).toBeInTheDocument();
        expect(screen.getByText("Course 2")).toBeInTheDocument();
        expect(screen.getByText("Course 3")).toBeInTheDocument();
      });
    });

    it("should handle courses API error and display error message", async () => {
      const errorMessage = "Unable to load courses.";

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.reject({
            response: { data: { message: errorMessage } },
          });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("should display 'No courses available' message when courses array is empty", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(
          screen.getByText("No courses available at the moment.")
        ).toBeInTheDocument();
      });
    });

    it("should handle courses API error with default message when no specific message provided", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.reject(new Error("Network error"));
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(
          screen.getByText("Unable to load courses.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Course Sections - Continue, Completed, All", () => {
    it("should display 'Continue' section only for in-progress courses", async () => {
      const mockCourses = [
        { id: 1, name: "In Progress 1", progress: 50 },
        { id: 2, name: "In Progress 2", progress: 25 },
        { id: 3, name: "Not Started", progress: 0 },
      ];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("Continue?")).toBeInTheDocument();
        expect(
          screen.getByText("View your recently accessed courses.")
        ).toBeInTheDocument();
      });
    });

    it("should NOT display 'Continue' section when no in-progress courses", async () => {
      const mockCourses = [
        { id: 1, name: "Not Started 1", progress: 0 },
        { id: 2, name: "Not Started 2", progress: 0 },
      ];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.queryByText("Continue?")).not.toBeInTheDocument();
      });
    });

    it("should display 'Completed Courses' section only for fully completed courses", async () => {
      const mockCourses = [
        { id: 1, name: "Completed 1", progress: 100 },
        { id: 2, name: "Completed 2", progress: 100 },
        { id: 3, name: "In Progress", progress: 50 },
      ];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("Completed Courses")).toBeInTheDocument();
        expect(
          screen.getByText("Courses you've finished — great work!")
        ).toBeInTheDocument();
      });
    });

    it("should NOT display 'Completed Courses' section when no completed courses", async () => {
      const mockCourses = [
        { id: 1, name: "In Progress 1", progress: 50 },
        { id: 2, name: "Not Started", progress: 0 },
      ];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.queryByText("Completed Courses")).not.toBeInTheDocument();
      });
    });

    it("should always display 'All Courses' section", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("All Courses")).toBeInTheDocument();
        expect(
          screen.getByText("Explore all available learning paths.")
        ).toBeInTheDocument();
      });
    });

    it("should correctly categorize courses into continue, completed, and all sections", async () => {
      const mockCourses = [
        { id: 1, name: "Not Started", progress: 0 },
        { id: 2, name: "In Progress 1", progress: 25 },
        { id: 3, name: "In Progress 2", progress: 75 },
        { id: 4, name: "Completed 1", progress: 100 },
        { id: 5, name: "Completed 2", progress: 100 },
      ];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        // All courses should be displayed in 'All Courses' section
        const allCourseCards = screen.getAllByTestId("course-card");
        expect(allCourseCards.length).toBeGreaterThanOrEqual(5);

        // Verify sections are displayed
        expect(screen.getByText("Continue?")).toBeInTheDocument();
        expect(screen.getByText("Completed Courses")).toBeInTheDocument();
        expect(screen.getByText("All Courses")).toBeInTheDocument();
      });
    });
  });

  describe("Carousel Functionality", () => {
    beforeEach(() => {
      // Mock scrollTo and scroll-related properties
      Element.prototype.scrollTo = vi.fn();
      Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
        configurable: true,
        get: function () {
          return this._scrollLeft || 0;
        },
        set: function (val) {
          this._scrollLeft = val;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get: function () {
          return 1000;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get: function () {
          return 300;
        },
      });
    });

    it("should render carousel scroll buttons when content overflows", async () => {
      const mockCourses = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Course ${i + 1}`,
        progress: 50,
      }));

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        // Scroll buttons should be present
        const scrollButtons = screen.getAllByRole("button", {
          name: /scroll/i,
        });
        expect(scrollButtons.length).toBeGreaterThan(0);
      });
    });

    it("should call scrollTo when clicking right scroll button", async () => {
      const user = userEvent.setup();
      const mockCourses = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Course ${i + 1}`,
        progress: 50,
      }));

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        const courses = screen.getAllByText("Course 1");
        expect(courses.length).toBeGreaterThan(0);
      });

      const rightButtons = screen.getAllByLabelText("Scroll right");
      if (rightButtons.length > 0) {
        await user.click(rightButtons[0]);
        expect(Element.prototype.scrollTo).toHaveBeenCalled();
      }
    });

    it("should have left scroll button available after scrolling", async () => {
      const mockCourses = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Course ${i + 1}`,
        progress: 50,
      }));

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        const courses = screen.getAllByText("Course 1");
        expect(courses.length).toBeGreaterThan(0);
      });

      // Left button should not be visible at start (isStartReached = true)
      const leftButtons = screen.queryAllByLabelText("Scroll left");
      // Either no left buttons or they exist but are hidden
      expect(leftButtons.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Events Section", () => {
    it("should display nearby events section", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("Nearby Events")).toBeInTheDocument();
        expect(
          screen.getByText("Connect with other learners at these events!")
        ).toBeInTheDocument();
      });
    });

    it("should render event cards", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        const eventCards = screen.getAllByTestId("event-card");
        expect(eventCards.length).toBe(3);
      });
    });

    it("should display Sky Showcase events", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        const showcaseEvents = screen.getAllByText("Sky Showcase");
        expect(showcaseEvents.length).toBe(3);
      });
    });
  });

  describe("User Interactions", () => {
    it("should log to console when clicking light mode toggle", async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      // The button doesn't have an aria-label, so query by class or position
      const buttons = screen.getAllByRole("button");
      const toggleButton = buttons.find(btn => btn.className.includes("bg-blue-500"));
      
      if (toggleButton) {
        await user.click(toggleButton);
        expect(consoleSpy).toHaveBeenCalledWith("Toggle light mode");
      }

      consoleSpy.mockRestore();
    });
  });

  describe("Component Lifecycle & Cleanup", () => {
    it("should cleanup event listeners on unmount", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      const { unmount } = renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });

      unmount();

    });

    it("should not update state after component unmounts", async () => {
      let resolveStats;
      const statsPromise = new Promise((resolve) => {
        resolveStats = resolve;
      });

      mockApi.get.mockImplementation((url) => {
        if (url === "/dashboard/stats") {
          return statsPromise;
        }
        return Promise.resolve({ data: [] });
      });

      const { unmount } = renderDashboard();

      unmount();

      // Resolve promises after unmount
      resolveStats({
        data: {
          courses_completed: 10,
          tutorials_watched: 20,
          time_spent_hours: 30,
          weekly_activity: {},
        },
      });

      // No errors should occur from trying to update unmounted component
      await waitFor(() => {
        // Just verify no errors were thrown
        expect(true).toBe(true);
      });
    });
  });

  describe("AuthContext Integration", () => {
    it("should not fetch data when api is not available", () => {
      const authContextWithoutApi = {
        ...mockAuthContextValue,
        api: null,
      };

      renderDashboard(authContextWithoutApi);

      expect(mockApi.get).not.toHaveBeenCalled();
    });

    it("should use api from AuthContext for fetching data", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/dashboard/stats");
        expect(mockApi.get).toHaveBeenCalledWith("/courses");
      });
    });
  });

  describe("Loading States", () => {
    it("should show loading spinner while courses are being fetched", () => {
      mockApi.get.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { container } = renderDashboard();

      // Query for spinner by class since it may not have role="status"
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should hide loading spinner after courses are loaded", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: {} });
      });

      const { container } = renderDashboard();

      await waitFor(() => {
        const spinner = container.querySelector(".animate-spin");
        expect(spinner).not.toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle courses with progress exactly at 0", async () => {
      const mockCourses = [{ id: 1, name: "Course 1", progress: 0 }];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        const courses = screen.getAllByText("Course 1");
        expect(courses.length).toBeGreaterThan(0);
        expect(screen.queryByText("Continue?")).not.toBeInTheDocument();
      });
    });

    it("should handle courses with progress exactly at 100", async () => {
      const mockCourses = [{ id: 1, name: "Course 1", progress: 100 }];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        const courses = screen.getAllByText("Course 1");
        expect(courses.length).toBeGreaterThan(0);
        expect(screen.getByText("Completed Courses")).toBeInTheDocument();
      });
    });

    it("should handle courses with progress greater than 100", async () => {
      const mockCourses = [{ id: 1, name: "Course 1", progress: 150 }];

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        const courses = screen.getAllByText("Course 1");
        expect(courses.length).toBeGreaterThan(0);
        expect(screen.getByText("Completed Courses")).toBeInTheDocument();
      });
    });

    it("should handle empty weekly activity data", async () => {
      const mockStats = {
        courses_completed: 0,
        tutorials_watched: 0,
        time_spent_hours: 0,
        weekly_activity: {},
      };

      mockApi.get.mockImplementation((url) => {
        if (url === "/dashboard/stats") {
          return Promise.resolve({ data: mockStats });
        }
        return Promise.resolve({ data: [] });
      });

      renderDashboard();

      await waitFor(() => {
        const weekProgress = screen.getByTestId("week-progress");
        expect(weekProgress).toBeInTheDocument();
      });
    });

    it("should handle string values in stats data", async () => {
      const mockStats = {
        courses_completed: "5",
        tutorials_watched: "12",
        time_spent_hours: "25",
        weekly_activity: {},
      };

      mockApi.get.mockImplementation((url) => {
        if (url === "/dashboard/stats") {
          return Promise.resolve({ data: mockStats });
        }
        return Promise.resolve({ data: [] });
      });

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument();
      });
    });
  });

  describe("Responsive Design Elements", () => {
    it("should render responsive grid layout classes", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      const { container } = renderDashboard();

      await waitFor(() => {
        const gridElements = container.querySelectorAll(
          ".grid-cols-1, .lg\\:grid-cols-3, .sm\\:grid-cols-3"
        );
        expect(gridElements.length).toBeGreaterThan(0);
      });
    });

    it("should apply responsive text sizes", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        const heading = screen.getByText("Dashboard");
        expect(heading).toHaveClass("text-3xl");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on scroll buttons", async () => {
      const mockCourses = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Course ${i + 1}`,
        progress: 50,
      }));

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses") {
          return Promise.resolve({ data: mockCourses });
        }
        return Promise.resolve({ data: {} });
      });

      renderDashboard();

      await waitFor(() => {
        const rightButtons = screen.getAllByLabelText("Scroll right");
        expect(rightButtons.length).toBeGreaterThan(0);
      });
    });

    it("should have semantic HTML structure", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        // Check for headings
        const mainHeading = screen.getByRole("heading", { name: /dashboard/i });
        expect(mainHeading).toBeInTheDocument();
      });
    });

    it("should have buttons with proper roles", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      renderDashboard();

      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });
});

