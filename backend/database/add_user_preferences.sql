-- =============================================================
--  ADD USER PREFERENCES TABLE
--  For storing accessibility and other user preferences
-- =============================================================

USE skywise_db;

-- Drop table if it exists
DROP TABLE IF EXISTS user_preferences;

-- Create user_preferences table
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    preferences JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX idx_user_id ON user_preferences(user_id);

-- Example of preferences JSON structure:
-- {
--   "fontSize": 100
-- }

