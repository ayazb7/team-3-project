import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture()
def auth_headers(client):
    with client.application.app_context():
        token = create_access_token(identity="456")
    return {"Authorization": f"Bearer {token}"}


def test_get_tutorials_success(client, mock_mysql, auth_headers):
    """
    Test successful retrieval of all tutorials.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {
            'id': 1,
            'title': 'Introduction to Passwords',
            'description': 'Learn about password security',
            'category': 'security',
            'video_provider': 'youtube',
            'video_url': 'https://youtube.com/watch?v=abc123',
            'course_id': 1,
            'created_at': '2024-01-01 10:00:00'
        },
        {
            'id': 2,
            'title': 'Email Safety',
            'description': 'Learn about email security',
            'category': 'email',
            'video_provider': 'synthesia',
            'video_url': 'https://share.synthesia.io/xyz',
            'course_id': 1,
            'created_at': '2024-01-02 10:00:00'
        }
    ]

    response = client.get('/tutorials', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert isinstance(body, list)
    assert len(body) == 2
    assert body[0]['id'] == 1
    assert body[0]['title'] == 'Introduction to Passwords'
    assert body[1]['id'] == 2
    cursor.close.assert_called_once()


def test_get_tutorials_empty(client, mock_mysql, auth_headers):
    """
    Test when no tutorials exist.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    response = client.get('/tutorials', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body == []
    cursor.close.assert_called_once()


def test_get_tutorials_missing_token(client):
    """
    Test that endpoint requires authentication.
    """
    response = client.get('/tutorials')
    
    assert response.status_code == 401


def test_complete_tutorial_success(client, mock_mysql, auth_headers):
    """
    Test successfully completing a tutorial for the first time.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        None, 
        {'course_id': 1}, 
        {'count': 5}, 
        {'count': 5}, 
        {'count': 1},  
        {'count': 0},  
    ]

    response = client.post('/tutorials/1/complete', 
                          json={'feedback': 'positive'}, 
                          headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['message'] == 'Tutorial completed successfully'
    assert 'course_progress' in body
    assert abs(body['course_progress'] - 10.0) < 0.01
    mock_mysql.connection.commit.assert_called_once()
    cursor.close.assert_called_once()


def test_complete_tutorial_already_completed(client, mock_mysql, auth_headers):
    """
    Test attempting to complete an already completed tutorial.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = {'completed': True}

    response = client.post('/tutorials/1/complete', 
                          json={'feedback': 'positive'}, 
                          headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 400
    assert 'already marked as completed' in body['message']
    cursor.close.assert_called_once()
    mock_mysql.connection.commit.assert_not_called()


def test_complete_tutorial_no_course_associated(client, mock_mysql, auth_headers):
    """
    Test completing a tutorial that has no associated course.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.side_effect = [
        None, 
        None, 
    ]

    response = client.post('/tutorials/1/complete', 
                          json={'feedback': 'positive'}, 
                          headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 404
    assert body['error'] == 'No course associated with this tutorial'
    cursor.close.assert_called_once()


def test_complete_tutorial_negative_feedback(client, mock_mysql, auth_headers):
    """
    Test completing a tutorial with negative feedback.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        None,
        {'course_id': 1}, 
        {'count': 3}, 
        {'count': 3},  
        {'count': 2},  
        {'count': 1},  
    ]

    response = client.post('/tutorials/1/complete', 
                          json={'feedback': 'negative'}, 
                          headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['message'] == 'Tutorial completed successfully'
    assert abs(body['course_progress'] - 50.0) < 0.01 


def test_complete_tutorial_no_feedback(client, mock_mysql, auth_headers):
    """
    Test completing a tutorial without providing feedback (should work).
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        None,  
        {'course_id': 1}, 
        {'count': 2}, 
        {'count': 2},  
        {'count': 1}, 
        {'count': 1}, 
    ]

    response = client.post('/tutorials/1/complete', 
                          json={}, 
                          headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['message'] == 'Tutorial completed successfully'


def test_complete_tutorial_missing_token(client):
    """
    Test that endpoint requires authentication.
    """
    response = client.post('/tutorials/1/complete', json={'feedback': 'positive'})
    
    assert response.status_code == 401


def test_complete_tutorial_update_existing_incomplete(client, mock_mysql, auth_headers):
    """
    Test completing a tutorial when an incomplete record exists.
    """
    cursor = mock_mysql.connection.cursor.return_value

    cursor.fetchone.side_effect = [
        {'completed': False},
        {'course_id': 1},
        {'count': 4},
        {'count': 4},
        {'count': 3},
        {'count': 2},
    ]

    response = client.post('/tutorials/1/complete',
                          json={'feedback': 'positive'},
                          headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['message'] == 'Tutorial completed successfully'
    assert abs(body['course_progress'] - 62.5) < 0.01
    mock_mysql.connection.commit.assert_called_once()


# =============================================================
# FEEDBACK ENDPOINT TESTS
# =============================================================

def test_submit_feedback_success(client, mock_mysql, auth_headers):
    """Test successful feedback submission"""
    cursor = mock_mysql.connection.cursor.return_value

    response = client.post(
        '/tutorials/2/feedback',
        json={'feedback_type': 'positive'},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Feedback submitted successfully'
    assert data['feedback'] == 'positive'
    mock_mysql.connection.commit.assert_called_once()
    cursor.close.assert_called()


def test_submit_feedback_negative(client, mock_mysql, auth_headers):
    """Test submitting negative feedback"""
    cursor = mock_mysql.connection.cursor.return_value

    response = client.post(
        '/tutorials/2/feedback',
        json={'feedback_type': 'negative'},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Feedback submitted successfully'
    assert data['feedback'] == 'negative'


def test_submit_feedback_update_existing(client, mock_mysql, auth_headers):
    """Test updating existing feedback"""
    cursor = mock_mysql.connection.cursor.return_value

    response = client.post(
        '/tutorials/2/feedback',
        json={'feedback_type': 'positive'},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Feedback submitted successfully'
    assert data['feedback'] == 'positive'
    mock_mysql.connection.commit.assert_called_once()


def test_submit_feedback_invalid_type(client, mock_mysql, auth_headers):
    """Test submitting feedback with invalid type"""
    response = client.post(
        '/tutorials/2/feedback',
        json={'feedback_type': 'invalid'},
        headers=auth_headers
    )

    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'Invalid feedback type' in data['error']


def test_submit_feedback_missing_type(client, mock_mysql, auth_headers):
    """Test submitting feedback without feedback_type"""
    response = client.post(
        '/tutorials/2/feedback',
        json={},
        headers=auth_headers
    )

    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'feedback_type is required' in data['error']


def test_submit_feedback_unauthorized(client, mock_mysql):
    """Test submitting feedback without authentication"""
    response = client.post(
        '/tutorials/2/feedback',
        json={'feedback_type': 'positive'}
    )

    # Should return 401 Unauthorized (JWT required)
    assert response.status_code == 401


def test_submit_feedback_allows_without_completion(client, mock_mysql, auth_headers):
    """Test that feedback can be submitted without completing tutorial"""
    cursor = mock_mysql.connection.cursor.return_value

    response = client.post(
        '/tutorials/2/feedback',
        json={'feedback_type': 'positive'},
        headers=auth_headers
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Feedback submitted successfully'
    # Should not affect completion status
    mock_mysql.connection.commit.assert_called_once()

