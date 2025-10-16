import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture()
def auth_headers(client):
    with client.application.app_context():
        token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {token}"}


def test_get_tutorial_quizzes_success(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"id": 1, "title": "Password Safety Quiz"},
        {"id": 2, "title": "Phishing Awareness Quiz"},
    ]

    res = client.get("/tutorials/1/quizzes", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, list)
    assert len(body) == 2

    first_quiz = body[0]
    assert set(first_quiz.keys()) == {"id", "title"}
    assert first_quiz["id"] == 1
    assert first_quiz["title"] == "Password Safety Quiz"

    cursor.close.assert_called_once()


def test_get_tutorial_quizzes_empty(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    res = client.get("/tutorials/1/quizzes", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body == []
    cursor.close.assert_called_once()


def test_get_quiz_questions_success(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"id": 1, "question_text": "What makes a strong password?", "question_order": 1},
        {"id": 2, "question_text": "How often should you change your password?",
            "question_order": 2},
    ]

    res = client.get("/quizzes/5/questions", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, list)
    assert len(body) == 2

    q1 = body[0]
    assert set(q1.keys()) == {"id", "question_text", "question_order"}
    assert q1["question_order"] == 1
    assert "strong password" in q1["question_text"]

    assert body[0]["id"] == 1
    assert body[1]["id"] == 2

    cursor.close.assert_called_once()


def test_get_quiz_questions_empty(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    res = client.get("/quizzes/2/questions", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body == []
    cursor.close.assert_called_once()


def test_get_question_options_success(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"id": 10, "option_text": "Use random characters"},
        {"id": 11, "option_text": "Use your pet’s name"},
    ]

    res = client.get("/quizzes/1/questions/3/options", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, list)
    assert len(body) == 2

    opt = body[0]
    assert set(opt.keys()) == {"id", "option_text"}
    assert "option_text" in opt
    assert isinstance(opt["option_text"], str)
    assert "Use" in opt["option_text"]

    cursor.close.assert_called_once()


def test_get_question_options_not_found(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    res = client.get("/quizzes/1/questions/99/options", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 404
    assert body == {"error": "No options found for this question in this quiz"}
    cursor.close.assert_called_once()


def test_get_full_quiz_success(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {
            "quiz_id": 1,
            "quiz_title": "Cybersecurity Quiz",
            "question_id": 1,
            "question_text": "What is a strong password?",
            "question_order": 1,
            "option_id": 1,
            "option_text": "R!verSun_93!",
            "is_correct": 1,
        },
        {
            "quiz_id": 1,
            "quiz_title": "Cybersecurity Quiz",
            "question_id": 2,
            "question_text": "Should you reuse passwords?",
            "question_order": 2,
            "option_id": 2,
            "option_text": "Never reuse passwords",
            "is_correct": 1,
        },
        {
            "quiz_id": 1,
            "quiz_title": "Cybersecurity Quiz",
            "question_id": 2,
            "question_text": "Should you reuse passwords?",
            "question_order": 2,
            "option_id": 3,
            "option_text": "Reuse them everywhere",
            "is_correct": 0,
        },
    ]

    res = client.get("/quizzes/1/full", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert isinstance(body, dict)
    assert body["id"] == 1
    assert body["title"] == "Cybersecurity Quiz"
    assert "questions" in body
    assert isinstance(body["questions"], list)
    assert len(body["questions"]) == 2

    q1 = body["questions"][0]
    assert set(q1.keys()) == {"id", "question_text", "order", "options"}
    assert isinstance(q1["options"], list)
    assert all("text" in o for o in q1["options"])
    assert any(o["is_correct"] for o in q1["options"])

    cursor.close.assert_called_once()


def test_get_full_quiz_not_found(client, mock_mysql, auth_headers):
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []

    res = client.get("/quizzes/999/full", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 404
    assert body == {"error": "Quiz not found"}
    cursor.close.assert_called_once()


def test_answer_question_correct_submission(client, mock_mysql, auth_headers):
    """
    Test a user submitting a correct answer.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"id": 101, "is_correct": 1},
        {"id": 102, "is_correct": 0},
    ]
    
    payload = {"selected_option_id": 101}
    res = client.post("/quizzes/1/questions/1/answer", json=payload, headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body["is_correct"] is True
    assert body["correct_option_id"] == 101
    cursor.close.assert_called_once()


def test_answer_question_incorrect_submission(client, mock_mysql, auth_headers):
    """
    Test a user submitting an incorrect answer.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"id": 101, "is_correct": 1},
        {"id": 102, "is_correct": 0},
    ]
    
    payload = {"selected_option_id": 102}
    res = client.post("/quizzes/1/questions/1/answer", json=payload, headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body["is_correct"] is False
    assert body["correct_option_id"] == 101 
    cursor.close.assert_called_once()


def test_submit_quiz_success(client, mock_mysql, auth_headers):
    """
    Test a successful quiz submission with a mix of correct and incorrect answers.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"question_id": 1, "correct_option_id": 11},
        {"question_id": 2, "correct_option_id": 21},
        {"question_id": 3, "correct_option_id": 31},
    ]
    cursor.lastrowid = 789

    payload = {
        "answers": [
            {"question_id": 1, "selected_option_id": 11},
            {"question_id": 2, "selected_option_id": 22}, 
            {"question_id": 3, "selected_option_id": 31}, 
        ]
    }
    res = client.post("/quizzes/1/submit", json=payload, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 201
    assert body["message"] == "Quiz submitted successfully"
    assert body["result_id"] == 789
    assert body["correct_answers"] == 2
    assert body["total_questions"] == 3
    assert body["score"] == round((2/3) * 100, 2)
    
    mock_mysql.connection.commit.assert_called_once()
    mock_mysql.connection.rollback.assert_not_called()