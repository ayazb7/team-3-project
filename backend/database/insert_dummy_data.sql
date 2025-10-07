-- =============================================================
--  SKYWISE DATABASE - DUMMY DATA
--  Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  USERS
-- =============================================================
INSERT INTO users (username, email, password_hash, language_preference)
VALUES
('John Doe', 'john@email.com', 'hashed_pw_123', 'English'),
('Jane Smith', 'jane@email.co.uk', 'hashed_pw_456', 'English');

-- =============================================================
--  COURSES
-- =============================================================
INSERT INTO courses (name, description, course_type)
VALUES
('Cybersecurity Basics',
 'Learn the essentials of online safety — from creating strong passwords to recognising phishing attempts.',
 'Beginner');

-- =============================================================
--  TUTORIALS
-- =============================================================
INSERT INTO tutorials (title, description, video_provider, video_url, category)
VALUES
(
 'How to Create a Strong Password and Stay Safe Online',
 'A short interactive video teaching the principles of password security, including common mistakes and best practices.',
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
INSERT INTO quizzes (tutorial_id, title)
VALUES (1, 'Strong Passwords & Online Safety Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (quiz_id, question_text, question_order)
VALUES (1, 'Which of the following is the strongest password?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(1, '123456', FALSE),
(1, 'John2000', FALSE),
(1, 'R!verSun_93!', TRUE),
(1, 'password123', FALSE);

-- Question 2
INSERT INTO quiz_questions (quiz_id, question_text, question_order)
VALUES (1, 'What’s the best way to check if a website is safe before logging in?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(2, 'Make sure it starts with https:// and shows a padlock icon 🔒', TRUE),
(2, 'See if the colors look professional', FALSE),
(2, 'Ask a friend if they’ve used it', FALSE),
(2, 'Click the link to test it', FALSE);

-- Question 3
INSERT INTO quiz_questions (quiz_id, question_text, question_order)
VALUES (1, 'Why should you keep your apps and software updated?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(3, 'It makes your device run faster', FALSE),
(3, 'Updates fix security weaknesses that hackers could exploit', TRUE),
(3, 'To get new emojis', FALSE),
(3, 'It helps clear old files', FALSE);

-- Question 4
INSERT INTO quiz_questions (quiz_id, question_text, question_order)
VALUES (1, 'What’s the safest way to store your passwords?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(4, 'Write them on a sticky note', FALSE),
(4, 'Save them in your phone’s notes app', FALSE),
(4, 'Use a password manager', TRUE),
(4, 'Use the same password for everything', FALSE);

-- Question 5
INSERT INTO quiz_questions (quiz_id, question_text, question_order)
VALUES (1, 'If you get an email with a suspicious link, what should you do?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(5, 'Click it to see what it is', FALSE),
(5, 'Forward it to friends', FALSE),
(5, 'Delete it or report it as phishing', TRUE),
(5, 'Reply asking for details', FALSE);

