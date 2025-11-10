-- Add role field to users table for admin access
-- Example: Update an existing user to admin (replace with your email)
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
