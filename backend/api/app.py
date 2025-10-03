"""
SkyWise API

Flask REST API for managing user authentication and learning content.

Project Group: Flow State (Team 3)
"""

from flask import Flask, request, jsonify
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

load_dotenv()

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)