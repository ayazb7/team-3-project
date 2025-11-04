-- =============================================================
-- SKYWISE DATABASE - CAREER LAUNCH COURSE
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSE DETAILS - CAREER LAUNCH
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
  3,
  'Career Launch',
  'Get ready to take the first steps toward your professional future! Learn how to create a standout CV and build an impressive LinkedIn profile that opens doors to career opportunities.',
  'Beginner',
  50,
  70,
  'Get ready to take the first steps toward your professional future with Career Launch! In this course, you''ll learn the essential skills to help you stand out to employers and start building your career with confidence. You''ll discover how to craft a strong, well-structured CV that highlights your education, skills, and experience — and learn how to create an impressive LinkedIn profile that showcases your strengths and helps you connect with opportunities online. By the end of the course, you''ll have the tools to present yourself professionally, make a great first impression, and launch your career journey with confidence.',
  '[
    "Create a professional, well-structured CV that highlights your strengths",
    "Build an impressive LinkedIn profile to showcase your skills and experience",
    "Understand what employers look for in CVs and online profiles",
    "Present yourself professionally and make a strong first impression"
  ]',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&q=80'
);

-- =============================================================
--  COURSE PREREQUISITES
-- =============================================================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id)
VALUES (3, 1);

-- =============================================================
--  COURSE REQUIREMENTS
-- =============================================================
INSERT INTO course_requirements (id, course_id, requirement_text)
VALUES
(6, 3, 'Resume or work experience details (if available)'),
(7, 3, 'Email account for LinkedIn registration');

-- =============================================================
--  LINKEDIN TUTORIAL
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
 4,
 'Building Your Professional LinkedIn Profile',
 'Discover how to create a standout LinkedIn profile that showcases your professional skills and experience. This tutorial walks you through setting up your profile, choosing the right photo, writing an engaging headline and summary, and keeping your profile updated to attract career opportunities.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/a3ce550d-e67e-4380-8614-4878fa16def1',
 'Career Development'
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (3, 4);

-- =============================================================
--  QUIZ FOR THE LINKEDIN TUTORIAL
-- =============================================================
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (4, 4, 'LinkedIn Profile Essentials Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS (LINKEDIN)
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (16, 4, 'What is the main purpose of having a LinkedIn profile?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(16, 'To post personal photos and updates', FALSE),
(16, 'To connect with friends for fun', FALSE),
(16, 'To showcase your professional skills and experience', TRUE),
(16, 'To buy and sell items', FALSE);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (17, 4, 'Which of the following should you include in your LinkedIn profile photo?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(17, 'A group photo with friends', FALSE),
(17, 'A clear, professional-looking image of yourself', TRUE),
(17, 'A photo with filters or effects', FALSE),
(17, 'No photo at all', FALSE);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (18, 4, 'What should your LinkedIn headline focus on?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(18, 'Your job title and key skills', TRUE),
(18, 'A funny quote or personal motto', FALSE),
(18, 'Your favorite hobbies', FALSE),
(18, 'A list of emojis', FALSE);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (19, 4, 'Why is it important to write a summary on your LinkedIn profile?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(19, 'It allows you to share personal stories', FALSE),
(19, 'It gives an overview of your professional goals and strengths', TRUE),
(19, 'It helps you connect with more random people', FALSE),
(19, 'It replaces the need for a resume', FALSE);

-- Question 5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (20, 4, 'How often should you update your LinkedIn profile?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(20, 'Only when you create your account', FALSE),
(20, 'Every few years', FALSE),
(20, 'Regularly, whenever you gain new experience or skills', TRUE),
(20, 'Never — it updates automatically', FALSE);


-- =============================================================
--  CV TUTORIAL
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
 5,
 'Creating Your First Professional CV',
 'Learn how to create a professional CV that gets noticed by employers. This tutorial covers everything from structuring your CV and formatting it effectively to choosing the right information to include. By the end, you''ll know how to present your education, skills, and experience in a clear, professional way that makes a strong first impression.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/4d132ad3-81ac-43d2-96ce-74e7c6e085d1',
 'Career Development'
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (3, 5);

-- =============================================================
--  QUIZ FOR THE CV TUTORIAL
-- =============================================================
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (5, 5, 'CV Essentials Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS (CV)
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (21, 5, 'What is the main purpose of a CV?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(21, 'To list your hobbies and interests', FALSE),
(21, 'To show your education, skills, and experience to employers', TRUE),
(21, 'To write about your life story', FALSE),
(21, 'To apply for college', FALSE);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (22, 5, 'Which section usually comes first on a CV?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(22, 'Work experience', FALSE),
(22, 'Skills', FALSE),
(22, 'Contact information', TRUE),
(22, 'References', FALSE);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (23, 5, 'How long should your first CV usually be?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(23, 'Two to three pages', FALSE),
(23, 'One page', TRUE),
(23, 'Half a page', FALSE),
(23, 'As long as possible', FALSE);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (24, 5, 'Which of the following is the best formatting advice?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(24, 'Use lots of colors and fancy fonts', FALSE),
(24, 'Keep it simple, clear, and easy to read', TRUE),
(24, 'Write everything in capital letters', FALSE),
(24, 'Add large photos and graphics', FALSE);

-- Question 5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (25, 5, 'When saving your CV to send out, which format is best?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(25, '.docx', FALSE),
(25, '.jpg', FALSE),
(25, '.pdf', TRUE),
(25, '.txt', FALSE);

