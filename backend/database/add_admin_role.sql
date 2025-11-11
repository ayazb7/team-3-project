-- =============================================================
--  SET USER AS ADMIN
-- =============================================================
-- 
-- This script sets a user as an admin by their email
-- Edit the email below to set your desired admin user
--

USE skywise_db;

-- Example: Update an existing user to admin (replace with your email)
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
