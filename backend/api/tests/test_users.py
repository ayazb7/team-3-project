import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture()
def auth_headers(client):
    with client.application.app_context():
        token = create_access_token(identity="42")
    return {"Authorization": f"Bearer {token}"}


def test_user_details_success(client, mock_mysql, auth_headers):
    """
    Test successful retrieval of user details for authenticated user.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = {
        'id': 42,
        'username': 'testuser',
        'email': 'testuser@example.com'
    }

    response = client.get('/user_details', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['id'] == 42
    assert body['username'] == 'testuser'
    assert body['email'] == 'testuser@example.com'
    assert set(body.keys()) == {'id', 'username', 'email'}
    cursor.close.assert_called_once()


def test_user_details_not_found(client, mock_mysql, auth_headers):
    """
    Test when user is not found in the database (edge case).
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None

    response = client.get('/user_details', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 404
    assert body['error'] == 'User not found'
    cursor.close.assert_called_once()


def test_user_details_missing_token(client):
    """
    Test that endpoint requires authentication.
    """
    response = client.get('/user_details')
    
    assert response.status_code == 401


def test_user_details_invalid_token(client):
    """
    Test with an invalid JWT token.
    """
    headers = {"Authorization": "Bearer invalid_token_here"}
    response = client.get('/user_details', headers=headers)
    
    assert response.status_code == 422

