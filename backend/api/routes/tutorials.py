from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

import app
from .courses import calculate_course_progress

bp = Blueprint('tutorials', __name__, url_prefix='/tutorials')


@bp.route('', methods=['GET'])
@jwt_required()
def get_tutorials():
    """
    Returns all tutorials with summary data.
    """
    cursor = app.mysql.connection.cursor()
    cursor.execute("""
        SELECT 
            id,
            title,
            description,
            category,
            video_provider,
            video_url,
            course_id,
            created_at
        FROM tutorials
    """)
    tutorials = cursor.fetchall()
    cursor.close()
    return jsonify(tutorials), 200


@bp.route('/<int:tutorial_id>/complete', methods=['POST'])
@jwt_required()
def complete_tutorial(tutorial_id):
    """
    Marks a tutorial as completed by the user and updates the user's overall course progress.
    If the tutorial has an associated quiz, the user must pass it with 80% or higher before completing the tutorial.
    Once marked as completed, the user cannot complete it again.

    Expects JSON body:
        { "feedback": "positive" or "negative" }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        feedback = data.get("feedback")

        cursor = app.mysql.connection.cursor()

        # 1. Check if this tutorial is already completed by the user
        cursor.execute("""
            SELECT completed
            FROM user_tutorial_progress
            WHERE user_id = %s AND tutorial_id = %s
        """, (user_id, tutorial_id))
        existing = cursor.fetchone()

        if existing and existing['completed']:
            cursor.close()
            return jsonify({
                "message": "Tutorial already marked as completed. You cannot change it again."
            }), 400

        # 2. Check if there's a quiz for this tutorial and if it's been passed
        cursor.execute("""
            SELECT id FROM quizzes WHERE tutorial_id = %s
        """, (tutorial_id,))
        quiz = cursor.fetchone()

        if quiz:
            quiz_id = quiz['id']
            # Check if user has passed the quiz (score >= 80%)
            cursor.execute("""
                SELECT MAX(score) as best_score
                FROM user_quiz_results
                WHERE user_id = %s AND quiz_id = %s
            """, (user_id, quiz_id))
            quiz_result = cursor.fetchone()
            best_score = quiz_result['best_score'] if quiz_result and quiz_result['best_score'] is not None else 0

            if best_score < 80:
                cursor.close()
                return jsonify({
                    "error": "You must pass the quiz with 80% or higher before completing this tutorial.",
                    "required_score": 80,
                    "best_score": best_score
                }), 403

        # 3. Get the course_id for this tutorial (via the junction table)
        cursor.execute("""
            SELECT course_id
            FROM course_tutorials
            WHERE tutorial_id = %s
            LIMIT 1
        """, (tutorial_id,))
        course_result = cursor.fetchone()
        if not course_result:
            cursor.close()
            return jsonify({"error": "No course associated with this tutorial"}), 404

        course_id = course_result['course_id']

        # 4. Insert or update completion record
        cursor.execute("""
            INSERT INTO user_tutorial_progress
            (user_id, tutorial_id, completed, completed_at, feedback)
            VALUES (%s, %s, TRUE, NOW(), %s)
            ON DUPLICATE KEY UPDATE
                completed = TRUE,
                completed_at = NOW(),
                feedback = VALUES(feedback)
        """, (user_id, tutorial_id, feedback))

        # 5. Calculate progress using the same formula as get_courses
        # This includes both completed tutorials AND passed quizzes
        progress_percentage = calculate_course_progress(cursor, course_id, user_id)

        # 6. Update or insert into user_course_progress
        cursor.execute("""
            INSERT INTO user_course_progress
            (user_id, course_id, progress_percentage, last_updated)
            VALUES (%s, %s, %s, NOW())
            ON DUPLICATE KEY UPDATE
                progress_percentage = VALUES(progress_percentage),
                last_updated = NOW()
        """, (user_id, course_id, progress_percentage))

        app.mysql.connection.commit()
        cursor.close()

        return jsonify({
            "message": "Tutorial completed successfully",
            "course_progress": progress_percentage
        }), 200

    except Exception as e:
        print(f"Error completing tutorial: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@bp.route('/<int:tutorial_id>/feedback', methods=['POST'])
@jwt_required()
def submit_feedback(tutorial_id):
    """
    Submit or update feedback for a tutorial without completing it.
    Allows users to give feedback while watching.

    Expects JSON body:
        { "feedback_type": "positive" or "negative" }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        feedback_type = data.get("feedback_type")

        # Validate feedback type is provided
        if not feedback_type:
            return jsonify({"error": "feedback_type is required"}), 400

        # Validate feedback type
        if feedback_type not in ['positive', 'negative']:
            return jsonify({"error": "Invalid feedback type. Must be 'positive' or 'negative'"}), 400

        cursor = app.mysql.connection.cursor()

        # Insert or update feedback (keep completion status unchanged)
        # This allows feedback without completion
        cursor.execute("""
            INSERT INTO user_tutorial_progress
            (user_id, tutorial_id, feedback)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                feedback = VALUES(feedback)
        """, (user_id, tutorial_id, feedback_type))

        app.mysql.connection.commit()
        cursor.close()

        return jsonify({
            "message": "Feedback submitted successfully",
            "feedback": feedback_type
        }), 200

    except Exception as e:
        print(f"Error submitting feedback: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
