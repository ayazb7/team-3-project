-- =============================================================
-- SKYWISE DATABASE - EVERYDAY COMPUTING COURSE
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSE DETAILS - EVERYDAY COMPUTING
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
  6,
  'Everyday Computing',
  'Get comfortable using a computer — learn the essentials to navigate, create, and stay organized digitally.',
  'Beginner',
  45,
  60,
  'This course introduces you to the fundamentals of computer use. You''ll learn how to start and shut down your device properly, manage files and folders, use a web browser, and understand basic programs like word processors and spreadsheets. Perfect for anyone new to computers or returning after a long time away.',
  '[
    "Learn to navigate your computer and desktop confidently",
    "Understand files, folders, and basic organization",
    "Explore key applications like browsers and word processors",
    "Practice saving, opening, and managing digital documents"
  ]',
  'https://static1.michael84.co.uk/wp-content/uploads/bloggers-mac-or-pc-1080x720.jpg'
);

-- =============================================================
--  COURSE PREREQUISITES
-- =============================================================

-- =============================================================
--  COURSE REQUIREMENTS
-- =============================================================
INSERT INTO course_requirements (id, course_id, requirement_text)
VALUES
(11, 6, 'Access to a computer or laptop'),
(12, 6, 'Basic typing and mouse skills');

-- =============================================================
--  TUTORIAL 1: WINDOWS BASICS
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  10,
  'Windows Basics: Getting Started with the Desktop',
  'Learn the fundamentals of using a Windows computer, from navigating the desktop and Start menu to managing windows, using the taskbar, and organizing files. This tutorial covers essential skills like opening programs, switching between applications, and understanding basic file management to help you feel confident using your Windows PC.',
  'youtube',
  'https://www.youtube.com/embed/GDKIxBr6yhI?si=4gZdskges6mjC3K-',
  'Computer Basics'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (6, 10);

-- =============================================================
--  TUTORIAL 2: MAC BASICS
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  11,
  'Mac Basics: Mac Tutorial for Beginners',
  'Get started with your Mac computer by learning the basics of the macOS interface, Dock, Finder, and essential applications. This tutorial walks you through navigating the desktop, managing files and folders, using Spotlight search, and understanding Mac-specific features that make everyday computing easier and more intuitive.',
  'youtube',
  'https://www.youtube.com/embed/Ag3NWYr5CD8?si=sCmfygndDv84ytrw',
  'Computer Basics'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (6, 11);

