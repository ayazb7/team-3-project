import pytest

def test_register_missing_fields(client):
    response = client.post('/register', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Missing required fields'


def test_register_existing_email(client, mock_mysql, mocker):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = (1,) 

    response = client.post(
        '/register',
        json={'username': 'alice', 'email': 'alice@example.com', 'password': 'pw'}
    )

    assert response.status_code == 409
    assert response.get_json()['error'] == 'User with this email already exists'
    cursor.close.assert_called_once()


def test_register_success(client, mock_mysql, mocker):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None
    cursor.lastrowid = 42

    response = client.post(
        '/register',
        json={'username': 'bob', 'email': 'bob@example.com', 'password': 'secret'}
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'User registered successfully'
    assert 'access_token' in data and 'refresh_token' in data
    mock_mysql.connection.commit.assert_called_once()
    cursor.close.assert_called()


def test_login_missing_fields(client):
    response = client.post('/login', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Missing required fields'


def test_login_invalid_credentials(client, mock_mysql, mocker):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None  

    response = client.post('/login', json={'email': 'x@example.com', 'password': 'nope'})

    assert response.status_code == 401
    assert response.get_json()['message'] == 'Invalid credentials'
    cursor.close.assert_called_once()


def test_login_success(client, mock_mysql, mocker):
    cursor = mock_mysql.connection.cursor.return_value
    import bcrypt
    stored_hash = bcrypt.hashpw(b'ok', bcrypt.gensalt()).decode()
    cursor.fetchone.return_value = {
        'id': 1,
        'username': 'john',
        'email': 'john@example.com',
        'password_hash': stored_hash,
    }

    response = client.post('/login', json={'email': 'john@example.com', 'password': 'ok'})

    assert response.status_code == 200
    body = response.get_json()
    assert body['message'] == 'Login successful'
    assert 'access_token' in body and 'refresh_token' in body
    cursor.close.assert_called_once()


