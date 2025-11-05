import pytest
from flask_jwt_extended import create_access_token


def test_admin_dashboard_stats_no_token(client):
    """Test that admin endpoint requires authentication"""
    response = client.get('/admin/dashboard/stats')
    assert response.status_code == 401
    assert 'error' in response.get_json()


def test_admin_dashboard_stats_non_admin_user(client, mock_mysql):
    """Test that non-admin users cannot access admin endpoints"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = ('user',)  # role = 'user'

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get('/admin/dashboard/stats', headers=headers)

    assert response.status_code == 403
    assert response.get_json()['error'] == 'Admin access required'


def test_admin_dashboard_stats_success(client, mock_mysql):
    """Test admin can access dashboard stats"""
    cursor = mock_mysql.connection.cursor.return_value

    # Mock role check
    cursor.fetchone.side_effect = [
        ('admin',),  # role check
        (100,),      # total_users
        (50,),       # active_users
        (10,),       # total_courses
        (150,),      # total_tutorials
        (75.5,),     # avg_completion
        [],          # user_growth
        []           # course_stats
    ]

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get('/admin/dashboard/stats', headers=headers)

    assert response.status_code == 200
    data = response.get_json()
    assert data['total_users'] == 100
    assert data['active_users'] == 50
    assert data['total_courses'] == 10
    assert data['total_tutorials'] == 150


def test_create_course_success(client, mock_mysql):
    """Test admin can create a new course"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = ('admin',)  # role check
    cursor.lastrowid = 123

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    course_data = {
        'name': 'Python Basics',
        'description': 'Learn Python programming',
        'difficulty': 'Beginner',
        'duration_min_minutes': 120
    }

    response = client.post('/admin/courses', json=course_data, headers=headers)

    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Course created successfully'
    assert data['course_id'] == 123
    mock_mysql.connection.commit.assert_called()


def test_create_course_missing_name(client, mock_mysql):
    """Test course creation fails without name"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = ('admin',)

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.post('/admin/courses', json={}, headers=headers)

    assert response.status_code == 400
    assert 'error' in response.get_json()


def test_update_course_success(client, mock_mysql):
    """Test admin can update a course"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.side_effect = [
        ('admin',),          # role check
        ('Python Basics',)   # course exists
    ]

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    update_data = {'name': 'Advanced Python'}

    response = client.put('/admin/courses/1', json=update_data, headers=headers)

    assert response.status_code == 200
    assert response.get_json()['message'] == 'Course updated successfully'


def test_update_course_not_found(client, mock_mysql):
    """Test updating non-existent course returns 404"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.side_effect = [
        ('admin',),  # role check
        None         # course doesn't exist
    ]

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.put('/admin/courses/999', json={'name': 'Test'}, headers=headers)

    assert response.status_code == 404


def test_delete_course_success(client, mock_mysql):
    """Test admin can delete a course"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.side_effect = [
        ('admin',),          # role check
        ('Python Basics',)   # course exists
    ]

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.delete('/admin/courses/1', headers=headers)

    assert response.status_code == 200
    assert response.get_json()['message'] == 'Course deleted successfully'
    mock_mysql.connection.commit.assert_called()


def test_get_all_users_success(client, mock_mysql):
    """Test admin can retrieve all users with stats"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = ('admin',)  # role check
    cursor.fetchall.return_value = [
        (1, 'alice', 'alice@example.com', 'user', '2024-01-01', 3, 15, 75.5),
        (2, 'bob', 'bob@example.com', 'user', '2024-01-02', 2, 10, 50.0)
    ]

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get('/admin/users', headers=headers)

    assert response.status_code == 200
    users = response.get_json()
    assert len(users) == 2
    assert users[0]['username'] == 'alice'
    assert users[0]['courses_enrolled'] == 3


def test_get_user_details_success(client, mock_mysql):
    """Test admin can get detailed user stats"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.side_effect = [
        ('admin',),  # role check
        (1, 'alice', 'alice@example.com', 'user', 'English', '2024-01-01'),  # user info
        (3,),   # courses_enrolled
        (2,),   # courses_completed
        (15,),  # tutorials_watched
        (10,),  # quizzes_submitted
        (85.5,) # avg_quiz_score
    ]
    cursor.fetchall.side_effect = [
        [],  # weekly_activity
        []   # course_progress
    ]

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get('/admin/users/1', headers=headers)

    assert response.status_code == 200
    data = response.get_json()
    assert data['user']['username'] == 'alice'
    assert data['stats']['courses_enrolled'] == 3
    assert data['stats']['avg_quiz_score'] == 85.5


def test_get_user_details_not_found(client, mock_mysql):
    """Test getting details for non-existent user returns 404"""
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.side_effect = [
        ('admin',),  # role check
        None         # user doesn't exist
    ]

    with client.application.app_context():
        token = create_access_token(identity=1)

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get('/admin/users/999', headers=headers)

    assert response.status_code == 404
