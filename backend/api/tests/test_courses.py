import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture()
def auth_headers(client):
    with client.application.app_context():
        token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {token}"}


def test_get_courses_success(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"id": 1, "name": "Cybersecurity Basics",
            "description": "Learn password safety", "course_type": "video"},
        {"id": 2, "name": "Phishing Awareness",
            "description": "Detect and prevent phishing", "course_type": "text"},
    ]

    res = client.get("/courses", headers=auth_headers)

    assert res.status_code == 200
    body = res.get_json()

    assert isinstance(body, list)
    assert len(body) == 2

    course = body[0]
    assert set(course.keys()) == {"id", "name", "description", "course_type"}
    assert course["id"] == 1
    assert course["name"] == "Cybersecurity Basics"
    assert course["course_type"] == "video"

    cursor.close.assert_called_once()


def test_get_course_success(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = {
        "id": 5,
        "name": "Network Fundamentals",
        "description": "Learn about routers and switches",
        "course_type": "video",
    }

    res = client.get("/courses/5", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, dict)
    assert body["id"] == 5
    assert body["name"] == "Network Fundamentals"
    assert body["description"] == "Learn about routers and switches"
    assert body["course_type"] == "video"

    cursor.close.assert_called_once()


def test_get_course_not_found(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None

    res = client.get("/courses/999", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 404
    assert body == {"error": "Course not found"}
    cursor.close.assert_called_once()


def test_get_course_tutorials_success(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {
            "id": 10,
            "title": "Introduction to Passwords",
            "description": "Learn about password complexity",
            "video_provider": "youtube",
            "video_url": "https://youtube.com/watch?v=abc123",
            "category": "security",
        },
        {
            "id": 11,
            "title": "Advanced Security",
            "description": "Deep dive into best practices",
            "video_provider": "synthesia",
            "video_url": "https://share.synthesia.io/xyz",
            "category": "advanced",
        },
    ]

    res = client.get("/courses/5/tutorials", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, list)
    assert len(body) == 2

    tutorial = body[0]
    assert set(tutorial.keys()) == {
        "id", "title", "description", "video_provider", "video_url", "category"}
    assert tutorial["video_provider"] in ("youtube", "synthesia")
    assert tutorial["category"] == "security"

    assert body[0]["id"] == 10
    assert body[1]["id"] == 11

    cursor.close.assert_called_once()


def test_get_course_tutorials_empty(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    res = client.get("/courses/3/tutorials", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body == []

    cursor.close.assert_called_once()
