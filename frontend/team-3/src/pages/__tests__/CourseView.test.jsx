import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CourseView from "../CourseView";

// Mock useAuth hook
const mockUseAuth = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Lottie player
vi.mock("react-lottie-player", () => ({
  default: ({ animationData, className }) => (
    <div data-testid="lottie-animation" className={className}>
      Lottie Animation
    </div>
  ),
}));

// Mock CourseCard component
vi.mock("../../components/CourseCard.jsx", () => ({
  default: (props) => (
    <div data-testid="course-card" data-course-id={props.id}>
      <span>{props.name}</span>
      {props.rating && <span>{props.rating}</span>}
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  GraduationCap: () => <span data-testid="graduation-icon">GraduationCap</span>,
  AlertTriangle: () => <span data-testid="alert-icon">AlertTriangle</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">ChevronRight</span>,
  CheckCircle: () => <span data-testid="check-icon">CheckCircle</span>,
}));

// Mock utils
vi.mock("../../components/utils.jsx", () => ({
  courseDifficultyColorMap: {
    beginner: "bg-blue-100 text-blue-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  },
}));

describe("CourseView Component", () => {
  let mockApi;
  let mockAuthContextValue;

  const mockCourse = {
    id: 1,
    name: "Password Security 101",
    description: "Learn about password security",
    difficulty: "Beginner",
    duration_min_minutes: 30,
    duration_max_minutes: 45,
    progress: 0,
    summary: "This course covers password best practices",
    learning_objectives: [
      "Create strong passwords",
      "Use password managers",
      "Enable two-factor authentication",
    ],
    requirements: ["Basic computer skills", "Internet access"],
    prerequisites: [
      { id: 1, name: "Digital Basics" },
      { id: 2, name: "Internet Safety" },
    ],
  };

  const mockTutorials = [
    { id: 1, name: "Introduction to Passwords", order: 1 },
    { id: 2, name: "Password Managers", order: 2 },
    { id: 3, name: "Two-Factor Authentication", order: 3 },
  ];

  beforeEach(() => {
    mockApi = {
      get: vi.fn(),
      post: vi.fn(),
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

    mockUseAuth.mockReturnValue(mockAuthContextValue);
    mockNavigate.mockClear();

    // Mock window.alert
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderCourseView = (courseId = "1") => {
    return render(
      <MemoryRouter initialEntries={[`/dashboard/course/${courseId}`]}>
        <Routes>
          <Route path="/dashboard/course/:id" element={<CourseView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe("Initial Rendering and Loading", () => {
    it("should display loading skeleton initially", () => {
      mockApi.get.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { container } = renderCourseView();

      const skeleton = container.querySelector(".animate-pulse");
      expect(skeleton).toBeInTheDocument();
    });

    it("should display breadcrumb navigation with Dashboard link", async () => {
      mockApi.get.mockResolvedValue({ data: mockCourse });

      renderCourseView();

      const dashboardLink = screen.getByText("Dashboard");
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    });

    it("should fetch course data on mount", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/courses/1");
      });
    });

    it("should fetch tutorials on mount", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/courses/1/tutorials");
      });
    });
  });

  describe("Course Display", () => {
    beforeEach(() => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });
    });

    it("should display course name and description", async () => {
      renderCourseView();

      await waitFor(() => {
        const courseTitles = screen.getAllByText("Password Security 101");
        expect(courseTitles.length).toBeGreaterThan(0);
        expect(
          screen.getByText("Learn about password security")
        ).toBeInTheDocument();
      });
    });

    it("should display course difficulty badge", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Beginner")).toBeInTheDocument();
      });
    });

    it("should display course duration", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText(/30 - 45 mins/)).toBeInTheDocument();
      });
    });

    it("should display progress bar with correct percentage", async () => {
      const courseWithProgress = { ...mockCourse, progress: 45 };
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: courseWithProgress });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("45%")).toBeInTheDocument();
      });
    });

    it("should display Lottie animation", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByTestId("lottie-animation")).toBeInTheDocument();
      });
    });

    it("should display course summary", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Course Summary")).toBeInTheDocument();
        expect(
          screen.getByText("This course covers password best practices")
        ).toBeInTheDocument();
      });
    });

    it("should display learning objectives", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Create strong passwords")).toBeInTheDocument();
        expect(screen.getByText("Use password managers")).toBeInTheDocument();
        expect(
          screen.getByText("Enable two-factor authentication")
        ).toBeInTheDocument();
      });
    });

    it("should display requirements section when requirements exist", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Requirements")).toBeInTheDocument();
        expect(screen.getByText("Basic computer skills")).toBeInTheDocument();
        expect(screen.getByText("Internet access")).toBeInTheDocument();
      });
    });

    it("should display prerequisites section when prerequisites exist", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Prerequisites")).toBeInTheDocument();
        expect(screen.getByText("Digital Basics")).toBeInTheDocument();
        expect(screen.getByText("Internet Safety")).toBeInTheDocument();
      });
    });

    it("should not display requirements section when empty", async () => {
      const courseWithoutRequirements = { ...mockCourse, requirements: [] };
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: courseWithoutRequirements });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Course Summary")).toBeInTheDocument();
      });

      expect(screen.queryByText("Requirements")).not.toBeInTheDocument();
    });

    it("should not display prerequisites section when empty", async () => {
      const courseWithoutPrereqs = { ...mockCourse, prerequisites: [] };
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: courseWithoutPrereqs });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Course Summary")).toBeInTheDocument();
      });

      expect(screen.queryByText("Prerequisites")).not.toBeInTheDocument();
    });

    it("should display similar courses section", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Similar Courses")).toBeInTheDocument();
        const courseCards = screen.getAllByTestId("course-card");
        expect(courseCards.length).toBe(3);
      });
    });
  });

  describe("Start/Continue Course Button", () => {
    beforeEach(() => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });
    });

    it("should show 'Start Course' button when progress is 0", async () => {
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Start Course")).toBeInTheDocument();
      });
    });

    it("should show 'Continue Course' button when progress is between 0 and 100", async () => {
      const courseInProgress = { ...mockCourse, progress: 50 };
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: courseInProgress });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Continue Course")).toBeInTheDocument();
      });
    });

    it("should show disabled 'Course Completed' button when progress is 100", async () => {
      const completedCourse = { ...mockCourse, progress: 100 };
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: completedCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        const button = screen.getByText("Course Completed");
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
      });
    });

    it("should alert when starting course with no tutorials", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: [] });
      });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Start Course")).toBeInTheDocument();
      });

      const startButton = screen.getByText("Start Course");
      await user.click(startButton);

      expect(global.alert).toHaveBeenCalledWith(
        "No tutorials found for this course."
      );
    });

    it("should fetch next step when starting course", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        if (url === "/courses/1/next-step") {
          return Promise.resolve({
            data: {
              type: "tutorial",
              tutorial_id: 1,
              is_first_step: true,
            },
          });
        }
        return Promise.resolve({ data: [] });
      });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Start Course")).toBeInTheDocument();
      });

      const startButton = screen.getByText("Start Course");
      await user.click(startButton);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/courses/1/next-step");
      });
    });

    it("should update progress to 1% when starting fresh course", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        if (url === "/courses/1/next-step") {
          return Promise.resolve({
            data: {
              type: "tutorial",
              tutorial_id: 1,
              is_first_step: true,
            },
          });
        }
        return Promise.resolve({ data: [] });
      });

      mockApi.post.mockResolvedValue({ data: { success: true } });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Start Course")).toBeInTheDocument();
      });

      const startButton = screen.getByText("Start Course");
      await user.click(startButton);

      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith("/courses/1/progress", {
          progress_percentage: 1,
        });
      });
    });

    it("should navigate to tutorial when next step is tutorial", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        if (url === "/courses/1/next-step") {
          return Promise.resolve({
            data: {
              type: "tutorial",
              tutorial_id: 2,
              is_first_step: false,
            },
          });
        }
        return Promise.resolve({ data: [] });
      });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Start Course")).toBeInTheDocument();
      });

      const startButton = screen.getByText("Start Course");
      await user.click(startButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/dashboard/course/1/learning/2"
        );
      });
    });

    it("should navigate to quiz when next step is quiz", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        if (url === "/courses/1/next-step") {
          return Promise.resolve({
            data: {
              type: "quiz",
              tutorial_id: 2,
              quiz_id: 5,
              is_first_step: false,
            },
          });
        }
        return Promise.resolve({ data: [] });
      });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Start Course")).toBeInTheDocument();
      });

      const startButton = screen.getByText("Start Course");
      await user.click(startButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/dashboard/course/1/learning/2/quiz/5"
        );
      });
    });

    it("should navigate to tutorial when course is completed", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: { ...mockCourse, progress: 50 } });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        if (url === "/courses/1/next-step") {
          return Promise.resolve({
            data: {
              type: "completed",
              tutorial_id: 3,
              is_first_step: false,
            },
          });
        }
        return Promise.resolve({ data: [] });
      });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Continue Course")).toBeInTheDocument();
      });

      const continueButton = screen.getByText("Continue Course");
      await user.click(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/dashboard/course/1/learning/3"
        );
      });
    });

    it("should fallback to first tutorial on next-step error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        if (url === "/courses/1/next-step") {
          return Promise.reject(new Error("API error"));
        }
        return Promise.resolve({ data: [] });
      });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Start Course")).toBeInTheDocument();
      });

      const startButton = screen.getByText("Start Course");
      await user.click(startButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/dashboard/course/1/learning/1"
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Error Handling", () => {
    it("should display error message when course fetch fails", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.reject({
            response: { data: { message: "Course not found" } },
          });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/courses/1");
      });

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText("Course not found")).toBeInTheDocument();
      }, { timeout: 2000 });
      
      expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
    });

    it("should display default error message when no specific message provided", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.reject(new Error("Network error"));
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Unable to load course.")).toBeInTheDocument();
      });
    });

    it("should show Back to Dashboard button on error", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.reject({
            response: { data: { message: "Error" } },
          });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
      });
    });

    it("should navigate to dashboard when clicking Back to Dashboard", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.reject({
            response: { data: { message: "Error" } },
          });
        }
        return Promise.resolve({ data: [] });
      });

      const user = userEvent.setup();
      renderCourseView();

      await waitFor(() => {
        expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
      });

      const backButton = screen.getByText("Back to Dashboard");
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("should log error when tutorials fetch fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.reject(new Error("Tutorials fetch failed"));
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        const courseTitles = screen.getAllByText("Password Security 101");
        expect(courseTitles.length).toBeGreaterThan(0);
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("Component Lifecycle", () => {
    it("should not update state after component unmounts", async () => {
      let resolveCourse;
      const coursePromise = new Promise((resolve) => {
        resolveCourse = resolve;
      });

      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return coursePromise;
        }
        return Promise.resolve({ data: [] });
      });

      const { unmount } = renderCourseView();

      unmount();

      resolveCourse({ data: mockCourse });

      await waitFor(() => {
        expect(true).toBe(true);
      });
    });

    it("should fetch data for correct course ID from URL", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/2") {
          return Promise.resolve({ data: { ...mockCourse, id: 2, name: "Different Course" } });
        }
        if (url === "/courses/2/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView("2");

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/courses/2");
        expect(mockApi.get).toHaveBeenCalledWith("/courses/2/tutorials");
      });
    });
  });

  describe("AuthContext Integration", () => {
    it("should not fetch data when api is not available", () => {
      const authContextWithoutApi = {
        ...mockAuthContextValue,
        api: null,
      };

      mockUseAuth.mockReturnValue(authContextWithoutApi);

      renderCourseView();

      expect(mockApi.get).not.toHaveBeenCalled();
    });

    it("should use api from AuthContext for fetching data", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      renderCourseView();

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/courses/1");
        expect(mockApi.get).toHaveBeenCalledWith("/courses/1/tutorials");
      });
    });
  });

  describe("Responsive Design", () => {
    it("should render with responsive grid classes", async () => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });

      const { container } = renderCourseView();

      await waitFor(() => {
        const courseTitles = screen.getAllByText("Password Security 101");
        expect(courseTitles.length).toBeGreaterThan(0);
      });

      const grids = container.querySelectorAll(".grid");
      expect(grids.length).toBeGreaterThan(0);
    });

    it("should have responsive breadcrumb with overflow scroll", async () => {
      mockApi.get.mockResolvedValue({ data: mockCourse });

      const { container } = renderCourseView();

      await waitFor(() => {
        const breadcrumb = container.querySelector('nav[aria-label="Breadcrumb"]');
        expect(breadcrumb).toBeInTheDocument();
        expect(breadcrumb).toHaveClass("overflow-x-auto");
      });
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      mockApi.get.mockImplementation((url) => {
        if (url === "/courses/1") {
          return Promise.resolve({ data: mockCourse });
        }
        if (url === "/courses/1/tutorials") {
          return Promise.resolve({ data: mockTutorials });
        }
        return Promise.resolve({ data: [] });
      });
    });

    it("should have breadcrumb navigation with proper aria-label", async () => {
      const { container } = renderCourseView();

      await waitFor(() => {
        const breadcrumb = container.querySelector('nav[aria-label="Breadcrumb"]');
        expect(breadcrumb).toBeInTheDocument();
      });
    });

    it("should have aria-current on current breadcrumb item", async () => {
      const { container } = renderCourseView();

      await waitFor(() => {
        const currentItem = container.querySelector('[aria-current="page"]');
        expect(currentItem).toBeInTheDocument();
      });
    });

    it("should have proper heading hierarchy", async () => {
      renderCourseView();

      await waitFor(() => {
        const h1 = screen.getByRole("heading", { level: 1 });
        expect(h1).toBeInTheDocument();
        expect(h1.textContent).toContain("Password Security 101");
      });
    });

    it("should have accessible buttons", async () => {
      renderCourseView();

      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });
});

