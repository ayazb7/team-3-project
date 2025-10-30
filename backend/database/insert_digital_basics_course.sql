-- =============================================================
-- SKYWISE DATABASE - DIGITAL BASICS COURSE
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSE DETAILS
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
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
  ]',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&q=80'
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
--  PASSWORD TUTORIAL
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
 1,
 'How to Create a Strong Password and Stay Safe Online',
 'In this video, you’ll learn how to create strong, memorable passwords that help keep your online accounts secure. You’ll discover simple techniques for building passwords that are hard to guess but easy to remember, as well as tips for managing them safely using a password manager. By the end, you’ll understand how to protect your personal information and stay safer online.',
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
(2, 'None of these options', FALSE);

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
--  EMAIL TUTORIAL
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
 2,
 'Mastering Email: From Sign-Up to Send-Off',
 'Getting started with email has never been easier! In this quick, beginner-friendly guide, you’ll learn how to set up your very first email account, add security details, log in, and send your first message. Perfect for anyone new to email or looking for a simple step-by-step refresher.',
 'synthesia', 
 'https://share.synthesia.io/embeds/videos/796fe9dd-1eff-4e2b-af05-fc0db9625342',           
 'Email Basics'
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (1, 2);

-- =============================================================
--  QUIZ FOR THE EMAIL TUTORIAL
-- =============================================================
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (2, 2, 'Email Basics Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS (EMAIL)
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (6, 2, 'Which of the following is the first step in setting up a new email account?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(6, 'Writing your first message', FALSE),
(6, 'Choosing an email service provider', TRUE),
(6, 'Adding a profile picture', FALSE),
(6, 'Checking your inbox', FALSE);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (7, 2, 'Why is it important to add a recovery phone number or email when creating your account?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(7, 'To receive marketing offers', FALSE),
(7, 'To help recover your account if you forget your password', TRUE),
(7, 'To allow others to find your account easily', FALSE),
(7, 'To improve your inbox speed', FALSE);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (8, 2, 'What is the purpose of the ‘Subject’ line when composing an email?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(8, 'To add your signature', FALSE),
(8, 'To include attachments', FALSE),
(8, 'To summarize the content of your email', TRUE),
(8, 'To show the recipient’s name', FALSE);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (9, 2, 'Which button do you click to start writing a new email in Gmail?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(9, 'Reply', FALSE),
(9, 'Compose', TRUE),
(9, 'Forward', FALSE),
(9, 'Draft', FALSE);

-- Question 5 
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (10, 2, 'What should you do before clicking ‘Send’ on your first email?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(10, 'Delete the subject line', FALSE),
(10, 'Double-check the recipient’s address and your message', TRUE),
(10, 'Close the browser', FALSE),
(10, 'Log out of your account', FALSE);