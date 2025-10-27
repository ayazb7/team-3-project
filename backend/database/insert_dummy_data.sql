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
INSERT INTO tutorials (id, title, description, video_provider, video_url, category, video_transcript)
VALUES
(
 1,
 'How to Create a Strong Password and Stay Safe Online',
 'Getting started with email has never been easier! In this quick, beginner-friendly guide, you’ll learn how to set up your very first email account, add security details, log in, and send your first message. Perfect for anyone new to email or looking for a simple step-by-step refresher.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb',
 'Cybersecurity',
 LOAD_FILE("./cybersecurity.vtt")
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