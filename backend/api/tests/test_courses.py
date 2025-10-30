import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture()
def auth_headers(client):
    with client.application.app_context():
        token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {token}"}


def test_get_courses_success(client, mock_mysql, auth_headers):
    """
    Tests successful retrieval of a list of courses with summary data.
    Updated to match the current fields returned by the endpoint, including progress.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {
            "id": 1,
            "name": "Digital Kickstart",
            "description": "Learn essential digital skills.",
            "difficulty": "Beginner",
            "duration_min_minutes": 45,
            "duration_max_minutes": 60,
            "thumbnail_url": "https://example.com/image.jpg",
        },
        {
            "id": 2,
            "name": "Advanced Phishing",
            "description": "Deep dive into phishing tactics.",
            "difficulty": "Intermediate",
            "duration_min_minutes": 60,
            "duration_max_minutes": 90,
            "thumbnail_url": None,
        },
    ]
    
    # Course 1: 2 tutorials, 2 quizzes, 1 completed, 1 submitted -> 50% progress
    # Course 2: 0 tutorials, 0 quizzes -> 0% progress
    progress_results = [
        {"count": 2},
        {"count": 2},
        {"count": 1},
        {"count": 1}, 
        {"count": 0}, 
        {"count": 0}, 
    ]
    cursor.fetchone.side_effect = progress_results

    res = client.get("/courses", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, list)
    assert len(body) == 2

    course = body[0]
    expected_keys = {
        "id", "name", "description", "difficulty",
        "duration_min_minutes", "duration_max_minutes", "thumbnail_url", "progress"
    }
    assert set(course.keys()) == expected_keys
    assert course["id"] == 1
    assert course["name"] == "Digital Kickstart"
    assert course["difficulty"] == "Beginner"
    assert course["duration_min_minutes"] == 45
    assert "progress" in course
    assert isinstance(course["progress"], (int, float))
    assert 0 <= course["progress"] <= 100

    cursor.close.assert_called_once()


def test_get_courses_empty(client, mock_mysql, auth_headers):
    """
    Tests retrieval of courses when no courses are found.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    res = client.get("/courses", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body == []
    cursor.close.assert_called_once()


def test_get_course_success(client, mock_mysql, auth_headers):
    """
    Tests successful retrieval of a single course with all its new details,
    including empty prerequisites and requirements, and progress field.
    """
    cursor = mock_mysql.connection.cursor.return_value

    cursor.fetchone.side_effect = [
        {
            "id": 1,
            "name": "Digital Kickstart",
            "description": "Learn essential digital skills for everyday life.",
            "difficulty": "Beginner",
            "summary": "In this beginner-friendly course, you'll build foundational skills.",
            "learning_objectives": '["Create strong passwords", "Send professional emails"]',
            "duration_min_minutes": 45,
            "duration_max_minutes": 60,
        },
        {"count": 3},
        {"count": 3}, 
        {"count": 2},  
        {"count": 1}, 
    ]
    cursor.fetchall.side_effect = [[], []] 

    res = client.get("/courses/1", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, dict)
    assert body["id"] == 1
    assert body["name"] == "Digital Kickstart"
    assert body["difficulty"] == "Beginner"
    assert body["summary"] == "In this beginner-friendly course, you'll build foundational skills."
    assert body["learning_objectives"] == ["Create strong passwords", "Send professional emails"]
    assert body["duration_min_minutes"] == 45
    assert body["duration_max_minutes"] == 60
    assert body["prerequisites"] == []
    assert body["requirements"] == []
    assert "progress" in body
    assert isinstance(body["progress"], (int, float))
    # Progress should be (2 + 1) / (3 + 3) * 100 = 50%
    assert abs(body["progress"] - 50.0) < 0.01

    assert cursor.close.call_count == 1
    assert cursor.fetchall.call_count == 2


def test_get_course_not_found(client, mock_mysql, auth_headers):
    """
    Tests retrieval of a course that does not exist.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchone.return_value = None 

    res = client.get("/courses/999", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 404
    assert body == {"error": "Course not found"}
    cursor.close.assert_called_once()
    cursor.fetchall.assert_not_called()


def test_get_course_with_prerequisites_and_requirements(client, mock_mysql, auth_headers):
    """
    Tests retrieval of a course that has both course-based prerequisites
    and text-based requirements.
    """
    cursor = mock_mysql.connection.cursor.return_value

    cursor.fetchone.side_effect = [
        {
            "id": 1,
            "name": "Digital Kickstart",
            "description": "Learn essential digital skills.",
            "difficulty": "Beginner",
            "summary": "Full summary text here.",
            "learning_objectives": '["Obj 1", "Obj 2"]',
            "duration_min_minutes": 45,
            "duration_max_minutes": 60,
        },
        {"count": 2},  
        {"count": 2},  
        {"count": 1},  
        {"count": 1},  
    ]
    mock_prerequisites = [
        {"id": 10, "name": "Basic Computer Skills"},
        {"id": 11, "name": "Internet Fundamentals"},
    ]
    mock_requirements = [
        {"requirement_text": "Access to an email account"},
        {"requirement_text": "Working internet connection"},
    ]
    cursor.fetchall.side_effect = [mock_prerequisites, mock_requirements]

    res = client.get("/courses/1", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body["id"] == 1
    assert body["name"] == "Digital Kickstart"
    assert body["prerequisites"] == mock_prerequisites
    assert body["requirements"] == ["Access to an email account", "Working internet connection"] # Transformed to list of strings
    assert "progress" in body
    assert isinstance(body["progress"], (int, float))

    assert cursor.close.call_count == 1
    assert cursor.fetchall.call_count == 2


def test_get_course_learning_objectives_is_null(client, mock_mysql, auth_headers):
    """
    Tests that if learning_objectives is NULL in the DB, it returns an empty list.
    """
    cursor = mock_mysql.connection.cursor.return_value

    cursor.fetchone.side_effect = [
        {
            "id": 1,
            "name": "Course with no objectives",
            "description": "...",
            "difficulty": "Beginner",
            "summary": "...",
            "learning_objectives": None,
            "duration_min_minutes": 30,
            "duration_max_minutes": 30,
        },
        {"count": 0},  
        {"count": 0},  
    ]
    cursor.fetchall.side_effect = [[], []] 

    res = client.get("/courses/1", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body["id"] == 1
    assert body["learning_objectives"] == []
    assert "progress" in body
    assert body["progress"] == 0.0

    assert cursor.close.call_count == 1
    assert cursor.fetchall.call_count == 2


def test_get_course_tutorials_success(client, mock_mysql, auth_headers):
    """
    Tests successful retrieval of tutorials for a specific course.
    """
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
    expected_keys = {
        "id", "title", "description", "video_provider", "video_url", "category"
    }
    assert set(tutorial.keys()) == expected_keys
    assert tutorial["video_provider"] in ("youtube", "synthesia")
    assert tutorial["category"] == "security"

    assert body[0]["id"] == 10
    assert body[1]["id"] == 11

    cursor.close.assert_called_once()


def test_get_course_tutorials_empty(client, mock_mysql, auth_headers):
    """
    Tests retrieval of tutorials for a course when no tutorials are found.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    res = client.get("/courses/3/tutorials", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body == []

    cursor.close.assert_called_once()


def test_get_course_progress_zero_when_no_content(client, mock_mysql, auth_headers):
    """
    Tests that progress is 0 when a course has no tutorials or quizzes.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        {
            "id": 1,
            "name": "Empty Course",
            "description": "A course with no content.",
            "difficulty": "Beginner",
            "summary": "No content here.",
            "learning_objectives": "[]",
            "duration_min_minutes": 0,
            "duration_max_minutes": 0,
        },
        {"count": 0}, 
        {"count": 0}, 
    ]
    cursor.fetchall.side_effect = [[], []] 

    res = client.get("/courses/1", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert abs(body["progress"] - 0.0) < 0.01


def test_get_course_progress_complete(client, mock_mysql, auth_headers):
    """
    Tests that progress is 100% when all tutorials are completed and all quizzes are submitted.
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        {
            "id": 1,
            "name": "Complete Course",
            "description": "A completed course.",
            "difficulty": "Beginner",
            "summary": "All done.",
            "learning_objectives": "[]",
            "duration_min_minutes": 60,
            "duration_max_minutes": 90,
        },
        {"count": 2},
        {"count": 2},  
        {"count": 2}, 
        {"count": 2},  
    ]
    cursor.fetchall.side_effect = [[], []] 

    res = client.get("/courses/1", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    # Progress should be (2 + 2) / (2 + 2) * 100 = 100%
    assert abs(body["progress"] - 100.0) < 0.01


def test_get_course_progress_partial(client, mock_mysql, auth_headers):
    """
    Tests partial progress calculation.
    Course has 4 tutorials and 4 quizzes. User completed 2 tutorials and submitted 1 quiz.
    Expected progress: (2 + 1) / (4 + 4) * 100 = 37.5%
    """
    cursor = mock_mysql.connection.cursor.return_value
    
    cursor.fetchone.side_effect = [
        {
            "id": 1,
            "name": "Partial Course",
            "description": "A partially completed course.",
            "difficulty": "Intermediate",
            "summary": "In progress.",
            "learning_objectives": "[]",
            "duration_min_minutes": 45,
            "duration_max_minutes": 60,
        },
        {"count": 4}, 
        {"count": 4}, 
        {"count": 2},  
        {"count": 1},  
    ]
    cursor.fetchall.side_effect = [[], []] 

    res = client.get("/courses/1", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    # Progress should be (2 + 1) / (4 + 4) * 100 = 37.5%
    assert abs(body["progress"] - 37.5) < 0.01


def test_get_courses_includes_progress(client, mock_mysql, auth_headers):
    """
    Tests that GET /courses endpoint includes progress for all courses.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.side_effect = [
        # List of courses
        [
            {
                "id": 1,
                "name": "Course 1",
                "description": "First course",
                "difficulty": "Beginner",
                "duration_min_minutes": 30,
                "duration_max_minutes": 45,
                "thumbnail_url": None,
            },
            {
                "id": 2,
                "name": "Course 2",
                "description": "Second course",
                "difficulty": "Intermediate",
                "duration_min_minutes": 60,
                "duration_max_minutes": 90,
                "thumbnail_url": None,
            },
        ],
    ]
    
    # Course 1: 2 tutorials, 2 quizzes, 1 completed, 1 submitted -> 50%
    # Course 2: 3 tutorials, 3 quizzes, 2 completed, 2 submitted -> 66.67%
    progress_results = [
        {"count": 2}, 
        {"count": 2},  
        {"count": 1}, 
        {"count": 1},  
        {"count": 3},  
        {"count": 3},  
        {"count": 2},  
        {"count": 2},  
    ]
    
    cursor.fetchone.side_effect = progress_results

    res = client.get("/courses", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, list)
    assert len(body) == 2
    
    assert "progress" in body[0]
    assert "progress" in body[1]
    assert abs(body[0]["progress"] - 50.0) < 0.01  # (1 + 1) / (2 + 2) * 100
    assert abs(body[1]["progress"] - 66.67) < 0.01  # (2 + 2) / (3 + 3) * 100

    cursor.close.assert_called_once()
