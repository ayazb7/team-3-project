-- Insert dummy users
INSERT INTO users (name, email, password_hash, created_at) VALUES
('Alice Johnson', 'alice@example.com', 'hashed_pw_1', NOW()),
('Bob Smith', 'bob@example.com', 'hashed_pw_2', NOW()),
('Charlie Lee', 'charlie@example.com', 'hashed_pw_3', NOW());

-- Insert dummy tutorials
INSERT INTO tutorials (title, description, video_url, created_at) VALUES
('Setting Up Email', 'Learn how to create and manage an email account.', 'https://youtube.com/email_tutorial', NOW()),
('Safe Social Media Use', 'Tips for staying safe on social platforms.', 'https://youtube.com/social_safety', NOW()),
('Applying for Jobs Online', 'Step-by-step guide to job applications.', 'https://youtube.com/job_applications', NOW());

-- Insert dummy user progress
INSERT INTO user_progress (user_id, tutorial_id, completed, completed_at) VALUES
(1, 1, TRUE, NOW()),
(1, 2, FALSE, NULL),
(2, 1, TRUE, NOW()),
(2, 3, TRUE, NOW()),
(3, 2, FALSE, NULL);
