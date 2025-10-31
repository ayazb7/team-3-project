import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture()
def auth_headers(client):
    with client.application.app_context():
        token = create_access_token(identity="123")
    return {"Authorization": f"Bearer {token}"}


def test_get_dashboard_stats_success(client, mock_mysql, auth_headers):
    """
    Test successful retrieval of dashboard statistics.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        {'courses_completed': 3}, 
        {'tutorials_watched': 15}, 
        {'tutorials_completed_this_week': 6},
    ]
    
    cursor.fetchall.return_value = [
        {'day_name': 'Monday'},
        {'day_name': 'Wednesday'},
        {'day_name': 'Friday'},
    ]

    response = client.get('/dashboard/stats', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['courses_completed'] == 3
    assert body['tutorials_watched'] == 15
    assert abs(body['time_spent_hours'] - 0.5) < 0.01  
    assert 'weekly_activity' in body
    assert isinstance(body['weekly_activity'], dict)
    
    assert body['weekly_activity']['MO'] is True
    assert body['weekly_activity']['TU'] is False
    assert body['weekly_activity']['WE'] is True
    assert body['weekly_activity']['TH'] is False
    assert body['weekly_activity']['FR'] is True
    assert body['weekly_activity']['SA'] is False
    assert body['weekly_activity']['SU'] is False
    
    cursor.close.assert_called_once()


def test_get_dashboard_stats_no_activity(client, mock_mysql, auth_headers):
    """
    Test dashboard stats when user has no activity.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        {'courses_completed': 0},
        {'tutorials_watched': 0},
        {'tutorials_completed_this_week': 0},
    ]
    
    cursor.fetchall.return_value = []

    response = client.get('/dashboard/stats', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['courses_completed'] == 0
    assert body['tutorials_watched'] == 0
    assert abs(body['time_spent_hours'] - 0.0) < 0.01
    assert 'weekly_activity' in body
    
    for day in ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']:
        assert body['weekly_activity'][day] is False
    
    cursor.close.assert_called_once()


def test_get_dashboard_stats_all_days_active(client, mock_mysql, auth_headers):
    """
    Test dashboard stats when user is active every day of the week.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        {'courses_completed': 5},
        {'tutorials_watched': 20},
        {'tutorials_completed_this_week': 10},
    ]
    
    cursor.fetchall.return_value = [
        {'day_name': 'Monday'},
        {'day_name': 'Tuesday'},
        {'day_name': 'Wednesday'},
        {'day_name': 'Thursday'},
        {'day_name': 'Friday'},
        {'day_name': 'Saturday'},
        {'day_name': 'Sunday'},
    ]

    response = client.get('/dashboard/stats', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['courses_completed'] == 5
    assert body['tutorials_watched'] == 20
    assert body['time_spent_hours'] == round(10 * 5 / 60, 1)
    
    for day in ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']:
        assert body['weekly_activity'][day] is True
    
    cursor.close.assert_called_once()


def test_get_dashboard_stats_missing_token(client):
    """
    Test that endpoint requires authentication.
    """
    response = client.get('/dashboard/stats')
    
    assert response.status_code == 401


def test_get_dashboard_stats_invalid_token(client):
    """
    Test with an invalid JWT token.
    """
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get('/dashboard/stats', headers=headers)
    
    assert response.status_code == 422


def test_get_dashboard_stats_null_results(client, mock_mysql, auth_headers):
    """
    Test dashboard stats when database returns None for counts.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        None, 
        None, 
        None,
    ]
    
    cursor.fetchall.return_value = []

    response = client.get('/dashboard/stats', headers=auth_headers)
    body = response.get_json()

    assert response.status_code == 200
    assert body['courses_completed'] == 0
    assert body['tutorials_watched'] == 0
    assert abs(body['time_spent_hours'] - 0.0) < 0.01

