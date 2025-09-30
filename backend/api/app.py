"""
SkyWise API

Flask REST API for managing user authentication and learning content.

Project Group: Flow State (Team 3)
"""

from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Load MySQL config from .env
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

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
        JSON response with success message or error message
        
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
    password = hashlib.sha256(data['password'].encode()).hexdigest()

    cursor = mysql.connection.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({'error': 'User with this email already exists'}), 409
    
    # Insert new user
    cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", (username, email, password))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'User registered successfully'}), 201

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
        JSON response with user data or error message
        
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
    password = hashlib.sha256(data['password'].encode()).hexdigest()

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s AND password_hash = %s", (email, password))
    user = cursor.fetchone()
    
    # Remove password hash from response for security
    if user:
        user.pop('password_hash', None)
    
    cursor.close()

    if user:
        return jsonify({'message': 'Login successful', 'user': user}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True)