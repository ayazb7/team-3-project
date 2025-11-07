-- Add role field to users table for admin access
ALTER TABLE users
ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password_hash;

-- Example: Update an existing user to admin (replace with your email)
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
