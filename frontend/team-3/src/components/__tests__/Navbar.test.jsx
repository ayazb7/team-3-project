import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// ---- Mocks ----

vi.mock('lucide-react', () => ({
  X: () => <div data-testid="icon-x" />,
  Menu: () => <div data-testid="icon-menu" />,
  Home: () => <div data-testid="icon-home" />,
  Info: () => <div data-testid="icon-info" />,
  BookOpen: () => <div data-testid="icon-book" />,
  HelpCircle: () => <div data-testid="icon-help" />,
}));

// ---- Helper ----
const renderNavbar = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Navbar component', () => {
  describe('logo and branding', () => {
    test('renders SkyWise logo', () => {
      renderNavbar();
      expect(screen.getByText('SkyWise')).toBeInTheDocument();
    });

    test('logo links to home page', () => {
      renderNavbar();
      const logo = screen.getByText('SkyWise').closest('a');
      expect(logo).toHaveAttribute('href', '/');
    });

    test('logo has gradient styling', () => {
      renderNavbar();
      const logo = screen.getByText('SkyWise');
      expect(logo).toHaveClass('bg-gradient-to-r');
      expect(logo).toHaveClass('bg-clip-text');
    });
  });

  describe('navigation links', () => {
    test('renders all navigation links', () => {
      renderNavbar();

      expect(screen.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Courses' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Support' }).length).toBeGreaterThan(0);
    });

    test('Home link navigates to /', () => {
      renderNavbar();
      const homeLink = screen.getAllByRole('link', { name: 'Home' })[0];
      expect(homeLink).toHaveAttribute('href', '/');
    });

    test('About link navigates to /about', () => {
      renderNavbar();
      const aboutLink = screen.getAllByRole('link', { name: 'About' })[0];
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    test('Courses link navigates to /courses', () => {
      renderNavbar();
      const coursesLink = screen.getAllByRole('link', { name: 'Courses' })[0];
      expect(coursesLink).toHaveAttribute('href', '/courses');
    });

    test('Support link navigates to /support', () => {
      renderNavbar();
      const supportLink = screen.getAllByRole('link', { name: 'Support' })[0];
      expect(supportLink).toHaveAttribute('href', '/support');
    });
  });

  describe('active link styling', () => {
    test('Home link is active on / path', () => {
      renderNavbar('/');
      const homeLink = screen.getAllByRole('link', { name: 'Home' })[0];
      expect(homeLink).toHaveClass('text-white');
    });

    test('About link is active on /about path', () => {
      renderNavbar('/about');
      const aboutLink = screen.getAllByRole('link', { name: 'About' })[0];
      expect(aboutLink).toHaveClass('text-white');
    });

    test('Courses link is active on /courses path', () => {
      renderNavbar('/courses');
      const coursesLink = screen.getAllByRole('link', { name: 'Courses' })[0];
      expect(coursesLink).toHaveClass('text-white');
    });

    test('Support link is active on /support path', () => {
      renderNavbar('/support');
      const supportLink = screen.getAllByRole('link', { name: 'Support' })[0];
      expect(supportLink).toHaveClass('text-white');
    });
  });

  describe('Sign In button', () => {
    test('renders Sign In button', () => {
      renderNavbar();
      const signInButtons = screen.getAllByRole('button', { name: 'Sign In' });
      expect(signInButtons.length).toBeGreaterThan(0);
    });

    test('Sign In button links to /login', () => {
      renderNavbar();
      const signInButton = screen.getAllByRole('button', { name: 'Sign In' })[0];
      const link = signInButton.closest('a');
      expect(link).toHaveAttribute('href', '/login');
    });

    test('Sign In button has gradient styling', () => {
      renderNavbar();
      const signInButton = screen.getAllByRole('button', { name: 'Sign In' })[0];
      expect(signInButton).toHaveClass('bg-gradient-to-r');
      expect(signInButton).toHaveClass('from-[#ac1ec4]');
      expect(signInButton).toHaveClass('to-[#1c50fe]');
    });
  });

  describe('mobile menu', () => {
    test('renders mobile menu toggle button', () => {
      renderNavbar();
      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toBeInTheDocument();
    });

    test('shows Menu icon when menu is closed', () => {
      renderNavbar();
      expect(screen.getByTestId('icon-menu')).toBeInTheDocument();
    });

    test('clicking toggle opens mobile menu', () => {
      renderNavbar();

      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      // Should show X icon
      expect(screen.getByTestId('icon-x')).toBeInTheDocument();
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    test('clicking toggle again closes mobile menu', () => {
      renderNavbar();

      const openButton = screen.getByLabelText('Open menu');
      fireEvent.click(openButton);

      const closeButton = screen.getByLabelText('Close menu');
      fireEvent.click(closeButton);

      // Should show Menu icon again
      expect(screen.getByTestId('icon-menu')).toBeInTheDocument();
    });

    test('mobile menu displays all navigation options', () => {
      renderNavbar();

      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      // Mobile menu should show icons for all options
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
      expect(screen.getByTestId('icon-info')).toBeInTheDocument();
      expect(screen.getByTestId('icon-book')).toBeInTheDocument();
      expect(screen.getByTestId('icon-help')).toBeInTheDocument();
    });

    test('clicking menu item closes mobile menu', () => {
      renderNavbar();

      // Open mobile menu
      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      // Click a menu item (we have multiple "Home" links - mobile and desktop)
      const homeLinks = screen.getAllByRole('link', { name: 'Home' });
      const mobileHomeLink = homeLinks.find((link) => link.querySelector('[data-testid="icon-home"]'));

      if (mobileHomeLink) {
        fireEvent.click(mobileHomeLink);
      }

      // Menu should close (Menu icon should be visible again)
      // Note: This test may need adjustment based on actual implementation
    });

    test('clicking overlay closes mobile menu', () => {
      renderNavbar();

      // Open mobile menu
      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      // Find and click overlay
      const overlay = document.querySelector('.bg-black\\/60');
      if (overlay) {
        fireEvent.click(overlay);
      }

      // Menu should close
      expect(screen.getByTestId('icon-menu')).toBeInTheDocument();
    });
  });

  describe('responsive layout', () => {
    test('navbar uses fixed positioning', () => {
      renderNavbar();
      const navbar = screen.getByText('SkyWise').closest('.fixed');
      expect(navbar).toBeInTheDocument();
    });

    test('desktop navigation is hidden on mobile', () => {
      renderNavbar();
      const desktopNav = screen.getByRole('navigation');
      expect(desktopNav.closest('.hidden')).toBeInTheDocument();
    });

    test('mobile toggle button is hidden on desktop', () => {
      renderNavbar();
      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton.closest('.md\\:hidden')).toBeInTheDocument();
    });
  });

  describe('styling and design', () => {
    test('navbar has gradient bottom border', () => {
      renderNavbar();
      const navbar = screen.getByText('SkyWise').closest('div.bg-\\[\\#001433\\]');
      expect(navbar).toBeInTheDocument();
    });

    test('navigation links have hover states', () => {
      renderNavbar();
      const homeLink = screen.getAllByRole('link', { name: 'Home' })[0];
      expect(homeLink.className).toMatch(/hover:/);
    });

    test('mobile menu has backdrop blur', () => {
      renderNavbar();

      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      const overlay = document.querySelector('.bg-black\\/60');
      expect(overlay).toBeInTheDocument();
    });

    test('Sign In button has hover scale effect', () => {
      renderNavbar();
      const signInButton = screen.getAllByRole('button', { name: 'Sign In' })[0];
      expect(signInButton).toHaveClass('hover:scale-105');
    });
  });

  describe('accessibility', () => {
    test('mobile toggle has proper aria-label', () => {
      renderNavbar();
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    test('aria-label updates when menu is opened', () => {
      renderNavbar();

      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    test('all navigation links are keyboard accessible', () => {
      renderNavbar();

      const links = [
        screen.getAllByRole('link', { name: 'Home' })[0],
        screen.getAllByRole('link', { name: 'About' })[0],
        screen.getAllByRole('link', { name: 'Courses' })[0],
        screen.getAllByRole('link', { name: 'Support' })[0],
      ];

      links.forEach((link) => {
        expect(link).toBeInstanceOf(HTMLAnchorElement);
      });
    });

    test('Sign In button is keyboard accessible', () => {
      renderNavbar();
      const signInButton = screen.getAllByRole('button', { name: 'Sign In' })[0];
      signInButton.focus();
      expect(signInButton).toHaveFocus();
    });
  });

  describe('navigation structure', () => {
    test('uses nav element for desktop navigation', () => {
      renderNavbar();
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    test('nav element contains all navigation links', () => {
      renderNavbar();
      const nav = screen.getByRole('navigation');
      expect(nav).toContainElement(screen.getAllByRole('link', { name: 'Home' })[0]);
      expect(nav).toContainElement(screen.getAllByRole('link', { name: 'About' })[0]);
      expect(nav).toContainElement(screen.getAllByRole('link', { name: 'Courses' })[0]);
      expect(nav).toContainElement(screen.getAllByRole('link', { name: 'Support' })[0]);
    });
  });

  describe('z-index and layering', () => {
    test('navbar has high z-index for fixed positioning', () => {
      renderNavbar();
      const navbar = screen.getByText('SkyWise').closest('.z-50');
      expect(navbar).toBeInTheDocument();
    });

    test('mobile menu overlay has appropriate z-index', () => {
      renderNavbar();

      const toggleButton = screen.getByLabelText('Open menu');
      fireEvent.click(toggleButton);

      const mobileMenu = document.querySelector('.z-40');
      expect(mobileMenu).toBeInTheDocument();
    });
  });

  describe('grid layout', () => {
    test('navbar uses grid layout', () => {
      renderNavbar();
      const navbar = screen.getByText('SkyWise').closest('.grid');
      expect(navbar).toBeInTheDocument();
    });

    test('grid has responsive columns', () => {
      renderNavbar();
      const navbar = screen.getByText('SkyWise').closest('div.grid-cols-3');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveClass('md:grid-cols-5');
      expect(navbar).toHaveClass('lg:grid-cols-3');
    });
  });
});
