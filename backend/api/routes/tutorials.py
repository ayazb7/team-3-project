from flask import Blueprint, jsonify, request
import MySQLdb.cursors
from flask_jwt_extended import jwt_required, get_jwt_identity

import app

bp = Blueprint('tutorials', __name__, url_prefix='/tutorials')


@bp.route('', methods=['GET'])
@jwt_required()
def get_tutorials():
    """
    Returns all tutorials with summary data.
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
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
    Once marked as completed, the user cannot complete it again.

    Expects JSON body:
        { "feedback": "positive" or "negative" }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        feedback = data.get("feedback")

        cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)

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

        # 2. Get the course_id for this tutorial (via the junction table)
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

        # 3. Insert new completion record
        cursor.execute("""
            INSERT INTO user_tutorial_progress 
            (user_id, tutorial_id, completed, completed_at, feedback)
            VALUES (%s, %s, TRUE, NOW(), %s)
        """, (user_id, tutorial_id, feedback))

        # 4. Count total tutorials in the course
        cursor.execute("""
            SELECT COUNT(*) AS total_tutorials
            FROM course_tutorials
            WHERE course_id = %s
        """, (course_id,))
        total_tutorials = cursor.fetchone()['total_tutorials']

        # 5. Count completed tutorials for this user in that course
        cursor.execute("""
            SELECT COUNT(*) AS completed_tutorials
            FROM user_tutorial_progress utp
            JOIN course_tutorials ct ON utp.tutorial_id = ct.tutorial_id
            WHERE utp.user_id = %s
              AND ct.course_id = %s
              AND utp.completed = TRUE
        """, (user_id, course_id))
        completed_tutorials = cursor.fetchone()['completed_tutorials']

        # 6. Calculate progress
        progress_percentage = int((completed_tutorials / total_tutorials) * 100) if total_tutorials > 0 else 0

        # 7. Update or insert into user_course_progress
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
            "course_progress": progress_percentage,
            "completed_tutorials": completed_tutorials,
            "total_tutorials": total_tutorials
        }), 200

    except Exception as e:
        print(f"Error completing tutorial: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
