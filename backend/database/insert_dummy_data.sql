-- =============================================================
-- SKYWISE DATABASE - DUMMY DATA
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSES
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives)
VALUES
(
  1,
  'Digital Kickstart',
  'Learn the essential digital skills for everyday life — from creating strong passwords to sending professional emails and staying safe online.',
  'Beginner',
  45,
  60,
  'In this beginner-friendly course, you''ll build the foundational skills you need to navigate the digital world confidently. You''ll learn how to create and manage secure passwords, set up and use email effectively, and understand best practices for staying safe online.',
  '[
    "Create strong, memorable passwords using simple techniques",
    "Set up and send professional emails with confidence",
    "Organize and manage your inbox efficiently",
    "Recognize and avoid common online security risks"
  ]'
);

-- =============================================================
--  COURSE REQUIREMENTS (Prerequisites)
-- =============================================================
INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(1, 'Basic computer use (mouse/keyboard)'),
(1, 'Access to an email account'),
(1, 'Internet connection');

-- =============================================================
--  TUTORIALS
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
 1,
 'How to Create a Strong Password and Stay Safe Online',
 'Getting started with email has never been easier! In this quick, beginner-friendly guide, you’ll learn how to set up your very first email account, add security details, log in, and send your first message. Perfect for anyone new to email or looking for a simple step-by-step refresher.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb',
 'Cybersecurity'
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (1, 1);

-- =============================================================
--  QUIZ FOR THE TUTORIAL
-- =============================================================
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (1, 1, 'Strong Passwords & Online Safety Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (1, 1, 'Which of the following is the strongest password?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(1, '123456', FALSE),
(1, 'John2000', FALSE),
(1, 'R!verSun_93!', TRUE),
(1, 'password123', FALSE);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (2, 1, 'What personal information should you avoid using in your password?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(2, 'Your pet’s name or birthday', TRUE),
(2, 'A mix of random letters and numbers', FALSE),
(2, 'Unrelated words and symbols', FALSE),
(2, 'None of the above', FALSE);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (3, 1, 'Why should you keep your apps and software updated?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(3, 'It makes your device run faster', FALSE),
(3, 'Updates fix security weaknesses that hackers could exploit', TRUE),
(3, 'To get new emojis', FALSE),
(3, 'It helps clear old files', FALSE);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (4, 1, 'What’s the safest way to store your passwords?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(4, 'Write them on a sticky note', FALSE),
(4, 'Save them in your phone’s notes app', FALSE),
(4, 'Use a password manager', TRUE),
(4, 'Use the same password for everything', FALSE);

-- Question 5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (5, 1, 'If you get an email with a suspicious link, what should you do?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(5, 'Click it to see what it is', FALSE),
(5, 'Forward it to friends', FALSE),
(5, 'Delete it or report it as phishing', TRUE),
(5, 'Reply asking for details', FALSE);

-- =============================================================
--  COURSE 2: CAREER LAUNCH
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives)
VALUES
(
  2,
  'Career Launch',
  'Get ready to take the first steps toward your professional future with Career Launch! Learn how to create a strong CV and build a professional LinkedIn profile to showcase your skills and experience.',
  'Beginner',
  60,
  75,
  'In this course, you’ll learn how to create a professional CV and LinkedIn profile that highlights your strengths and attracts opportunities. Perfect for anyone beginning their career journey.',
  '[
    "Understand how to build a strong LinkedIn profile",
    "Learn how to write a clear, well-structured CV",
    "Present your skills and experience professionally",
    "Make a great first impression with employers"
  ]'
);

-- Requirements
INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(2, 'Access to the internet'),
(2, 'Basic computer and typing skills');

-- =============================================================
--  TUTORIAL 1: How to use LinkedIn
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  2,
  'How to use LinkedIn?',
  'Learn how to create a strong LinkedIn profile that highlights your skills and connects you with career opportunities. Understand profile photos, headlines, and summaries that attract attention.',
  'synthesia',
  'https://share.synthesia.io/a3ce550d-e67e-4380-8614-4878fa16def1',
  'Professional Networking'
);

-- COURSE-TUTORIAL LINK
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (2, 2);

-- QUIZ: LinkedIn Basics
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (2, 2, 'LinkedIn Profile Basics Quiz');

-- Questions & Options
-- Q1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (6, 2, 'What is the main purpose of having a LinkedIn profile?', 1);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(6, 'To post personal photos and updates', FALSE),
(6, 'To connect with friends for fun', FALSE),
(6, 'To showcase your professional skills and experience', TRUE),
(6, 'To buy and sell items', FALSE);

-- Q2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (7, 2, 'Which of the following should you include in your LinkedIn profile photo?', 2);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(7, 'A group photo with friends', FALSE),
(7, 'A clear, professional-looking image of yourself', TRUE),
(7, 'A photo with filters or effects', FALSE),
(7, 'No photo at all', FALSE);

-- Q3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (8, 2, 'What should your LinkedIn headline focus on?', 3);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(8, 'Your job title and key skills', TRUE),
(8, 'A funny quote or personal motto', FALSE),
(8, 'Your favorite hobbies', FALSE),
(8, 'A list of emojis', FALSE);

-- Q4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (9, 2, 'Why is it important to write a summary on your LinkedIn profile?', 4);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(9, 'It allows you to share personal stories', FALSE),
(9, 'It gives an overview of your professional goals and strengths', TRUE),
(9, 'It helps you connect with more random people', FALSE),
(9, 'It replaces the need for a resume', FALSE);

-- Q5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (10, 2, 'How often should you update your LinkedIn profile?', 5);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(10, 'Only when you create your account', FALSE),
(10, 'Every few years', FALSE),
(10, 'Regularly, whenever you gain new experience or skills', TRUE),
(10, 'Never—it updates automatically', FALSE);

-- =============================================================
--  TUTORIAL 2: Crafting Your First CV
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  3,
  'Crafting Your First CV: A Simple Guide',
  'Learn how to create a professional CV that highlights your education, skills, and experience. Understand structure, formatting, and best practices for presenting yourself to employers.',
  'synthesia',
  'https://share.synthesia.io/4d132ad3-81ac-43d2-96ce-74e7c6e085d1',
  'Career Skills'
);

-- COURSE-TUTORIAL LINK
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (2, 3);

-- QUIZ: CV Creation Basics
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (3, 3, 'CV Writing Essentials Quiz');

-- Questions & Options
-- Q1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (11, 3, 'What is the main purpose of a CV?', 1);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(11, 'To list your hobbies and interests', FALSE),
(11, 'To show your education, skills, and experience to employers', TRUE),
(11, 'To write about your life story', FALSE),
(11, 'To apply for college', FALSE);

-- Q2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (12, 3, 'Which section usually comes first on a CV?', 2);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(12, 'Work experience', FALSE),
(12, 'Skills', FALSE),
(12, 'Contact information', TRUE),
(12, 'References', FALSE);

-- Q3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (13, 3, 'How long should your first CV usually be?', 3);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(13, 'Two to three pages', FALSE),
(13, 'One page', TRUE),
(13, 'Half a page', FALSE),
(13, 'As long as possible', FALSE);

-- Q4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (14, 3, 'Which of the following is the best formatting advice?', 4);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(14, 'Use lots of colors and fancy fonts', FALSE),
(14, 'Keep it simple, clear, and easy to read', TRUE),
(14, 'Write everything in capital letters', FALSE),
(14, 'Add large photos and graphics', FALSE);

-- Q5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (15, 3, 'When saving your CV to send out, which format is best?', 5);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(15, '.docx', FALSE),
(15, '.jpg', FALSE),
(15, '.pdf', TRUE),
(15, '.txt', FALSE);

-- =============================================================
--  TUTORIAL 4: Microsoft Teams for Career Launch
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  4,
  'How to schedule and join a Teams meeting?',
  'Learn how to schedule, join, and manage Microsoft Teams meetings effectively for professional communication.',
  'synthesia',
  'https://share.synthesia.io/1eba2b49-af85-4e94-9bac-644704110b1f',
  'Digital Collaboration'
);

-- Link Tutorial 4 to Career Launch (Course 2)
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (2, 4);

INSERT INTO quizzes (id, tutorial_id, title)
VALUES (4, 4, 'Microsoft Teams Basics Quiz');

-- Questions & Options for Quiz 4
-- Q1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (16, 4, 'How do you join a scheduled Teams meeting?', 1);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(16, 'Go to your email and ignore the invite', FALSE),
(16, 'Click the meeting link in your calendar or invitation', TRUE),
(16, 'Call the organizer directly', FALSE),
(16, 'Wait for someone to add you manually', FALSE);

-- Q2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (17, 4, 'What should you do before joining an important meeting?', 2);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(17, 'Test your microphone and camera', TRUE),
(17, 'Change your profile picture', FALSE),
(17, 'Delete old chat messages', FALSE),
(17, 'Download a new background', FALSE);

-- Q3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (18, 4, 'Where can you see your upcoming Teams meetings?', 3);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(18, 'In the Calendar tab', TRUE),
(18, 'In the Files tab', FALSE),
(18, 'In the Settings menu', FALSE),
(18, 'In the Activity feed only', FALSE);

-- Q4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (19, 4, 'What does the "mute" button do during a meeting?', 4);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(19, 'It turns off your camera', FALSE),
(19, "It silences your microphone so others can't hear you", TRUE),
(19, 'It blocks other participants', FALSE),
(19, 'It ends the meeting', FALSE);

-- Q5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (20, 4, 'How do you schedule a new meeting in Teams?', 5);
INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(20, 'Send an email to all participants', FALSE),
(20, 'Use the Calendar tab and click "New meeting"', TRUE),
(20, 'Post in the general chat', FALSE),
(20, 'Call each person individually', FALSE);

-- =============================================================
--  COURSE 3: Online Shopping Safety
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives)
VALUES
(
  3,
  'Online Shopping Safety',
  'Shop online with confidence! Learn how to identify secure websites, protect your payment information, and avoid common scams.',
  'Beginner',
  35,
  50,
  'This course covers the essentials of safe online shopping, including recognizing secure websites, understanding payment protection, and spotting fraudulent sellers.',
  '[
    "Identify secure shopping websites",
    "Protect your payment information online",
    "Recognize and avoid shopping scams",
    "Understand your rights as an online shopper"
  ]'
);

INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(3, 'Internet access'),
(3, 'Basic web browsing skills');

-- Tutorial 5: Safe Online Shopping
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  5,
  'How to Shop Safely Online',
  'Learn the key steps to protect yourself while shopping online, from checking website security to using secure payment methods.',
  'synthesia',
  'https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb',
  'Digital Safety'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (3, 5);

-- =============================================================
--  COURSE 4: Introduction to Smartphones
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives)
VALUES
(
  4,
  'Introduction to Smartphones',
  'Get comfortable with your smartphone! Learn the basics of navigation, essential apps, and how to stay connected.',
  'Beginner',
  55,
  70,
  'Perfect for beginners, this course teaches you smartphone fundamentals including navigation, app usage, and staying safe on your device.',
  '[
    "Navigate your smartphone with confidence",
    "Understand essential apps and features",
    "Learn to download and manage apps safely",
    "Set up basic security features"
  ]'
);

INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(4, 'A smartphone (Android or iPhone)'),
(4, 'No prior experience needed');

-- Tutorial 6: Getting Started with Your Smartphone
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  6,
  'Smartphone Basics: Navigation and Apps',
  'Learn how to navigate your smartphone, find apps, and use essential features with confidence.',
  'synthesia',
  'https://share.synthesia.io/a3ce550d-e67e-4380-8614-4878fa16def1',
  'Technology Basics'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (4, 6);

-- Tutorial 7: Understanding Smartphone Security
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  7,
  'Keeping Your Smartphone Secure',
  'Set up essential security features on your smartphone including passwords, biometrics, and app permissions.',
  'synthesia',
  'https://share.synthesia.io/4d132ad3-81ac-43d2-96ce-74e7c6e085d1',
  'Device Security'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (4, 7);

-- =============================================================
--  COURSE 5: Digital Wellbeing
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives)
VALUES
(
  5,
  'Digital Wellbeing',
  'Balance your digital life! Learn healthy screen habits, manage notifications, and create a positive relationship with technology.',
  'Beginner',
  40,
  55,
  'Discover practical strategies for managing screen time, reducing digital distractions, and maintaining healthy tech habits.',
  '[
    "Understand healthy screen time habits",
    "Learn to manage notifications effectively",
    "Create boundaries with technology",
    "Practice digital mindfulness"
  ]'
);

INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(5, 'Smartphone or computer'),
(5, 'Willingness to reflect on tech habits');

-- Tutorial 8: Managing Screen Time
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
  8,
  'Healthy Screen Time Management',
  'Learn practical tips for balancing screen time and creating healthy digital habits.',
  'synthesia',
  'https://share.synthesia.io/1eba2b49-af85-4e94-9bac-644704110b1f',
  'Digital Wellness'
);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (5, 8);
