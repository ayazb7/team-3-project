USE skywise_db;

-- =============================================================
--  CLEANUP EXISTING USER (IF ANY)
-- =============================================================

DELETE FROM user_quiz_answers 
WHERE user_quiz_result_id IN (
  SELECT id FROM user_quiz_results WHERE user_id = (
    SELECT id FROM users WHERE email = 'powerlearner@example.com'
  )
);

DELETE FROM user_quiz_results 
WHERE user_id = (SELECT id FROM users WHERE email = 'powerlearner@example.com');

DELETE FROM user_tutorial_progress 
WHERE user_id = (SELECT id FROM users WHERE email = 'powerlearner@example.com');

DELETE FROM user_course_progress 
WHERE user_id = (SELECT id FROM users WHERE email = 'powerlearner@example.com');

DELETE FROM users WHERE email = 'powerlearner@example.com';

-- =============================================================
--  CREATE DUMMY SUPER ACTIVE USER
-- =============================================================

INSERT INTO users (username, email, password_hash, language_preference)
VALUES ('powerlearner', 'powerlearner@example.com', '$2b$12$bLl4V88mfIe80A2OwlNQ5.N0qe699kPRObneYy7/OUAwcBHHmp00W', 'English');

SET @user_id = LAST_INSERT_ID();

-- =============================================================
--  COURSE PROGRESS (SIMULATED 20 COURSES)
-- =============================================================
-- We'll fake 20 completions by repeating the existing course_id = 1
-- to simulate variety and high activity

INSERT INTO user_course_progress (user_id, course_id, progress_percentage, last_updated)
VALUES
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 8 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 9 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 11 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 13 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 16 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 17 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 18 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 19 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 21 DAY)),
(@user_id, 1, 100.00, DATE_SUB(CURDATE(), INTERVAL 22 DAY));

-- =============================================================
--  TUTORIAL PROGRESS (EVERY DAY EXCEPT SUNDAYS)
-- =============================================================

-- Simulate daily learning for the last 4 weeks except Sundays
-- Assuming tutorial_id = 1 exists

INSERT INTO user_tutorial_progress (user_id, tutorial_id, completed, completed_at)
VALUES
-- Week 1 (Mon–Sat)
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 6 DAY)),

-- Week 2 (Mon–Sat)
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 8 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 9 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 11 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 13 DAY)),

-- Week 3 (Mon–Sat)
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 16 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 17 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 18 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 19 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 20 DAY)),

-- Week 4 (Mon–Sat)
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 22 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 23 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 24 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 25 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 26 DAY)),
(@user_id, 1, TRUE, DATE_SUB(CURDATE(), INTERVAL 27 DAY));

-- =============================================================
--  QUIZ RESULTS (Consistent High Scores)
-- =============================================================

INSERT INTO user_quiz_results (user_id, quiz_id, score, total_questions, correct_answers, attempted_at)
VALUES
(@user_id, 1, 5.00, 5, 5, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@user_id, 1, 5.00, 5, 5, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@user_id, 1, 5.00, 5, 5, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(@user_id, 1, 4.00, 5, 4, DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(@user_id, 1, 5.00, 5, 5, DATE_SUB(CURDATE(), INTERVAL 9 DAY));

-- =============================================================
--  QUIZ ANSWERS (Perfect Answers for the Most Recent Quiz)
-- =============================================================

SET @result_id = (SELECT id FROM user_quiz_results WHERE user_id = @user_id ORDER BY attempted_at DESC LIMIT 1);

INSERT INTO user_quiz_answers (user_quiz_result_id, question_id, selected_option_id, is_correct)
VALUES
(@result_id, 1, 3, TRUE),
(@result_id, 2, 5, TRUE),
(@result_id, 3, 10, TRUE),
(@result_id, 4, 15, TRUE),
(@result_id, 5, 19, TRUE);
