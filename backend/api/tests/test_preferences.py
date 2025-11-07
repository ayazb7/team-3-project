import pytest
import json
from flask_jwt_extended import create_access_token


@pytest.fixture()
def auth_headers(client):
    with client.application.app_context():
        token = create_access_token(identity="42")
    return {"Authorization": f"Bearer {token}"}


def test_get_preferences_no_preferences_set(client, mock_mysql, auth_headers):
    """Test getting preferences when none are set."""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None 
    
    response = client.get('/preferences', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'preferences' in data
    assert data['preferences'] == {}
    cursor.close.assert_called_once()

def test_save_preferences(client, mock_mysql, auth_headers):
    """Test saving user preferences."""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None 
    
    preferences = {
        "fontSize": 120
    }
    
    response = client.post(
        '/preferences',
        headers=auth_headers,
        data=json.dumps({'preferences': preferences}),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Preferences saved successfully'
    mock_mysql.connection.commit.assert_called_once()
    cursor.close.assert_called_once()

def test_get_preferences_after_save(client, mock_mysql, auth_headers):
    """Test getting preferences after saving."""
    cursor = mock_mysql.connection.cursor.return_value
    
    preferences = {
        "fontSize": 120
    }
    
    cursor.fetchone.return_value = None
    
    client.post(
        '/preferences',
        headers=auth_headers,
        data=json.dumps({'preferences': preferences}),
        content_type='application/json'
    )
    
    cursor.fetchone.return_value = {'preferences': json.dumps(preferences)}
    
    response = client.get('/preferences', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['preferences'] == preferences

def test_update_preferences(client, mock_mysql, auth_headers):
    """Test updating existing preferences."""
    cursor = mock_mysql.connection.cursor.return_value
    
    initial_preferences = {
        "fontSize": 100
    }
    
    cursor.fetchone.return_value = None
    
    client.post(
        '/preferences',
        headers=auth_headers,
        data=json.dumps({'preferences': initial_preferences}),
        content_type='application/json'
    )
    
    updated_preferences = {
        "fontSize": 150
    }
    
    cursor.fetchone.return_value = {'id': 1}
    
    response = client.post(
        '/preferences',
        headers=auth_headers,
        data=json.dumps({'preferences': updated_preferences}),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    
    cursor.fetchone.return_value = {'preferences': json.dumps(updated_preferences)}
    
    response = client.get('/preferences', headers=auth_headers)
    data = json.loads(response.data)
    assert data['preferences'] == updated_preferences

def test_save_preferences_invalid_data(client, mock_mysql, auth_headers):
    """Test saving preferences with invalid data."""
    response = client.post(
        '/preferences',
        headers=auth_headers,
        data=json.dumps({}),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert data['error'] == 'Preferences data required'

def test_reset_preferences(client, mock_mysql, auth_headers):
    """Test resetting preferences."""
    cursor = mock_mysql.connection.cursor.return_value
    
    preferences = {
        "fontSize": 120
    }
    
    cursor.fetchone.return_value = None
    
    client.post(
        '/preferences',
        headers=auth_headers,
        data=json.dumps({'preferences': preferences}),
        content_type='application/json'
    )
    
    response = client.post('/preferences/reset', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Preferences reset successfully'
    mock_mysql.connection.commit.assert_called()
    
    cursor.fetchone.return_value = None
    
    response = client.get('/preferences', headers=auth_headers)
    data = json.loads(response.data)
    assert data['preferences'] == {}

def test_preferences_unauthorized(client):
    """Test accessing preferences without authentication."""
    response = client.get('/preferences')
    assert response.status_code == 401
    
    response = client.post(
        '/preferences',
        data=json.dumps({'preferences': {}}),
        content_type='application/json'
    )
    assert response.status_code == 401
    
    response = client.post('/preferences/reset')
    assert response.status_code == 401

