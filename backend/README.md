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

1. **Navigate to the API directory**
   ```bash
   cd api
   ```

2. **Start the Flask development server**
   ```bash
   python app.py
   ```

3. **The API will be available at:**
   ```
   http://localhost:5000
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

### POST /token/refresh
Get a new access token using a valid refresh token.

**Headers:**
- `Authorization: Bearer <REFRESH_TOKEN>`

**Response:**
- `200` - `{ "access_token": string }`
- `401` - Unauthorized / invalid token

**Example:**
```bash
curl -X POST http://localhost:5000/token/refresh \
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
