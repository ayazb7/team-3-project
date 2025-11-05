# Admin Panel Setup Guide

## Overview
A comprehensive admin panel has been created with data visualization, course management, and user metrics tracking.

## Features
- **Admin Dashboard**: Platform statistics with user growth visualization and course performance metrics
- **Course Management**: Full CRUD operations (Create, Read, Update, Delete) for courses
- **User Metrics**: View all users and detailed individual user statistics

## Setup Instructions

### 1. Database Setup
Run the SQL migration to add the admin role field:

```bash
# Connect to your MySQL database and run:
mysql -u your_username -p your_database < backend/database/add_admin_role.sql

# Then, promote your user to admin (replace with your email):
mysql -u your_username -p your_database
```

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 2. Backend Setup
The admin routes are already registered in `app.py`. Just ensure your backend is running:

```bash
cd backend/api
python app.py
```

### 3. Frontend Access
Navigate to the admin panel:

- **Admin Dashboard**: http://localhost:5173/admin
- **Course Management**: http://localhost:5173/admin/courses
- **User Metrics**: http://localhost:5173/admin/users

## Testing

### Run Backend Tests
```bash
cd backend/api
pytest tests/test_admin.py -v
```

### Test Coverage
- Admin authentication decorator
- Dashboard statistics endpoint
- User management endpoints
- Course CRUD operations (Create, Update, Delete)

## API Endpoints

### Admin Dashboard Stats
```
GET /admin/dashboard/stats
Returns: Platform statistics, user growth, course performance
```

### User Management
```
GET /admin/users
Returns: List of all users with basic stats

GET /admin/users/:id
Returns: Detailed user statistics and activity
```

### Course Management
```
GET /admin/courses
Returns: All courses with admin metadata

POST /admin/courses
Body: { name, description, difficulty, summary, duration_min_minutes, duration_max_minutes, thumbnail_url }
Returns: Created course ID

PUT /admin/courses/:id
Body: Fields to update
Returns: Success message

DELETE /admin/courses/:id
Returns: Success message
```

## Security
- All admin endpoints require JWT authentication
- Admin role is checked via the `@admin_required` decorator
- Non-admin users receive 403 Forbidden responses
- All admin actions are logged in the `admin_logs` table

## Styling
The admin panel follows your existing design system:
- Tailwind CSS for styling
- Sky gradient theme (orange → red → purple → blue)
- Consistent with Dashboard and existing components
- Responsive design for mobile/tablet/desktop

## Pages

### Admin Dashboard
- Total users, active users, total courses stats
- User growth chart (last 30 days)
- Course performance table with completion rates
- Quick action buttons to Course and User Management

### Course Management
- Table view of all courses with metadata
- Add new course button with modal form
- Edit existing courses
- Delete courses with confirmation
- Success/error notifications

### User Metrics
- Table view of all users with basic stats
- Click user to view detailed metrics
- Individual user stats: courses, tutorials, quizzes, scores
- Weekly activity visualization
- Course progress breakdown

## Next Steps

1. Run the database migration
2. Promote your user to admin role
3. Start the backend server
4. Navigate to /admin in your browser
5. Run the tests to verify everything works

## Troubleshooting

**401 Unauthorized Errors:**
- Ensure you're logged in as an admin user
- Check that the `role` column was added to the users table
- Verify your user has `role='admin'` in the database

**Table Not Found Errors:**
- Make sure you ran `db_creation.sql` first
- Verify all tables exist: `user_tutorial_progress`, `user_quiz_results`, `course_prerequisites`

**Course Deletion Issues:**
- Courses with prerequisites will be cleaned up automatically
- All related user progress and requirements are deleted with the course

Enjoy your new admin panel!
