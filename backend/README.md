# SkyWise API

Flask REST API for managing user authentication and learning content for the SkyWise learning platform.

**Project Group:** Flow State (Team 3)

## Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

## Installation

1. **Navigate to the API directory**
   ```bash
   cd api
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the `api/` directory:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DB=skywise_db
   JWT_SECRET_KEY=your_random_secret_string
   ```

   Generate a strong secret:
   ```bash
   # from backend/api
   python scripts/generate_token.py 64
   # copy the output into JWT_SECRET_KEY in .env
   ```

5. **Navigate to the Database directory** (optional if DB already exists)
   ```bash
   cd ..
   cd database
   ```

6. **Set up the database**
   ```bash
   mysql -u root -p < database/db_creation.sql
   ```

## Running the Application

1. **Start the Flask server**
   ```bash
   # from backend/api/ folder
   python app.py              
   ```

2. **The API will be available at:**
   ```
   http://localhost:5000
   ```

## Project Structure

```
backend/
  api/
    app.py              # Main Flask app definition script and blueprint route registration
    config.py           # To define environment-specific settings (dev/prod) and get MYSQL/JWT env variables
    extensions.py       # CORS, MySQL, JWT initialization
    routes/
      auth.py           # /register, /login, /refresh
      users.py          # /user_details
      courses.py        # /courses and course tutorials
      quizzes.py        # quiz and question endpoints
    scripts/
      generate_token.py # helper to generate JWT secret
    tests/
      test_auth.py      # example tests
```

Most content endpoints require a valid JWT access token, so for these include auth bearer token from login/register/refresh endpoints:

```
Authorization: Bearer <ACCESS_TOKEN>
```

## API Endpoints

### POST /register
Register a new user account.

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

**Response:**
- `201` - `{ "message": "User registered successfully", "access_token": string, "refresh_token": string }`
- `400` - `{"error": "Missing required fields"}`
- `409` - `{"error": "User with this email already exists"}`

**Example:**
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### POST /login
Authenticate user login.

**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```

**Response:**
- `200` - `{ "message": "Login successful", "access_token": string, "refresh_token": string }`
- `400` - `{"error": "Missing required fields"}`
- `401` - `{"message": "Invalid credentials"}`

**Example:**
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### GET /refresh
Get a new access token using a valid refresh token.

**Headers:**
- `Authorization: Bearer <REFRESH_TOKEN>`

**Response:**
- `200` - `{ "access_token": string }`
- `401` - Unauthorized / invalid token

**Example:**
```bash
curl -X GET http://localhost:5000/refresh \
  -H "Authorization: Bearer <REFRESH_TOKEN>"
```

### GET /user_details
Return current user details for the authenticated user.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` - `{ "id": number, "username": string, "email": string }`
- `401` - Unauthorized / invalid token
- `404` - User not found

**Example:**
```bash
curl -s http://localhost:5000/user_details \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### GET /courses
List all courses. Requires access token.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` - `[{ "id": number, "name": string, "description": string, "course_type": string }]`

**Example:**
```bash
curl -s http://localhost:5000/courses \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### GET `/courses/{course_id}`
Get a single course by id.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` - `{ "id": number, "name": string, "description": string, "course_type": string }`
- `404` - `{"error": "Course not found"}`

**Example:**
```bash
curl -s http://localhost:5000/courses/1 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### GET `/courses/{course_id}/tutorials`
List tutorials for a course.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` - `[{ "id": number, "title": string, "description": string, "video_provider": string, "video_url": string, "category": string }]`

**Example:**
```bash
curl -s http://localhost:5000/courses/1/tutorials \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### GET `/tutorials/{tutorial_id}/quizzes`
List quizzes for a tutorial.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` - `[{ "id": number, "title": string }]`

**Example:**
```bash
curl -s http://localhost:5000/tutorials/1/quizzes \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### GET `/quizzes/{quiz_id}/questions`
List questions for a quiz (ordered).

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` - `[{ "id": number, "question_text": string, "question_order": number }]`

**Example:**
```bash
curl -s http://localhost:5000/quizzes/1/questions \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### GET `/quizzes/{quiz_id}/questions/{question_id}/options`
List options for a specific question in a quiz.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` - `[{ "id": number, "option_text": string }]`
- `404` - `{"error": "No options found for this question in this quiz"}`

**Example:**
```bash
curl -s http://localhost:5000/quizzes/1/questions/2/options \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### GET `/quizzes/{quiz_id}/full`
Return the full quiz with questions and shuffled options.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>`

**Response:**
- `200` -
  ```json
  {
    "id": number,
    "title": string,
    "questions": [
      {
        "id": number,
        "question_text": string,
        "order": number,
        "options": [
          { "id": number, "text": string, "is_correct": boolean }
        ]
      }
    ]
  }
  ```
- `404` - `{"error": "Quiz not found"}`

**Example:**
```bash
curl -s http://localhost:5000/quizzes/1/full \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```