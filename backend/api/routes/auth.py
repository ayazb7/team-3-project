from flask import Blueprint, request, jsonify
import bcrypt
import MySQLdb.cursors
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)

import app

bp = Blueprint('auth', __name__, url_prefix='')

@bp.route('/register', methods=['POST'])
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
        400 - Missing or empty required fields
        409 - User with email already exists
    """
    data = request.get_json()
    
    required_fields = ("username", "email", "password")
    if not data or not all(k in data and data[k] and str(data[k]).strip() for k in required_fields):
        return jsonify({'error': 'Missing or empty required fields'}), 400

    username = data['username']
    email = data['email']
    password = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt()).decode()

    cursor = app.mysql.connection.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({'error': 'User with this email already exists'}), 409

    cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", (username, email, password))
    app.mysql.connection.commit()
    user_id = cursor.lastrowid
    cursor.close()

    access_token = create_access_token(identity=str(user_id))
    refresh_token = create_refresh_token(identity=str(user_id))
    return jsonify({'message': 'User registered successfully', 'access_token': access_token, 'refresh_token': refresh_token}), 201


@bp.route('/login', methods=['POST'])
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
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({'error': 'Missing required fields'}), 400

    email = data['email']
    password = data['password']

    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if user and bcrypt.checkpw(password.encode(), user['password_hash'].encode()):
        access_token = create_access_token(identity=str(user['id']))
        refresh_token = create_refresh_token(identity=str(user['id']))
        return jsonify({'message': 'Login successful', 'access_token': access_token, 'refresh_token': refresh_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@bp.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh_access_token():
    """
    Exchange a valid refresh token for a new access token.

    Returns:
        { "access_token": string }
    """
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=str(user_id))
    return jsonify({'access_token': new_access_token}), 200

