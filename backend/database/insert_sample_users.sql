-- =============================================================
--  SAMPLE USER DATA FOR TESTING
--  Creates 15 sample users with activity data
-- =============================================================

USE skywise_db;

-- Insert sample users with varied creation dates (spread across last 30 days)
INSERT INTO users (username, email, password_hash, role, language_preference, created_at) VALUES
-- Recent users (last 7 days)
('sarah_chen', 'sarah.chen@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('mike_rodriguez', 'mike.rodriguez@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('emma_jones', 'emma.jones@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 6 DAY)),

-- Mid-range users (8-14 days ago)
('david_kim', 'david.kim@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 9 DAY)),
('lisa_brown', 'lisa.brown@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 11 DAY)),
('james_wilson', 'james.wilson@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 13 DAY)),

-- Mid-range users (15-21 days ago)
('maria_garcia', 'maria.garcia@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 16 DAY)),
('robert_taylor', 'robert.taylor@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 18 DAY)),
('anna_martinez', 'anna.martinez@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 20 DAY)),

-- Older users (22-30 days ago)
('john_anderson', 'john.anderson@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 23 DAY)),
('sophia_lee', 'sophia.lee@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 25 DAY)),
('william_thomas', 'william.thomas@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 27 DAY)),
('olivia_white', 'olivia.white@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 28 DAY)),
('michael_harris', 'michael.harris@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 29 DAY)),
('emily_clark', 'emily.clark@email.com', '$2b$12$5MFsjRaeD/eE7WLrY6XqtO8BIDD90pGuxrYVzeJsOQg3koBEh8rxm', 'user', 'English', DATE_SUB(NOW(), INTERVAL 30 DAY));

-- Get the user IDs for the sample users (assuming sequential IDs starting from 2, since 1 is likely admin)
SET @sarah_id = (SELECT id FROM users WHERE username = 'sarah_chen');
SET @mike_id = (SELECT id FROM users WHERE username = 'mike_rodriguez');
SET @emma_id = (SELECT id FROM users WHERE username = 'emma_jones');
SET @david_id = (SELECT id FROM users WHERE username = 'david_kim');
SET @lisa_id = (SELECT id FROM users WHERE username = 'lisa_brown');
SET @james_id = (SELECT id FROM users WHERE username = 'james_wilson');
SET @maria_id = (SELECT id FROM users WHERE username = 'maria_garcia');
SET @robert_id = (SELECT id FROM users WHERE username = 'robert_taylor');
SET @anna_id = (SELECT id FROM users WHERE username = 'anna_martinez');
SET @john_id = (SELECT id FROM users WHERE username = 'john_anderson');
SET @sophia_id = (SELECT id FROM users WHERE username = 'sophia_lee');
SET @william_id = (SELECT id FROM users WHERE username = 'william_thomas');
SET @olivia_id = (SELECT id FROM users WHERE username = 'olivia_white');
SET @michael_id = (SELECT id FROM users WHERE username = 'michael_harris');
SET @emily_id = (SELECT id FROM users WHERE username = 'emily_clark');

-- =============================================================
--  SAMPLE COURSE PROGRESS DATA
-- =============================================================

-- Active users with recent course progress
INSERT INTO user_course_progress (user_id, course_id, progress_percentage, last_updated) VALUES
-- Sarah (very active, just started)
(@sarah_id, 1, 25, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@sarah_id, 2, 15, DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Mike (moderately active)
(@mike_id, 1, 60, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@mike_id, 4, 45, DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- Emma (active and making good progress)
(@emma_id, 2, 80, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@emma_id, 3, 50, DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- David (completed one course, working on another)
(@david_id, 1, 100, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(@david_id, 5, 30, DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- Lisa (recently active)
(@lisa_id, 4, 70, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(@lisa_id, 6, 40, DATE_SUB(NOW(), INTERVAL 8 DAY)),

-- James (completed course)
(@james_id, 2, 100, DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- Maria (not active in last 7 days)
(@maria_id, 1, 35, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(@maria_id, 3, 20, DATE_SUB(NOW(), INTERVAL 15 DAY)),

-- Robert (moderate progress, not active recently)
(@robert_id, 5, 55, DATE_SUB(NOW(), INTERVAL 12 DAY)),

-- Anna (completed a course)
(@anna_id, 4, 100, DATE_SUB(NOW(), INTERVAL 8 DAY)),

-- John (early stage)
(@john_id, 1, 10, DATE_SUB(NOW(), INTERVAL 20 DAY)),

-- Sophia (good progress)
(@sophia_id, 2, 65, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(@sophia_id, 6, 40, DATE_SUB(NOW(), INTERVAL 22 DAY)),

-- William (completed)
(@william_id, 3, 100, DATE_SUB(NOW(), INTERVAL 25 DAY)),

-- Olivia (started multiple courses)
(@olivia_id, 1, 20, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(@olivia_id, 4, 15, DATE_SUB(NOW(), INTERVAL 29 DAY)),

-- Michael (moderate progress)
(@michael_id, 5, 50, DATE_SUB(NOW(), INTERVAL 26 DAY)),

-- Emily (completed one)
(@emily_id, 6, 100, DATE_SUB(NOW(), INTERVAL 29 DAY));

-- =============================================================
--  SAMPLE QUIZ RESULTS DATA
-- =============================================================

-- Note: Quiz IDs depend on what's in your database. Assuming quizzes exist with IDs 1-10
-- Active users with recent quiz attempts
INSERT INTO user_quiz_results (user_id, quiz_id, score, total_questions, correct_answers, attempted_at) VALUES
-- Recent quiz attempts (last 7 days)
(@sarah_id, 1, 75.00, 10, 7, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@sarah_id, 2, 80.00, 10, 8, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@mike_id, 3, 85.00, 10, 8, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@mike_id, 4, 70.00, 10, 7, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(@emma_id, 5, 90.00, 10, 9, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@emma_id, 2, 95.00, 10, 9, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(@david_id, 1, 100.00, 10, 10, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(@david_id, 6, 85.00, 10, 8, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(@lisa_id, 7, 80.00, 10, 8, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(@james_id, 3, 90.00, 10, 9, DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- Older quiz attempts
(@maria_id, 1, 65.00, 10, 6, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(@robert_id, 4, 75.00, 10, 7, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(@anna_id, 8, 88.00, 10, 8, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(@sophia_id, 2, 82.00, 10, 8, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(@william_id, 5, 95.00, 10, 9, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(@michael_id, 6, 78.00, 10, 7, DATE_SUB(NOW(), INTERVAL 26 DAY));

-- =============================================================
--  SAMPLE TUTORIAL PROGRESS DATA
-- =============================================================

-- Note: Tutorial IDs depend on your database. Assuming tutorials exist with IDs 1-20
-- Active users with recent tutorial completions
INSERT INTO user_tutorial_progress (user_id, tutorial_id, completed, completed_at, feedback) VALUES
-- Recent completions (last 7 days)
(@sarah_id, 1, TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY), 'positive'),
(@sarah_id, 2, TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY), 'positive'),
(@mike_id, 3, TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY), 'positive'),
(@mike_id, 4, TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY), NULL),
(@mike_id, 5, TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY), 'positive'),
(@emma_id, 6, TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY), 'positive'),
(@emma_id, 7, TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY), 'positive'),
(@emma_id, 8, TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY), 'positive'),
(@david_id, 1, TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY), 'positive'),
(@david_id, 9, TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY), 'positive'),
(@lisa_id, 10, TRUE, DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
(@lisa_id, 11, TRUE, DATE_SUB(NOW(), INTERVAL 7 DAY), 'positive'),
(@james_id, 2, TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY), 'positive'),
(@james_id, 3, TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY), 'positive'),

-- Older completions
(@maria_id, 4, TRUE, DATE_SUB(NOW(), INTERVAL 15 DAY), 'positive'),
(@robert_id, 5, TRUE, DATE_SUB(NOW(), INTERVAL 12 DAY), NULL),
(@anna_id, 12, TRUE, DATE_SUB(NOW(), INTERVAL 8 DAY), 'positive'),
(@anna_id, 13, TRUE, DATE_SUB(NOW(), INTERVAL 9 DAY), 'positive'),
(@sophia_id, 6, TRUE, DATE_SUB(NOW(), INTERVAL 18 DAY), 'positive'),
(@william_id, 7, TRUE, DATE_SUB(NOW(), INTERVAL 25 DAY), 'positive'),
(@olivia_id, 8, TRUE, DATE_SUB(NOW(), INTERVAL 28 DAY), NULL),
(@michael_id, 9, TRUE, DATE_SUB(NOW(), INTERVAL 26 DAY), 'positive'),
(@emily_id, 10, TRUE, DATE_SUB(NOW(), INTERVAL 29 DAY), 'positive');

-- =============================================================
--  SAMPLE USER PREFERENCES
-- =============================================================

INSERT INTO user_preferences (user_id, language, accessibility_mode, theme) VALUES
(@sarah_id, 'English', 'standard', 'light'),
(@mike_id, 'English', 'standard', 'dark'),
(@emma_id, 'English', 'high-contrast', 'light'),
(@david_id, 'English', 'standard', 'light'),
(@lisa_id, 'English', 'standard', 'dark'),
(@james_id, 'English', 'standard', 'light'),
(@maria_id, 'English', 'standard', 'light'),
(@robert_id, 'English', 'standard', 'dark'),
(@anna_id, 'English', 'high-contrast', 'light'),
(@john_id, 'English', 'standard', 'light'),
(@sophia_id, 'English', 'standard', 'dark'),
(@william_id, 'English', 'standard', 'light'),
(@olivia_id, 'English', 'standard', 'light'),
(@michael_id, 'English', 'standard', 'dark'),
(@emily_id, 'English', 'high-contrast', 'light');

-- Display summary
SELECT
    'Sample Data Created Successfully!' as message,
    COUNT(*) as total_users
FROM users
WHERE username IN ('sarah_chen', 'mike_rodriguez', 'emma_jones', 'david_kim', 'lisa_brown',
                   'james_wilson', 'maria_garcia', 'robert_taylor', 'anna_martinez',
                   'john_anderson', 'sophia_lee', 'william_thomas', 'olivia_white',
                   'michael_harris', 'emily_clark');
