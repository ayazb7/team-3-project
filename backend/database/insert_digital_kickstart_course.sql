-- =============================================================
-- SKYWISE DATABASE - DIGITAL BASICS COURSE
-- Project Group: Flow State (Team 3)
-- =============================================================

USE skywise_db;

-- =============================================================
--  COURSE DETAILS
-- =============================================================
INSERT INTO courses ( name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
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
INSERT INTO courses ( name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
'Mastering Online Communication',
'Enhance your online communication skills — from video calls to chat etiquette and professional collaboration tools.',
'Intermediate',
50,
75,
'This course helps you communicate effectively in the digital workplace. You\'ll learn how to use video conferencing platforms professionally, write clear and concise messages, and collaborate smoothly using modern tools like Slack, Teams, and Zoom.',
'[
  "Set up and join video calls with confidence",
  "Use chat and email tools effectively in professional settings",
  "Collaborate online using shared documents and cloud tools",
  "Apply best practices for tone, clarity, and etiquette"
]',
'https://images.unsplash.com/photo-1557200134-90327ee9fafa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670'
);

INSERT INTO courses (name, description, difficulty, duration_min_minutes, duration_max_minutes, summary, learning_objectives, thumbnail_url)
VALUES
(
'Smartphone Essentials',
'Get the most out of your smartphone — from customizing settings to managing apps and staying secure on the go.',
'Advanced',
40,
55,
'In this hands-on course, you\'ll explore your smartphone\'s key features and learn how to personalize it for your needs. Discover how to manage apps, protect your privacy, and troubleshoot common problems with ease.',
'[
  "Customize smartphone settings for convenience and privacy",
  "Install, manage, and organize apps",
  "Protect your data and personal information",
  "Solve common issues and keep your device running smoothly"
]',
'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1760'
);

-- =============================================================
--  COURSE REQUIREMENTS (Prerequisites)
-- =============================================================
INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(1, 'Basic computer use (mouse/keyboard)'),
(1, 'Access to an email account'),
(1, 'Internet connection');

INSERT INTO course_requirements (course_id, requirement_text)
VALUES
(2, 'Basic computer use (mouse/keyboard)'),
(2, 'Access to an email account'),
(2, 'Internet connection');

-- =============================================================
--  PASSWORD TUTORIAL
-- =============================================================
INSERT INTO tutorials ( title, description, video_provider, video_url, category, video_transcript)
VALUES
(
 'How to Create a Strong Password and Stay Safe Online',
 'In this video, you’ll learn how to create strong, memorable passwords that help keep your online accounts secure. You’ll discover simple techniques for building passwords that are hard to guess but easy to remember, as well as tips for managing them safely using a password manager. By the end, you’ll understand how to protect your personal information and stay safer online.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb',
 'Cybersecurity',
' \'WEBVTT\n\n00:00:00.600 --> 00:00:03.479\nWelcome to this digital skills lesson by Flow State!\n\n00:00:03.629 --> 00:00:08.133\nIn this video, we\'ll learn how to create a strong\npassword and stay safe online.\n\n00:00:08.283 --> 00:00:13.485\nWe\'ll walk you through what to avoid and include\nin a password and share tips for protecting your accounts.\n\n00:00:13.635 --> 00:00:14.238\nReady?\n\n00:00:14.388 --> 00:00:15.271\nLet\'s start!\n\n00:00:17.066 --> 00:00:19.991\nSo let\'s look at what to avoid when it comes to creating\na password!\n\n00:00:21.200 --> 00:00:23.336\nFirst — avoid personal information.\n\n00:00:23.486 --> 00:00:28.594\nThat means no kids\' names, pets\' names, birthdays,\naddresses, phone numbers, or social security numbers.\n\n00:00:28.744 --> 00:00:31.066\nThese are the first things hackers will try.\n\n00:00:31.216 --> 00:00:36.278\nSecond — stay away from common words like \'cat,\'\n\'dog,\' \'mom,\' or \'dad.\' They\'re too easy to guess.\n\n00:00:36.428 --> 00:00:41.002\nRemember: if it\'s something people can learn about\nyou or something super common, don\'t use it in your\n\n00:00:41.002 --> 00:00:41.862\npassword.\n\n00:00:43.566 --> 00:00:45.980\nNow let\'s talk about what your password should look\nlike..\n\n00:00:47.166 --> 00:00:50.231\nFirstly, it should be at least 8 characters, 12 is\nbetter.\n\n00:00:50.381 --> 00:00:53.353\nUsing upper and lowercase letters, numbers, symbols.\n\n00:00:53.503 --> 00:00:56.243\nPlus, you should have different passwords for every\nsite.\n\n00:00:56.393 --> 00:01:00.433\nThat way a hacker can\'t access all of your accounts\nif they get one password.\n\n00:01:01.633 --> 00:01:03.211\nWell how do you sort that all out?\n\n00:01:03.361 --> 00:01:05.265\nYou can create a password formula!\n\n00:01:05.415 --> 00:01:09.549\nI\'ll show you how, but don\'t copy it exactly because\nyour formula should be your own.\n\n00:01:09.699 --> 00:01:10.488\nSo let\'s go!\n\n00:01:11.700 --> 00:01:15.136\nNumber 1- Always start the same way, using something\nunique.\n\n00:01:15.286 --> 00:01:18.723\nLet\'s use the airport code for a city like Minneapolis\nwhich is MSP.\n\n00:01:18.873 --> 00:01:24.829\nMix upper and lowercase letters, lowercase m, capital\nP, then replace the middle letter with a symbol, like\n\n00:01:24.829 --> 00:01:25.746\na dollar sign.\n\n00:01:27.533 --> 00:01:32.455\nSecondly add two letters from the website you\'re creating\na password for by using capital letters.\n\n00:01:32.605 --> 00:01:34.648\nLet\'s say we\'re using BestBuy.com.\n\n00:01:34.798 --> 00:01:38.560\nSo we can use ES from "Best" to further develop a\nstronger password.\n\n00:01:38.710 --> 00:01:42.472\nThen we can eventually add another symbol like at\nor exclamation marks.\n\n00:01:42.622 --> 00:01:47.196\nThen finish with your favourite number, but don\'t\nuse personal numbers like your birthday, which then\n\n00:01:47.196 --> 00:01:49.077\ncompletes this example password.\n\n00:01:50.266 --> 00:01:53.377\nFollow the same steps for every website you need credentials\nfor.\n\n00:01:53.527 --> 00:01:55.292\nHere\'s how it would look for Gmail.\n\n00:01:55.442 --> 00:01:58.600\nYou can see it\'s different, hard to crack, but easy\nfor you to remember.\n\n00:01:59.800 --> 00:02:03.608\nNow that we\'ve created a password that is safe, secure\nand easy to remember.\n\n00:02:03.758 --> 00:02:06.776\nLet\'s look at how we can stay safe online with our\npasswords shall we!\n\n00:02:08.365 --> 00:02:10.641\nNumber one- use a password manager.\n\n00:02:10.791 --> 00:02:13.949\nwhich creates and remembers strong, unique passwords\nfor you.\n\n00:02:14.099 --> 00:02:17.768\nThat way, you don\'t have to memorize them all, and\nyour accounts stay secure.\n\n00:02:17.918 --> 00:02:20.240\nNumber 2  avoid clicking suspicious links.\n\n00:02:20.390 --> 00:02:23.501\nCybercriminals often hide scams in emails or pop-ups.\n\n00:02:23.651 --> 00:02:26.205\nOne careless click can expose your personal info.\n\n00:02:26.355 --> 00:02:29.281\nThen number 3 always keep your apps and software\nupdated.\n\n00:02:29.431 --> 00:02:33.843\nUpdates aren\'t just new features — they fix security\nholes hackers might exploit.\n\n00:02:33.993 --> 00:02:36.965\nThink of them as repairs that keep your digital house\nsafe.\n\n00:02:38.566 --> 00:02:40.655\nWell done and thank you for watching the video!\n\n00:02:40.805 --> 00:02:44.474\nYou\'ve taken the time to learn the essentials, and\nthat\'s a big step forward.\n\n00:02:44.624 --> 00:02:48.339\nNow, to put your knowledge to the test, you\'ll be\ntaking a short quiz.\n\n00:02:48.489 --> 00:02:52.669\nThis will help you check what you\'ve learned and\nmake sure you\'re ready to apply it in practice!\''
);

INSERT INTO tutorials (title, description, video_provider, video_url, category, video_transcript)
VALUES
(

 'How to Create a Strong Password and Stay Safe Online 2',
 'Getting started with email has never been easier! In this quick, beginner-friendly guide, you’ll learn how to set up your very first email account, add security details, log in, and send your first message. Perfect for anyone new to email or looking for a simple step-by-step refresher.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb',
 'Cybersecurity',
' \'WEBVTT\n\n00:00:00.600 --> 00:00:03.479\nWelcome to this digital skills lesson by Flow State!\n\n00:00:03.629 --> 00:00:08.133\nIn this video, we\'ll learn how to create a strong\npassword and stay safe online.\n\n00:00:08.283 --> 00:00:13.485\nWe\'ll walk you through what to avoid and include\nin a password and share tips for protecting your accounts.\n\n00:00:13.635 --> 00:00:14.238\nReady?\n\n00:00:14.388 --> 00:00:15.271\nLet\'s start!\n\n00:00:17.066 --> 00:00:19.991\nSo let\'s look at what to avoid when it comes to creating\na password!\n\n00:00:21.200 --> 00:00:23.336\nFirst — avoid personal information.\n\n00:00:23.486 --> 00:00:28.594\nThat means no kids\' names, pets\' names, birthdays,\naddresses, phone numbers, or social security numbers.\n\n00:00:28.744 --> 00:00:31.066\nThese are the first things hackers will try.\n\n00:00:31.216 --> 00:00:36.278\nSecond — stay away from common words like \'cat,\'\n\'dog,\' \'mom,\' or \'dad.\' They\'re too easy to guess.\n\n00:00:36.428 --> 00:00:41.002\nRemember: if it\'s something people can learn about\nyou or something super common, don\'t use it in your\n\n00:00:41.002 --> 00:00:41.862\npassword.\n\n00:00:43.566 --> 00:00:45.980\nNow let\'s talk about what your password should look\nlike..\n\n00:00:47.166 --> 00:00:50.231\nFirstly, it should be at least 8 characters, 12 is\nbetter.\n\n00:00:50.381 --> 00:00:53.353\nUsing upper and lowercase letters, numbers, symbols.\n\n00:00:53.503 --> 00:00:56.243\nPlus, you should have different passwords for every\nsite.\n\n00:00:56.393 --> 00:01:00.433\nThat way a hacker can\'t access all of your accounts\nif they get one password.\n\n00:01:01.633 --> 00:01:03.211\nWell how do you sort that all out?\n\n00:01:03.361 --> 00:01:05.265\nYou can create a password formula!\n\n00:01:05.415 --> 00:01:09.549\nI\'ll show you how, but don\'t copy it exactly because\nyour formula should be your own.\n\n00:01:09.699 --> 00:01:10.488\nSo let\'s go!\n\n00:01:11.700 --> 00:01:15.136\nNumber 1- Always start the same way, using something\nunique.\n\n00:01:15.286 --> 00:01:18.723\nLet\'s use the airport code for a city like Minneapolis\nwhich is MSP.\n\n00:01:18.873 --> 00:01:24.829\nMix upper and lowercase letters, lowercase m, capital\nP, then replace the middle letter with a symbol, like\n\n00:01:24.829 --> 00:01:25.746\na dollar sign.\n\n00:01:27.533 --> 00:01:32.455\nSecondly add two letters from the website you\'re creating\na password for by using capital letters.\n\n00:01:32.605 --> 00:01:34.648\nLet\'s say we\'re using BestBuy.com.\n\n00:01:34.798 --> 00:01:38.560\nSo we can use ES from "Best" to further develop a\nstronger password.\n\n00:01:38.710 --> 00:01:42.472\nThen we can eventually add another symbol like at\nor exclamation marks.\n\n00:01:42.622 --> 00:01:47.196\nThen finish with your favourite number, but don\'t\nuse personal numbers like your birthday, which then\n\n00:01:47.196 --> 00:01:49.077\ncompletes this example password.\n\n00:01:50.266 --> 00:01:53.377\nFollow the same steps for every website you need credentials\nfor.\n\n00:01:53.527 --> 00:01:55.292\nHere\'s how it would look for Gmail.\n\n00:01:55.442 --> 00:01:58.600\nYou can see it\'s different, hard to crack, but easy\nfor you to remember.\n\n00:01:59.800 --> 00:02:03.608\nNow that we\'ve created a password that is safe, secure\nand easy to remember.\n\n00:02:03.758 --> 00:02:06.776\nLet\'s look at how we can stay safe online with our\npasswords shall we!\n\n00:02:08.365 --> 00:02:10.641\nNumber one- use a password manager.\n\n00:02:10.791 --> 00:02:13.949\nwhich creates and remembers strong, unique passwords\nfor you.\n\n00:02:14.099 --> 00:02:17.768\nThat way, you don\'t have to memorize them all, and\nyour accounts stay secure.\n\n00:02:17.918 --> 00:02:20.240\nNumber 2  avoid clicking suspicious links.\n\n00:02:20.390 --> 00:02:23.501\nCybercriminals often hide scams in emails or pop-ups.\n\n00:02:23.651 --> 00:02:26.205\nOne careless click can expose your personal info.\n\n00:02:26.355 --> 00:02:29.281\nThen number 3 always keep your apps and software\nupdated.\n\n00:02:29.431 --> 00:02:33.843\nUpdates aren\'t just new features — they fix security\nholes hackers might exploit.\n\n00:02:33.993 --> 00:02:36.965\nThink of them as repairs that keep your digital house\nsafe.\n\n00:02:38.566 --> 00:02:40.655\nWell done and thank you for watching the video!\n\n00:02:40.805 --> 00:02:44.474\nYou\'ve taken the time to learn the essentials, and\nthat\'s a big step forward.\n\n00:02:44.624 --> 00:02:48.339\nNow, to put your knowledge to the test, you\'ll be\ntaking a short quiz.\n\n00:02:48.489 --> 00:02:52.669\nThis will help you check what you\'ve learned and\nmake sure you\'re ready to apply it in practice!\''
);

INSERT INTO tutorials ( title, description, video_provider, video_url, category, video_transcript)
VALUES
(
 'How to Create a Strong Password and Stay Safe Online 3',
 'Getting started with email has never been easier! In this quick, beginner-friendly guide, you’ll learn how to set up your very first email account, add security details, log in, and send your first message. Perfect for anyone new to email or looking for a simple step-by-step refresher.',
 'synthesia',
 'https://share.synthesia.io/embeds/videos/9e680982-8abe-4227-a96c-5906d2b71fbb',
 'Cybersecurity',
' \'WEBVTT\n\n00:00:00.600 --> 00:00:03.479\nWelcome to this digital skills lesson by Flow State!\n\n00:00:03.629 --> 00:00:08.133\nIn this video, we\'ll learn how to create a strong\npassword and stay safe online.\n\n00:00:08.283 --> 00:00:13.485\nWe\'ll walk you through what to avoid and include\nin a password and share tips for protecting your accounts.\n\n00:00:13.635 --> 00:00:14.238\nReady?\n\n00:00:14.388 --> 00:00:15.271\nLet\'s start!\n\n00:00:17.066 --> 00:00:19.991\nSo let\'s look at what to avoid when it comes to creating\na password!\n\n00:00:21.200 --> 00:00:23.336\nFirst — avoid personal information.\n\n00:00:23.486 --> 00:00:28.594\nThat means no kids\' names, pets\' names, birthdays,\naddresses, phone numbers, or social security numbers.\n\n00:00:28.744 --> 00:00:31.066\nThese are the first things hackers will try.\n\n00:00:31.216 --> 00:00:36.278\nSecond — stay away from common words like \'cat,\'\n\'dog,\' \'mom,\' or \'dad.\' They\'re too easy to guess.\n\n00:00:36.428 --> 00:00:41.002\nRemember: if it\'s something people can learn about\nyou or something super common, don\'t use it in your\n\n00:00:41.002 --> 00:00:41.862\npassword.\n\n00:00:43.566 --> 00:00:45.980\nNow let\'s talk about what your password should look\nlike..\n\n00:00:47.166 --> 00:00:50.231\nFirstly, it should be at least 8 characters, 12 is\nbetter.\n\n00:00:50.381 --> 00:00:53.353\nUsing upper and lowercase letters, numbers, symbols.\n\n00:00:53.503 --> 00:00:56.243\nPlus, you should have different passwords for every\nsite.\n\n00:00:56.393 --> 00:01:00.433\nThat way a hacker can\'t access all of your accounts\nif they get one password.\n\n00:01:01.633 --> 00:01:03.211\nWell how do you sort that all out?\n\n00:01:03.361 --> 00:01:05.265\nYou can create a password formula!\n\n00:01:05.415 --> 00:01:09.549\nI\'ll show you how, but don\'t copy it exactly because\nyour formula should be your own.\n\n00:01:09.699 --> 00:01:10.488\nSo let\'s go!\n\n00:01:11.700 --> 00:01:15.136\nNumber 1- Always start the same way, using something\nunique.\n\n00:01:15.286 --> 00:01:18.723\nLet\'s use the airport code for a city like Minneapolis\nwhich is MSP.\n\n00:01:18.873 --> 00:01:24.829\nMix upper and lowercase letters, lowercase m, capital\nP, then replace the middle letter with a symbol, like\n\n00:01:24.829 --> 00:01:25.746\na dollar sign.\n\n00:01:27.533 --> 00:01:32.455\nSecondly add two letters from the website you\'re creating\na password for by using capital letters.\n\n00:01:32.605 --> 00:01:34.648\nLet\'s say we\'re using BestBuy.com.\n\n00:01:34.798 --> 00:01:38.560\nSo we can use ES from "Best" to further develop a\nstronger password.\n\n00:01:38.710 --> 00:01:42.472\nThen we can eventually add another symbol like at\nor exclamation marks.\n\n00:01:42.622 --> 00:01:47.196\nThen finish with your favourite number, but don\'t\nuse personal numbers like your birthday, which then\n\n00:01:47.196 --> 00:01:49.077\ncompletes this example password.\n\n00:01:50.266 --> 00:01:53.377\nFollow the same steps for every website you need credentials\nfor.\n\n00:01:53.527 --> 00:01:55.292\nHere\'s how it would look for Gmail.\n\n00:01:55.442 --> 00:01:58.600\nYou can see it\'s different, hard to crack, but easy\nfor you to remember.\n\n00:01:59.800 --> 00:02:03.608\nNow that we\'ve created a password that is safe, secure\nand easy to remember.\n\n00:02:03.758 --> 00:02:06.776\nLet\'s look at how we can stay safe online with our\npasswords shall we!\n\n00:02:08.365 --> 00:02:10.641\nNumber one- use a password manager.\n\n00:02:10.791 --> 00:02:13.949\nwhich creates and remembers strong, unique passwords\nfor you.\n\n00:02:14.099 --> 00:02:17.768\nThat way, you don\'t have to memorize them all, and\nyour accounts stay secure.\n\n00:02:17.918 --> 00:02:20.240\nNumber 2  avoid clicking suspicious links.\n\n00:02:20.390 --> 00:02:23.501\nCybercriminals often hide scams in emails or pop-ups.\n\n00:02:23.651 --> 00:02:26.205\nOne careless click can expose your personal info.\n\n00:02:26.355 --> 00:02:29.281\nThen number 3 always keep your apps and software\nupdated.\n\n00:02:29.431 --> 00:02:33.843\nUpdates aren\'t just new features — they fix security\nholes hackers might exploit.\n\n00:02:33.993 --> 00:02:36.965\nThink of them as repairs that keep your digital house\nsafe.\n\n00:02:38.566 --> 00:02:40.655\nWell done and thank you for watching the video!\n\n00:02:40.805 --> 00:02:44.474\nYou\'ve taken the time to learn the essentials, and\nthat\'s a big step forward.\n\n00:02:44.624 --> 00:02:48.339\nNow, to put your knowledge to the test, you\'ll be\ntaking a short quiz.\n\n00:02:48.489 --> 00:02:52.669\nThis will help you check what you\'ve learned and\nmake sure you\'re ready to apply it in practice!\''
);

-- =============================================================
--  COURSE - TUTORIAL LINK
-- =============================================================
INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (1, 1);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (2, 2);

INSERT INTO course_tutorials (course_id, tutorial_id)
VALUES (3, 3);
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
INSERT INTO tutorials (title, description, video_provider, video_url, category)
VALUES
(
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