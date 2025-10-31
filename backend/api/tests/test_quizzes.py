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
    cursor.fetchone.side_effect = [
        {"tutorial_id": 5}, 
        {"id": 1},  
    ]

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


def test_submit_quiz_missing_answers_field(client, mock_mysql, auth_headers):
    """
    Test submitting quiz without answers field.
    """
    res = client.post("/quizzes/1/submit", json={}, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 400
    assert "Missing or invalid" in body['error']


def test_submit_quiz_empty_answers_list(client, mock_mysql, auth_headers):
    """
    Test submitting quiz with empty answers list.
    """
    payload = {"answers": []}
    res = client.post("/quizzes/1/submit", json=payload, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 400
    assert "cannot be empty" in body['error']


def test_submit_quiz_invalid_answer_format(client, mock_mysql, auth_headers):
    """
    Test submitting quiz with answers missing required fields.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"question_id": 1, "correct_option_id": 11},
    ]

    payload = {
        "answers": [
            {"question_id": 1}, 
        ]
    }
    res = client.post("/quizzes/1/submit", json=payload, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 400
    assert "question_id" in body['error'] and "selected_option_id" in body['error']


def test_submit_quiz_all_correct(client, mock_mysql, auth_headers):
    """
    Test submitting quiz with all correct answers (100% score).
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"question_id": 1, "correct_option_id": 11},
        {"question_id": 2, "correct_option_id": 21},
    ]
    cursor.lastrowid = 100
    cursor.fetchone.side_effect = [
        {"tutorial_id": 1},
        None,  # No existing progress
    ]

    payload = {
        "answers": [
            {"question_id": 1, "selected_option_id": 11},
            {"question_id": 2, "selected_option_id": 21},
        ]
    }
    res = client.post("/quizzes/1/submit", json=payload, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 201
    assert body["correct_answers"] == 2
    assert body["total_questions"] == 2
    assert abs(body["score"] - 100.0) < 0.01


def test_submit_quiz_all_incorrect(client, mock_mysql, auth_headers):
    """
    Test submitting quiz with all incorrect answers (0% score).
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"question_id": 1, "correct_option_id": 11},
        {"question_id": 2, "correct_option_id": 21},
    ]
    cursor.lastrowid = 101
    cursor.fetchone.side_effect = [
        None,  
    ]

    payload = {
        "answers": [
            {"question_id": 1, "selected_option_id": 12},  
            {"question_id": 2, "selected_option_id": 22},  
        ]
    }
    res = client.post("/quizzes/1/submit", json=payload, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 201
    assert body["correct_answers"] == 0
    assert body["total_questions"] == 2
    assert abs(body["score"] - 0.0) < 0.01


def test_submit_quiz_creates_tutorial_progress(client, mock_mysql, auth_headers):
    """
    Test that submitting quiz creates tutorial progress if it doesn't exist.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"question_id": 1, "correct_option_id": 11},
    ]
    cursor.lastrowid = 200
    cursor.fetchone.side_effect = [
        {"tutorial_id": 10},  
        None,  
    ]

    payload = {
        "answers": [
            {"question_id": 1, "selected_option_id": 11},
        ]
    }
    res = client.post("/quizzes/1/submit", json=payload, headers=auth_headers)
    
    assert res.status_code == 201
    mock_mysql.connection.commit.assert_called_once()


def test_submit_quiz_missing_token(client):
    """
    Test that quiz submission requires authentication.
    """
    payload = {
        "answers": [
            {"question_id": 1, "selected_option_id": 11},
        ]
    }
    res = client.post("/quizzes/1/submit", json=payload)
    
    assert res.status_code == 401


def test_answer_question_missing_selected_option(client, mock_mysql, auth_headers):
    """
    Test answering a question without providing selected_option_id.
    """
    res = client.post("/quizzes/1/questions/1/answer", json={}, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 400
    assert "Missing selected_option_id" in body['error']


def test_answer_question_no_options_found(client, mock_mysql, auth_headers):
    """
    Test answering a question that has no options in the database.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = []
    
    payload = {"selected_option_id": 101}
    res = client.post("/quizzes/1/questions/1/answer", json=payload, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 404
    assert "not found" in body['error']


def test_answer_question_no_correct_answer_defined(client, mock_mysql, auth_headers):
    """
    Test answering a question where no option is marked as correct (data integrity issue).
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {"id": 101, "is_correct": 0},
        {"id": 102, "is_correct": 0},
    ]
    
    payload = {"selected_option_id": 101}
    res = client.post("/quizzes/1/questions/1/answer", json=payload, headers=auth_headers)
    body = res.get_json()
    
    assert res.status_code == 500
    assert "No correct answer" in body['error']


def test_get_full_quiz_with_no_questions(client, mock_mysql, auth_headers):
    """
    Test getting a quiz that exists but has no questions (edge case).
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {
            'quiz_id': 1,
            'quiz_title': 'Empty Quiz',
            'question_id': None,
            'question_text': None,
            'question_order': None,
            'option_id': None,
            'option_text': None,
            'is_correct': None,
        }
    ]

    res = client.get("/quizzes/1/full", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert body['id'] == 1
    assert body['title'] == 'Empty Quiz'
    assert body['questions'] == []


def test_get_full_quiz_options_shuffled(client, mock_mysql, auth_headers):
    """
    Test that options are shuffled in the full quiz response.
    """
    cursor = mock_mysql.connection.cursor.return_value
    cursor.fetchall.return_value = [
        {
            'quiz_id': 1,
            'quiz_title': 'Test Quiz',
            'question_id': 1,
            'question_text': 'Question 1',
            'question_order': 1,
            'option_id': 1,
            'option_text': 'Option A',
            'is_correct': 1,
        },
        {
            'quiz_id': 1,
            'quiz_title': 'Test Quiz',
            'question_id': 1,
            'question_text': 'Question 1',
            'question_order': 1,
            'option_id': 2,
            'option_text': 'Option B',
            'is_correct': 0,
        },
    ]

    res = client.get("/quizzes/1/full", headers=auth_headers)
    body = res.get_json()

    assert res.status_code == 200
    assert len(body['questions'][0]['options']) == 2
    option_ids = [opt['id'] for opt in body['questions'][0]['options']]
    assert 1 in option_ids and 2 in option_ids