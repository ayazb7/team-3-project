import pytest
import bcrypt

def test_register_missing_fields(client):
    response = client.post('/register', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Missing or empty required fields'


def test_register_existing_email(client, mock_mysql):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = (1,) 

    response = client.post(
        '/register',
        json={'username': 'alice', 'email': 'alice@example.com', 'password': 'password'}
    )

    assert response.status_code == 409
    assert response.get_json()['error'] == 'User with this email already exists'
    cursor.close.assert_called_once()


def test_register_success(client, mock_mysql):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None
    cursor.lastrowid = 42

    response = client.post(
        '/register',
        json={'username': 'bob', 'email': 'bob@example.com', 'password': 'password123'}
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'User registered successfully'
    assert 'access_token' in data and 'refresh_token' in data
    mock_mysql.connection.commit.assert_called_once()
    cursor.close.assert_called()


def test_register_empty_fields(client):
    # Test with empty strings for username, email, and password
    response = client.post('/register', json={
        'username': '',
        'email': '',
        'password': ''
    })
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Missing or empty required fields'

    # Test with whitespace-only strings
    response = client.post('/register', json={
        'username': '   ',
        'email': '   ',
        'password': '   '
    })
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Missing or empty required fields'
    

def test_login_missing_fields(client):
    response = client.post('/login', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Missing required fields'


def test_login_invalid_email(client, mock_mysql):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None  

    response = client.post('/login', json={'email': 'bob@example.com', 'password': 'password'})

    assert response.status_code == 401
    assert response.get_json()['message'] == 'Invalid credentials'
    cursor.close.assert_called_once()

def test_login_invalid_password(client, mock_mysql):
    cursor = mock_mysql.connection.cursor.return_value
    stored_hash = bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode()
    cursor.fetchone.return_value = {
        'id': 2,
        'username': 'bob',
        'email': 'bob@example.com',
        'password_hash': stored_hash,
    }

    response = client.post('/login', json={'email': 'bob@example.com', 'password': 'wrongpassword'})

    assert response.status_code == 401
    assert response.get_json()['message'] == 'Invalid credentials'
    cursor.close.assert_called_once()


def test_login_success(client, mock_mysql):
    cursor = mock_mysql.connection.cursor.return_value
    stored_hash = bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode()
    cursor.fetchone.return_value = {
        'id': 1,
        'username': 'john',
        'email': 'john@example.com',
        'password_hash': stored_hash,
    }

    response = client.post('/login', json={'email': 'john@example.com', 'password': 'password123'})

    assert response.status_code == 200
    body = response.get_json()
    assert body['message'] == 'Login successful'
    assert 'access_token' in body and 'refresh_token' in body
    cursor.close.assert_called_once()


def test_refresh_access_token_success(client):
    """
    Test that a valid refresh token can be exchanged for a new access token.
    """
    from flask_jwt_extended import create_refresh_token
    
    with client.application.app_context():
        refresh_token = create_refresh_token(identity="123")
    
    headers = {"Authorization": f"Bearer {refresh_token}"}
    response = client.get('/refresh', headers=headers)
    
    assert response.status_code == 200
    body = response.get_json()
    assert 'access_token' in body
    assert isinstance(body['access_token'], str)


def test_refresh_access_token_missing_token(client):
    """
    Test that refresh endpoint requires a valid refresh token.
    """
    response = client.get('/refresh')
    
    assert response.status_code == 401


def test_refresh_access_token_with_access_token(client):
    """
    Test that using an access token instead of a refresh token fails.
    """
    from flask_jwt_extended import create_access_token
    
    with client.application.app_context():
        access_token = create_access_token(identity="123")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get('/refresh', headers=headers)
    
    assert response.status_code == 422


