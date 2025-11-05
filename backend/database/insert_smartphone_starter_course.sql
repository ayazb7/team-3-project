-- =============================================================
-- SKYWISE DATABASE - SMARTPHONE STARTER COURSE
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSE DETAILS - SMARTPHONE STARTER
-- =============================================================
INSERT INTO courses (id, name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
  4,
  'Smartphone Starter: Getting to Know Your Device',
  'Master the basics of using your smartphone with confidence! Learn essential skills from setup and connectivity to apps, calls, and camera use.',
  'Beginner',
  40,
  55,
  'Learn how to confidently use your smartphone — from turning it on and connecting to Wi-Fi, to downloading apps and adjusting settings. This course is designed to help beginners build comfort with everyday smartphone tasks, stay connected, and make the most of their device.',
  '[
    "Understand the main buttons, icons, and layout of your smartphone",
    "Learn how to connect to Wi-Fi, manage settings, and adjust accessibility options",
    "Discover how to make calls, send messages, and use your camera effectively",
    "Explore the App Store or Google Play to download and organize essential apps"
  ]',
  'https://www.shutterstock.com/image-photo/ljubljana-slovenia-2020-may-16-600nw-1736005427.jpg'
);

-- =============================================================
--  COURSE PREREQUISITES
-- =============================================================
INSERT INTO course_prerequisites (course_id, prerequisite_course_id)
VALUES (4, 1);

-- =============================================================
--  COURSE REQUIREMENTS
-- =============================================================
INSERT INTO course_requirements (id, course_id, requirement_text)
VALUES
(8, 4, 'Access to a smartphone (Android or iPhone)'),
(9, 4, 'Wi-Fi connection for setup and practice');

-- =============================================================
--  SAMSUNG GALAXY SETUP TUTORIAL
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
 6,
 'Setting Up Your Samsung Galaxy Phone',
 'Get your new Samsung Galaxy phone up and running in no time! This tutorial walks you through the complete setup process — from connecting to Wi-Fi and transferring data with Smart Switch, to adding your Google and Samsung accounts, and setting up security features like fingerprint or face recognition. Perfect for first-time Galaxy users or anyone switching devices.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/6001e362-e78f-4a19-88e9-cd313b5c6e06',
 'Digital Basics'
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (4, 6);

-- =============================================================
--  QUIZ FOR THE SAMSUNG GALAXY TUTORIAL
-- =============================================================
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (6, 6, 'Samsung Galaxy Setup Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS (SAMSUNG GALAXY)
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (26, 6, 'What is the first step when setting up your new Samsung Galaxy phone?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(26, 'Create a Samsung account', FALSE),
(26, 'Set up security options', FALSE),
(26, 'Connect to Wi-Fi', TRUE),
(26, 'Add your Google account', FALSE);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (27, 6, 'What tool can you use to transfer data from your old phone to your new Samsung Galaxy?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(27, 'Google Drive', FALSE),
(27, 'Samsung Smart Switch', TRUE),
(27, 'Bluetooth Transfer', FALSE),
(27, 'Quick Share', FALSE);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (28, 6, 'Why do you need to add your Google account during setup?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(28, 'To change your wallpaper', FALSE),
(28, 'To access the Play Store and Google apps', TRUE),
(28, 'To sync with Samsung Cloud', FALSE),
(28, 'To make phone calls', FALSE);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (29, 6, 'Which of the following is not one of the security options mentioned in the tutorial?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(29, 'Fingerprint scan', FALSE),
(29, 'Face recognition', FALSE),
(29, 'Voice command', TRUE),
(29, 'PIN or pattern', FALSE);

-- Question 5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (30, 6, 'What is one benefit of signing in to your Samsung account?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(30, 'You can download third-party apps', FALSE),
(30, 'You can earn Samsung Reward points', TRUE),
(30, 'You can remove your Google account', FALSE),
(30, 'You can skip software updates', FALSE);


-- =============================================================
--  IPHONE BASICS TUTORIAL
-- =============================================================
INSERT INTO tutorials (id, title, description, video_provider, video_url, category)
VALUES
(
 7,
 'iPhone Basics: Setup and Essential Features',
 'Learn the basics of using your iPhone in this quick, beginner-friendly guide. We''ll walk you through how to set up your device, make a phone call, send a text message, and take your first photo. Perfect for anyone new to iPhones or switching from another device — simple steps, clear visuals, and everything you need to get started confidently.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/f59f0915-0bdc-4816-bee0-fb49c5a7d4bd',
 'Digital Basics'
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (4, 7);

-- =============================================================
--  QUIZ FOR THE IPHONE TUTORIAL
-- =============================================================
INSERT INTO quizzes (id, tutorial_id, title)
VALUES (7, 7, 'iPhone Basics Quiz');

-- =============================================================
--  QUIZ QUESTIONS & OPTIONS (IPHONE)
-- =============================================================

-- Question 1
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (31, 7, 'What''s the first thing you should do when setting up a new iPhone?', 1);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(31, 'Take a photo', FALSE),
(31, 'Connect to Wi-Fi and sign in with your Apple ID', TRUE),
(31, 'Download apps', FALSE),
(31, 'Turn on airplane mode', FALSE);

-- Question 2
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (32, 7, 'How do you make a phone call on an iPhone?', 2);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(32, 'Open Messages and tap "New Message"', FALSE),
(32, 'Swipe down and use Siri', FALSE),
(32, 'Open the Phone app and tap the contact or number you want to call', TRUE),
(32, 'Open the Camera app', FALSE);

-- Question 3
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (33, 7, 'Which app do you use to send a text message?', 3);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(33, 'Mail', FALSE),
(33, 'Messages', TRUE),
(33, 'Notes', FALSE),
(33, 'Contacts', FALSE);

-- Question 4
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (34, 7, 'How do you take a photo on an iPhone?', 4);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(34, 'Open the Camera app and tap the circular shutter button', TRUE),
(34, 'Press the power button twice', FALSE),
(34, 'Open Settings', FALSE),
(34, 'Swipe left on the home screen', FALSE);

-- Question 5
INSERT INTO quiz_questions (id, quiz_id, question_text, question_order)
VALUES (35, 7, 'Where are your photos automatically saved after taking them?', 5);

INSERT INTO quiz_options (question_id, option_text, is_correct)
VALUES
(35, 'In the Files app', FALSE),
(35, 'In the Photos app', TRUE),
(35, 'In the App Store', FALSE),
(35, 'On the Home Screen', FALSE);

