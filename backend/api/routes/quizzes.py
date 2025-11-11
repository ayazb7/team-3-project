from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import random
import pymysql

import app
from .courses import calculate_course_progress

bp = Blueprint('quizzes', __name__, url_prefix='')

@bp.route('/tutorials/<int:tutorial_id>/quizzes', methods=['GET'])
@jwt_required()
def get_tutorial_quizzes(tutorial_id):
    """
    Returns all quizzes for a specific tutorial based on tutorial ID parameter

    Response:
        [
            { "id": number, "title": string }
        ]
    """
    cursor = app.mysql.connection.cursor()
    cursor.execute(
        """
        SELECT id, title 
        FROM quizzes 
        WHERE tutorial_id = %s
        """,
        (tutorial_id,),
    )
    quizzes = cursor.fetchall()
    cursor.close()
    return jsonify(quizzes), 200


@bp.route('/quizzes/<int:quiz_id>/questions', methods=['GET'])
@jwt_required()
def get_quiz_questions(quiz_id):
    """
    Returns all questions for a specific quiz

    Response:
        [
            { "id": number, "question_order": number, "question_text": string },
            { "id": number, "question_order": number, "question_text": string },
        ]
    """
    cursor = app.mysql.connection.cursor()
    cursor.execute(
        """
        SELECT id, question_text, question_order
        FROM quiz_questions
        WHERE quiz_id = %s
        ORDER BY question_order ASC
        """,
        (quiz_id,),
    )
    questions = cursor.fetchall()
    cursor.close()
    return jsonify(questions), 200


@bp.route('/quizzes/<int:quiz_id>/questions/<int:question_id>/options', methods=['GET'])
@jwt_required()
def get_question_options(quiz_id, question_id):
    """
    Returns all answer options for a specific question for a specific quiz

    Response:
        [
            { "id": number, "option_text": string },
            { "id": number, "option_text": string },
            { "id": number, "option_text": string },
            { "id": number, "option_text": string },
        ]
    """
    cursor = app.mysql.connection.cursor()
    cursor.execute(
        """
        SELECT o.id, o.option_text
        FROM quiz_options AS o
        INNER JOIN quiz_questions AS q ON o.question_id = q.id
        WHERE q.quiz_id = %s AND q.id = %s
        """,
        (quiz_id, question_id),
    )
    options = cursor.fetchall()
    cursor.close()
    if not options:
        return jsonify({'error': 'No options found for this question in this quiz'}), 404

    return jsonify(options), 200


@bp.route('/quizzes/<int:quiz_id>/full', methods=['GET'])
@jwt_required()
def get_full_quiz(quiz_id):
    """
    Returns full quiz details for a specific quiz, including all questions and all answer options for each question

    Response:
        {
            "id": number,
            "questions": [
                {
                    "id": number,
                    "options": [
                        {
                            "id": number,
                            "is_correct": boolean,
                            "text": string
                        },
                        ...
                    ],
                    "order": number,
                    "question_text": title
                },
                ...
            ]
        }
    """
    cursor = app.mysql.connection.cursor()
    cursor.execute(
        """
        SELECT 
            qz.id AS quiz_id,
            qz.title AS quiz_title,
            qq.id AS question_id,
            qq.question_text,
            qq.question_order,
            qo.id AS option_id,
            qo.option_text,
            qo.is_correct
        FROM quizzes AS qz
        LEFT JOIN quiz_questions AS qq ON qq.quiz_id = qz.id
        LEFT JOIN quiz_options AS qo ON qo.question_id = qq.id
        WHERE qz.id = %s
        ORDER BY qq.question_order ASC, qo.id ASC
        """,
        (quiz_id,),
    )
    rows = cursor.fetchall()
    # print(rows)
    cursor.close()
    if not rows:
        return jsonify({'error': 'Quiz not found'}), 404

    quiz_data = {
        'id': rows[0]['quiz_id'],
        'title': rows[0]['quiz_title'],
        'questions': []
    }

    question_map = {}
    for row in rows:
        if not row['question_id']:
            continue
        qid = row['question_id']
        if qid not in question_map:
            question_map[qid] = {
                'id': qid,
                'question_text': row['question_text'],
                'order': row['question_order'],
                'options': []
            }
            quiz_data['questions'].append(question_map[qid])

        if row['option_id']:
            question_map[qid]['options'].append({
                'id': row['option_id'],
                'text': row['option_text'],
                'is_correct': bool(row['is_correct'])
            })

    for question in quiz_data['questions']:
        random.shuffle(question['options'])

    return jsonify(quiz_data), 200


@bp.route('/quizzes/<int:quiz_id>/questions/<int:question_id>/answer', methods=['POST'])
@jwt_required()
def answer_question(quiz_id, question_id):
    """
    Returns feedback if a user's submitted answer is correct
    This endpoint does not save the user's answer

    Response:
        { "correct_option_id": number, "is_correct": boolean }
    """
    data = request.get_json()
    if not data or 'selected_option_id' not in data:
        return jsonify({'error': 'Missing selected_option_id field'}), 400
    
    selected_option_id = data['selected_option_id']

    try:
        cursor = app.mysql.connection.cursor()
        cursor.execute(
            """
            SELECT id, is_correct
            FROM quiz_options
            WHERE question_id = %s
            """,
            (question_id,),
        )
        options = cursor.fetchall()
        cursor.close()

        if not options:
            return jsonify({'error': 'Question or options not found'}), 404

        correct_option = next((opt for opt in options if opt['is_correct']), None)

        if not correct_option:
            return jsonify({'error': 'No correct answer is defined for this question'}), 500

        is_correct = (selected_option_id == correct_option['id'])

        return jsonify({
            'is_correct': is_correct,
            'correct_option_id': correct_option['id']
        }), 200

    except pymysql.Error as e:
        return jsonify({'error': 'A database error occurred', 'details': str(e)}), 500


@bp.route('/quizzes/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    """
    Submits all of a user's answers for a quiz, calculates the final score, and stores the results in the database.
    Requires a score of 80% or higher to pass. Only passing quizzes mark the tutorial as completed and update course progress.

    Request Body:
        {
            "answers": [
                { "question_id": number, "selected_option_id": number },
                { "question_id": number, "selected_option_id": number },
                ...
            ]
        }

    Response:
        {
            "message": "Quiz submitted successfully",
            "result_id": number,
            "score": number,
            "correct_answers": number,
            "total_questions": number,
            "passed": boolean,
            "passing_score": 80
        }
    """
    data = request.get_json()
    if not data or 'answers' not in data or not isinstance(data['answers'], list):
        return jsonify({'error': 'Missing or invalid "answers" field. It must be a list.'}), 400
    
    user_id = get_jwt_identity()

    user_answers = data['answers']
    if not user_answers:
        return jsonify({'error': '"answers" list cannot be empty.'}), 400
    
    try:
        cursor = app.mysql.connection.cursor()
        cursor.execute("""
            SELECT
                qo.question_id,
                qo.id AS correct_option_id
            FROM quiz_options AS qo
            INNER JOIN quiz_questions AS qq ON qo.question_id = qq.id
            WHERE qq.quiz_id = %s AND qo.is_correct = TRUE
        """, (quiz_id,))
        correct_answers_list = cursor.fetchall()

        correct_answers_map = {item['question_id']: item['correct_option_id'] for item in correct_answers_list}

        correct_answers_count = 0
        total_questions = len(user_answers)
        answers_to_insert = []

        for answer in user_answers:
            question_id = answer.get('question_id')
            selected_option_id = answer.get('selected_option_id')
            
            if question_id is None or selected_option_id is None:
                return jsonify({'error': 'Each answer must have "question_id" and "selected_option_id"'}), 400

            is_correct = correct_answers_map.get(question_id) == selected_option_id
            if is_correct:
                correct_answers_count += 1
            answers_to_insert.append((question_id, selected_option_id, is_correct))
        
        score = (correct_answers_count / total_questions) * 100 if total_questions > 0 else 0

        cursor.execute("""
            INSERT INTO user_quiz_results 
                (user_id, quiz_id, score, total_questions, correct_answers)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, quiz_id, score, total_questions, correct_answers_count))

        result_id = cursor.lastrowid

        final_answers_data = [
            (result_id, q_id, opt_id, correct) for q_id, opt_id, correct in answers_to_insert
        ]

        cursor.executemany("""
            INSERT INTO user_quiz_answers 
                (user_quiz_result_id, question_id, selected_option_id, is_correct)
            VALUES (%s, %s, %s, %s)
        """, final_answers_data)

        # Only mark tutorial as completed and update course progress if score >= 80%
        passed = score >= 80

        cursor.execute("""
            SELECT tutorial_id FROM quizzes WHERE id = %s
        """, (quiz_id,))
        quiz_data = cursor.fetchone()

        if quiz_data and passed:
            tutorial_id = quiz_data['tutorial_id']
            cursor.execute("""
                SELECT id FROM user_tutorial_progress
                WHERE user_id = %s AND tutorial_id = %s
            """, (user_id, tutorial_id))
            existing_progress = cursor.fetchone()

            if existing_progress:
                cursor.execute("""
                    UPDATE user_tutorial_progress
                    SET completed = TRUE, completed_at = NOW()
                    WHERE user_id = %s AND tutorial_id = %s
                """, (user_id, tutorial_id))
            else:
                cursor.execute("""
                    INSERT INTO user_tutorial_progress
                    (user_id, tutorial_id, completed, completed_at)
                    VALUES (%s, %s, TRUE, NOW())
                """, (user_id, tutorial_id))

            # Update course progress after passing quiz
            cursor.execute("""
                SELECT course_id FROM course_tutorials WHERE tutorial_id = %s LIMIT 1
            """, (tutorial_id,))
            course_result = cursor.fetchone()

            if course_result:
                course_id = course_result['course_id']
                progress_percentage = calculate_course_progress(cursor, course_id, user_id)

                cursor.execute("""
                    INSERT INTO user_course_progress
                    (user_id, course_id, progress_percentage, last_updated)
                    VALUES (%s, %s, %s, NOW())
                    ON DUPLICATE KEY UPDATE
                        progress_percentage = VALUES(progress_percentage),
                        last_updated = NOW()
                """, (user_id, course_id, progress_percentage))

        app.mysql.connection.commit()

        return jsonify({
            "message": "Quiz submitted successfully",
            "result_id": result_id,
            "score": round(score, 2),
            "correct_answers": correct_answers_count,
            "total_questions": total_questions,
            "passed": passed,
            "passing_score": 80
        }), 201
    
    except pymysql.Error as e:
        if app.mysql.connection:
            app.mysql.connection.rollback()
        return jsonify({'error': 'A database error occurred', 'details': str(e)}), 500


