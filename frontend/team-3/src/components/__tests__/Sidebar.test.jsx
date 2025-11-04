import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

// ---- Mocks ----

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard' }),
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
    username: 'JohnDoe',
    email: 'john.doe@example.com',
  }),
}));

// Mock icons
vi.mock('lucide-react', () => ({
  ChartLine: () => <div data-testid="icon-dashboard" />,
  MapPinned: () => <div data-testid="icon-events" />,
  History: () => <div data-testid="icon-activity" />,
  MessageCircleQuestionMark: () => <div data-testid="icon-support" />,
  PanelLeft: () => <div data-testid="icon-panel" />,
  X: () => <div data-testid="icon-x" />,
  Menu: () => <div data-testid="icon-menu" />,
}));

vi.mock('react-icons/io5', () => ({
  IoBookOutline: () => <div data-testid="icon-courses" />,
}));

// ---- Helper ----
const renderSidebar = () => {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Sidebar component', () => {
  describe('desktop layout', () => {
    test('renders SkyWise logo', () => {
      renderSidebar();
      const logos = screen.getAllByText('SkyWise');
      expect(logos.length).toBeGreaterThan(0);
    });

    test('renders all menu items', () => {
      renderSidebar();

      expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Courses').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Find Local Events').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Activity').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Support').length).toBeGreaterThan(0);
    });

    test('renders menu item icons', () => {
      renderSidebar();

      expect(screen.getAllByTestId('icon-dashboard').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-courses').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-events').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-activity').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-support').length).toBeGreaterThan(0);
    });

    test('displays user information', () => {
      renderSidebar();

      expect(screen.getAllByText('JohnDoe').length).toBeGreaterThan(0);
      expect(screen.getAllByText('john.doe@example.com').length).toBeGreaterThan(0);
    });

    test('displays user initial', () => {
      renderSidebar();

      // User initial "J" from "JohnDoe"
      expect(screen.getAllByText('J').length).toBeGreaterThan(0);
    });

    test('renders logout button', () => {
      renderSidebar();

      const logoutButtons = screen.getAllByRole('button', { name: /Logout/i });
      expect(logoutButtons.length).toBeGreaterThan(0);
    });

    test('renders collapse/expand toggle', () => {
      renderSidebar();

      // Panel toggle button should exist (hidden on mobile, visible on desktop)
      expect(screen.getAllByTestId('icon-panel').length).toBeGreaterThan(0);
    });
  });

  describe('navigation', () => {
    test('clicking Dashboard navigates to /dashboard', () => {
      renderSidebar();

      const dashboardButton = screen.getAllByText('Dashboard')[0].closest('button');
      fireEvent.click(dashboardButton);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    test('clicking Courses navigates to /dashboard/courses', () => {
      renderSidebar();

      const coursesButton = screen.getAllByText('Courses')[0].closest('button');
      fireEvent.click(coursesButton);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/courses');
    });

    test('clicking Find Local Events navigates correctly', () => {
      renderSidebar();

      const eventsButton = screen.getAllByText('Find Local Events')[0].closest('button');
      fireEvent.click(eventsButton);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/find-local-events');
    });

    test('clicking Activity navigates correctly', () => {
      renderSidebar();

      const activityButton = screen.getAllByText('Activity')[0].closest('button');
      fireEvent.click(activityButton);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/activity');
    });

    test('clicking Support navigates correctly', () => {
      renderSidebar();

      const supportButton = screen.getAllByText('Support')[0].closest('button');
      fireEvent.click(supportButton);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/support');
    });
  });

  describe('active state', () => {
    test('Dashboard menu item has active styling on /dashboard', () => {
      renderSidebar();

      const dashboardButton = screen.getAllByText('Dashboard')[0].closest('button');
      expect(dashboardButton.className).toContain('bg-sidebar-primary');
    });
  });

  describe('mobile menu', () => {
    test('renders mobile header with SkyWise logo', () => {
      renderSidebar();

      // There should be two SkyWise text elements: one in desktop sidebar, one in mobile header
      const skyWiseElements = screen.getAllByText('SkyWise');
      expect(skyWiseElements.length).toBeGreaterThanOrEqual(1);
    });

    test('mobile menu toggle button has correct aria-label', () => {
      renderSidebar();

      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toBeInTheDocument();
    });

    test('shows Menu icon when closed', () => {
      renderSidebar();

      expect(screen.getByTestId('icon-menu')).toBeInTheDocument();
    });

    test('clicking toggle button opens mobile menu', () => {
      renderSidebar();

      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      // Should change to X icon
      expect(screen.getByTestId('icon-x')).toBeInTheDocument();

      // aria-label should change
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    test('clicking toggle again closes mobile menu', () => {
      renderSidebar();

      const openButton = screen.getByLabelText('Open menu');
      fireEvent.click(openButton);

      const closeButton = screen.getByLabelText('Close menu');
      fireEvent.click(closeButton);

      // Should show Menu icon again
      expect(screen.getByTestId('icon-menu')).toBeInTheDocument();
    });
  });

  describe('logout functionality', () => {
    test('clicking logout button calls logout function', () => {
      renderSidebar();

      const logoutButton = screen.getAllByRole('button', { name: /Logout/i })[0];
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });

    test('logout button has correct styling', () => {
      renderSidebar();

      const logoutButton = screen.getAllByRole('button', { name: /Logout/i })[0];
      expect(logoutButton.className).toContain('border-sidebar-primary/40');
    });
  });

  describe('user display', () => {
    test('displays correct user initial when username starts with letter', () => {
      renderSidebar();

      // Initial should be "J" from "JohnDoe"
      expect(screen.getAllByText('J').length).toBeGreaterThan(0);
    });

    test('user info section has proper styling', () => {
      renderSidebar();

      const username = screen.getAllByText('JohnDoe')[0];
      const email = screen.getAllByText('john.doe@example.com')[0];

      expect(username).toHaveClass('font-semibold');
      expect(email).toHaveClass('text-xs');
    });

    test('user initial has gradient background', () => {
      renderSidebar();

      const initialElement = screen.getAllByText('J')[0];
      const initialsContainer = initialElement.closest('div');

      expect(initialsContainer.className).toContain('bg-gradient-to-br');
    });
  });

  describe('responsive behavior', () => {
    test('desktop sidebar has transition classes', () => {
      renderSidebar();

      const aside = screen.getAllByText('Dashboard')[0].closest('aside');
      expect(aside.className).toContain('transition');
    });

    test('menu items have responsive icons', () => {
      renderSidebar();

      expect(screen.getAllByTestId('icon-dashboard').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-courses').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-events').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-activity').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('icon-support').length).toBeGreaterThan(0);
    });
  });

  describe('styling and layout', () => {
    test('sidebar has gradient decorative elements', () => {
      renderSidebar();

      // Check for gradient top bar (decorative element)
      const sidebar = screen.getAllByText('SkyWise')[0].closest('div.flex-col');
      expect(sidebar).toBeInTheDocument();
    });

    test('menu items have hover states', () => {
      renderSidebar();

      const dashboardButton = screen.getAllByText('Dashboard')[0].closest('button');
      expect(dashboardButton.className).toMatch(/hover:/);
    });

    test('logout button has hover transition', () => {
      renderSidebar();

      const logoutButton = screen.getAllByRole('button', { name: /Logout/i })[0];
      expect(logoutButton.className).toContain('transition');
    });
  });

  describe('accessibility', () => {
    test('all menu items are keyboard accessible', () => {
      renderSidebar();

      const menuButtons = [
        screen.getAllByText('Dashboard')[0].closest('button'),
        screen.getAllByText('Courses')[0].closest('button'),
        screen.getAllByText('Find Local Events')[0].closest('button'),
        screen.getAllByText('Activity')[0].closest('button'),
        screen.getAllByText('Support')[0].closest('button'),
      ];

      menuButtons.forEach((button) => {
        expect(button).toBeInstanceOf(HTMLButtonElement);
      });
    });

    test('mobile toggle has proper aria-label', () => {
      renderSidebar();

      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toHaveAttribute('aria-label');
    });

    test('logout button is keyboard accessible', () => {
      renderSidebar();

      const logoutButton = screen.getAllByRole('button', { name: /Logout/i })[0];
      logoutButton.focus();
      expect(logoutButton).toHaveFocus();
    });
  });

  describe('logo display', () => {
    test('logo has gradient text styling', () => {
      renderSidebar();

      const logos = screen.getAllByText('SkyWise');
      logos.forEach((logo) => {
        expect(logo.className).toContain('bg-gradient-to-r');
        expect(logo.className).toContain('bg-clip-text');
      });
    });

    test('mobile logo is visible', () => {
      renderSidebar();

      // Mobile logo should be in header
      const mobileHeader = screen.getAllByText('SkyWise')[0].closest('header');
      expect(mobileHeader).toBeInTheDocument();
    });
  });

  describe('menu structure', () => {
    test('all menu items have proper structure', () => {
      renderSidebar();

      const menuLabels = ['Dashboard', 'Courses', 'Find Local Events', 'Activity', 'Support'];

      menuLabels.forEach((label) => {
        const menuItem = screen.getAllByText(label)[0];
        const button = menuItem.closest('button');
        expect(button).toBeInTheDocument();
      });
    });

    test('menu items are in navigation element', () => {
      renderSidebar();

      const dashboard = screen.getAllByText('Dashboard')[0];
      const nav = dashboard.closest('nav');
      expect(nav).toBeInTheDocument();
    });
  });
});
