"""
SkyWise API

Flask REST API for managing user authentication and learning content.

Project Group: Flow State (Team 3)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import MySQLdb.cursors
import bcrypt
import os
from dotenv import load_dotenv
from datetime import timedelta
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load MySQL config from .env
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-me-in-env')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

mysql = MySQL(app)
jwt = JWTManager(app)

@app.route('/register', methods=['POST'])
def register():
    """
    Register a new user account.
    
    Expected JSON payload:
        {
            "username": "string",
            "email": "string", 
            "password": "string"
        }
    
    Returns:
        JSON response with success message and access/refresh tokens or error message
        
    Status codes:
        201 - User registered successfully
        400 - Missing required fields
        409 - User with email already exists
    """
    data = request.get_json()
    
    # Input validation
    if not data or not all(k in data for k in ("username", "email", "password")):
        return jsonify({'error': 'Missing required fields'}), 400
    
    username = data['username']
    email = data['email']
    password = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt()).decode()

    cursor = mysql.connection.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({'error': 'User with this email already exists'}), 409
    
    # Insert new user
    cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", (username, email, password))
    mysql.connection.commit()

    user_id = cursor.lastrowid
    cursor.close()

    access_token = create_access_token(identity=str(user_id))
    refresh_token = create_refresh_token(identity=str(user_id))

    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'refresh_token': refresh_token,
    }), 201

@app.route('/login', methods=['POST'])
def login():
    """
    Authenticate user login.
    
    Expected JSON payload:
        {
            "email": "string",
            "password": "string"
        }
    
    Returns:
        JSON response with user access and refresh tokens or error message
        
    Status codes:
        200 - Login successful, returns user data
        400 - Missing required fields
        401 - Invalid credentials
    """
    data = request.get_json()
    
    # Input validation
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({'error': 'Missing required fields'}), 400
    
    email = data['email']
    password = data['password']

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    cursor.close()

    if user and bcrypt.checkpw(password.encode(), user['password_hash'].encode()):
        access_token = create_access_token(identity=str(user['id']))
        refresh_token = create_refresh_token(identity=str(user['id']))
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_access_token():
    """
    Exchange a valid refresh token for a new access token.
    Returns:
        { "access_token": string }
    """
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=str(user_id))
    return jsonify({
        'access_token': new_access_token
    }), 200


@app.route('/user_details', methods=['GET'])
@jwt_required()
def user_details():
    """
    Return details for the current authenticated user using JWT identity.
    Response:
        { "id": number, "username": string, "email": string }
    """
    user_id = int(get_jwt_identity())
    
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user), 200


@app.route('/courses', methods=['GET'])
@jwt_required()
def get_courses():
    """
    Return all courses.
    """
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, name, description, course_type FROM courses")
    courses = cursor.fetchall()
    cursor.close()

    return jsonify(courses), 200


@app.route('/courses/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    """
    Return a single course by ID.
    """
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, name, description, course_type FROM courses WHERE id = %s", (course_id,))
    course = cursor.fetchone()
    cursor.close()

    if not course:
        return jsonify({'error': 'Course not found'}), 404

    return jsonify(course), 200


@app.route('/courses/<int:course_id>/tutorials', methods=['GET'])
@jwt_required()
def get_course_tutorials(course_id):
    """
    Return all tutorials for a course (uses indexed join).
    """
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT 
            t.id, 
            t.title, 
            t.description, 
            t.video_provider, 
            t.video_url, 
            t.category
        FROM course_tutorials AS ct
        INNER JOIN tutorials AS t ON ct.tutorial_id = t.id
        WHERE ct.course_id = %s
    """, (course_id,))
    tutorials = cursor.fetchall()
    cursor.close()
    return jsonify(tutorials), 200


@app.route('/tutorials/<int:tutorial_id>/quizzes', methods=['GET'])
@jwt_required()
def get_tutorial_quizzes(tutorial_id):
    """
    Return all quizzes for a tutorial.
    """
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT id, title 
        FROM quizzes 
        WHERE tutorial_id = %s
    """, (tutorial_id,))
    quizzes = cursor.fetchall()
    cursor.close()
    return jsonify(quizzes), 200


@app.route('/quizzes/<int:quiz_id>/questions', methods=['GET'])
@jwt_required()
def get_quiz_questions(quiz_id):
    """
    Return all questions for a quiz.
    """
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT id, question_text, question_order
        FROM quiz_questions
        WHERE quiz_id = %s
        ORDER BY question_order ASC
    """, (quiz_id,))
    questions = cursor.fetchall()
    cursor.close()
    return jsonify(questions), 200


@app.route('/quizzes/<int:quiz_id>/questions/<int:question_id>/options', methods=['GET'])
@jwt_required()
def get_question_options(quiz_id, question_id):
    """
    Return all options for a specific question belonging to a specific quiz.
    """
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT o.id, o.option_text
        FROM quiz_options AS o
        INNER JOIN quiz_questions AS q ON o.question_id = q.id
        WHERE q.quiz_id = %s AND q.id = %s
    """, (quiz_id, question_id))
    options = cursor.fetchall()
    cursor.close()

    if not options:
        return jsonify({'error': 'No options found for this question in this quiz'}), 404

    # Random shuffle the answer options
    random.shuffle(options)
    
    return jsonify(options), 200


@app.route('/quizzes/<int:quiz_id>/full', methods=['GET'])
@jwt_required()
def get_full_quiz(quiz_id):
    """
    Return a quiz with all its questions and options in a nested structure.
    """

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT 
            qz.id AS quiz_id,
            qz.title AS quiz_title,
            qq.id AS question_id,
            qq.question_text,
            qq.question_order,
            qo.id AS option_id,
            qo.option_text,
            qo.is_correct
        FROM quizzes AS qz
        LEFT JOIN quiz_questions AS qq ON qq.quiz_id = qz.id
        LEFT JOIN quiz_options AS qo ON qo.question_id = qq.id
        WHERE qz.id = %s
        ORDER BY qq.question_order ASC, qo.id ASC
    """, (quiz_id,))
    rows = cursor.fetchall()
    cursor.close()

    if not rows:
        return jsonify({'error': 'Quiz not found'}), 404

    quiz_data = {
        'id': rows[0]['quiz_id'],
        'title': rows[0]['quiz_title'],
        'questions': []
    }

    question_map = {}
    for row in rows:
        if not row['question_id']:
            continue

        qid = row['question_id']
        if qid not in question_map:
            question_map[qid] = {
                'id': qid,
                'question_text': row['question_text'],
                'order': row['question_order'],
                'options': []
            }
            quiz_data['questions'].append(question_map[qid])

        if row['option_id']:
            question_map[qid]['options'].append({
                'id': row['option_id'],
                'text': row['option_text'],
                'is_correct': bool(row['is_correct'])
            })
    
    # Random shuffle the answer options for each question
    for question in quiz_data['questions']:
        random.shuffle(question['options'])

    return jsonify(quiz_data), 200



if __name__ == '__main__':
    app.run(debug=True)