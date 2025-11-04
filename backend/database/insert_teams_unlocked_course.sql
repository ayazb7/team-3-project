-- =============================================================
-- SKYWISE DATABASE - DIGITAL BASICS COURSE
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSE DETAILS - TEAMS UNLOCKED
-- =============================================================
INSERT INTO courses (name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
  'Teams Unlocked',
  'Step into the world of seamless online collaboration with Teams Unlocked! This course is designed to help you master Microsoft Teams, one of the most powerful tools for communication and teamwork.',
  'Beginner',
  45,
  60,
  'In this course, you’ll learn how to join and schedule meetings, manage your calendar, and communicate effectively with colleagues, classmates, or teammates. By the end, you’ll feel confident navigating Teams, organizing online meetings, and collaborating efficiently — making remote work or study simpler and more productive.',
  '[
    "Join and schedule meetings confidently in Microsoft Teams",
    "Communicate clearly using chat, calls, and video meetings",
    "Manage your calendar and stay organized",
    "Collaborate effectively by sharing files and using channels"
  ]',
  'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/97EF/production/_133059883_gettyimages-1246521598.jpg'
);

-- =============================================================
--  COURSE REQUIREMENTS (Prerequisites)
-- =============================================================
INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(4, 'Basic computer and internet use'),
(4, 'Access to Microsoft Teams or Microsoft 365 account'),
(4, 'Stable internet connection'),
(4, 'Headset or microphone for calls');

-- =============================================================
--  TEAMS TUTORIAL
-- =============================================================
INSERT INTO tutorials (title, description, video_provider, video_url, category)
VALUES
(
 'Teams Unlocked: Getting Started with Microsoft Teams',
 'Learn how to use Microsoft Teams for chatting, calling, and hosting meetings. This tutorial walks you through joining meetings, scheduling events, and collaborating with teammates in a simple and practical way.',
 'synthesia',
 'https://share.synthesia.io/1eba2b49-af85-4e94-9bac-644704110b1f',
 'Online Collaboration' 
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (4, 4);

-- =============================================================
--  QUIZ FOR THE TEAMS TUTORIAL
-- =============================================================
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (3, 4, 'Teams Unlocked Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS (TEAMS)
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (11, 3, 'What is Microsoft Teams mainly used for?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(11, 'Playing online games', FALSE),
(11, 'Watching movies', FALSE),
(11, 'Communicating and collaborating with others online', TRUE),
(11, 'Designing presentations', FALSE);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (12, 3, 'What do you need to join a Teams meeting?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(12, 'A meeting link or invitation', TRUE),
(12, 'The host’s password', FALSE),
(12, 'A Microsoft Office certificate', FALSE),
(12, 'An app download code', FALSE);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (13, 3, 'When scheduling a meeting in Teams, which feature lets you pick a date and time?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(13, 'The Chat tab', FALSE),
(13, 'The Calendar tab', TRUE),
(13, 'The Files tab', FALSE),
(13, 'The Activity tab', FALSE);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (14, 3, 'What should you check before joining a meeting?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(14, 'That your camera and microphone are working', TRUE),
(14, 'That your wallpaper looks nice', FALSE),
(14, 'That your Teams theme is purple', FALSE),
(14, 'That your phone is fully charged', FALSE);

-- Question 5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (15, 3, 'What happens when you click “Join Now” in a Teams meeting?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(15, 'The meeting automatically records', FALSE),
(15, 'You enter the meeting and can see or hear others', TRUE),
(15, 'The meeting gets rescheduled', FALSE),
(15, 'A new chat opens instead', FALSE);