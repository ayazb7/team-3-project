# routes/dashboard.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import app

bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """
    Returns dashboard statistics for the current user:
    - Courses Completed
    - Tutorials Watched
    - Time Spent (approx. hours this week)
    - Weekly Activity (M–S booleans)
    """
    try:
        user_id = get_jwt_identity()
        cursor = app.mysql.connection.cursor()

        # ---------------------------
        # Courses Completed
        # ---------------------------
        cursor.execute("""
            SELECT COUNT(*) AS courses_completed
            FROM user_course_progress
            WHERE user_id = %s AND progress_percentage = 100
        """, (user_id,))
        result = cursor.fetchone()
        courses_completed = result['courses_completed'] if result else 0

        # ---------------------------
        # Tutorials Watched
        # ---------------------------
        cursor.execute("""
            SELECT COUNT(*) AS tutorials_watched
            FROM user_tutorial_progress
            WHERE user_id = %s AND completed = TRUE
        """, (user_id,))
        result = cursor.fetchone()
        tutorials_watched = result['tutorials_watched'] if result else 0

        # ---------------------------
        # Time Spent (approximation)
        # ---------------------------
        # We'll assume each completed tutorial takes ~5 minutes.
        cursor.execute("""
            SELECT COUNT(*) AS tutorials_completed_this_week
            FROM user_tutorial_progress
            WHERE user_id = %s
              AND completed = TRUE
              AND YEARWEEK(completed_at, 1) = YEARWEEK(CURDATE(), 1)
        """, (user_id,))
        result = cursor.fetchone()
        tutorials_completed_this_week = result['tutorials_completed_this_week'] if result else 0
        total_minutes = tutorials_completed_this_week * 5  # assumed 5 minutes per tutorial
        time_spent_hours = round(total_minutes / 60, 1)

        # ---------------------------
        # Weekly Activity (M–S)
        # ---------------------------
        cursor.execute("""
            SELECT DAYNAME(activity_date) AS day_name
            FROM (
                SELECT completed_at AS activity_date
                FROM user_tutorial_progress
                WHERE user_id = %s AND completed = TRUE

                UNION ALL

                SELECT last_updated AS activity_date
                FROM user_course_progress
                WHERE user_id = %s AND progress_percentage = 100

                UNION ALL

                SELECT attempted_at AS activity_date
                FROM user_quiz_results
                WHERE user_id = %s
            ) AS all_activity
            WHERE YEARWEEK(activity_date, 1) = YEARWEEK(CURDATE(), 1)
            GROUP BY DAYNAME(activity_date)
        """, (user_id, user_id, user_id))
        activity_days = [row['day_name'] for row in cursor.fetchall()]

        cursor.close()

        # Normalize day booleans (Monday–Sunday)
        week_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        weekly_activity = {day[:2].upper(): (day in activity_days) for day in week_days}

        return jsonify({
            "courses_completed": courses_completed,
            "tutorials_watched": tutorials_watched,
            "time_spent_hours": time_spent_hours,
            "weekly_activity": weekly_activity
        }), 200

    except Exception as e:
        print(f"Error in get_dashboard_stats: {str(e)}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500
