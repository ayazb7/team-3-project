from flask import Blueprint, jsonify
import MySQLdb.cursors
from flask_jwt_extended import jwt_required
import random

import app

bp = Blueprint('quizzes', __name__, url_prefix='')

@bp.route('/tutorials/<int:tutorial_id>/quizzes', methods=['GET'])
@jwt_required()
def get_tutorial_quizzes(tutorial_id):
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
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
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
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
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
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
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
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

