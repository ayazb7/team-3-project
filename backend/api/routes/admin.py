from flask import Blueprint, request, jsonify
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
import app

bp = Blueprint('admin', __name__, url_prefix='/admin')


def admin_required(f):
    """Decorator to check if user is an admin"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()

        # Check if user is admin
        cursor = app.mysql.connection.cursor()
        cursor.execute('SELECT role FROM users WHERE id = %s', (user_id,))
        result = cursor.fetchone()
        cursor.close()

        if not result or result[0] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        return f(*args, **kwargs)

    return decorated_function


# ============================================
# ADMIN DASHBOARD STATS
# ============================================

@bp.route('/dashboard/stats', methods=['GET'])
@admin_required
def get_admin_dashboard_stats():
    """Get overall platform statistics for admin dashboard"""
    cursor = app.mysql.connection.cursor()

    try:
        # Total users
        cursor.execute('SELECT COUNT(*) FROM users')
        total_users = cursor.fetchone()[0]

        # Active users (logged in within last 7 days)
        cursor.execute('''
            SELECT COUNT(DISTINCT user_id)
            FROM web_traffic
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ''')
        active_users = cursor.fetchone()[0]

        # Total courses
        cursor.execute('SELECT COUNT(*) FROM courses')
        total_courses = cursor.fetchone()[0]

        # Total tutorials
        cursor.execute('SELECT COUNT(*) FROM tutorials')
        total_tutorials = cursor.fetchone()[0]

        # Average course completion rate
        cursor.execute('''
            SELECT AVG(progress_percentage)
            FROM user_course_progress
        ''')
        result = cursor.fetchone()
        avg_completion = round(result[0], 2) if result[0] else 0

        # User growth (last 30 days)
        cursor.execute('''
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM users
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ''')
        user_growth = [{'date': str(row[0]), 'count': row[1]} for row in cursor.fetchall()]

        # Course completion stats
        cursor.execute('''
            SELECT
                c.id,
                c.name,
                COUNT(DISTINCT ucp.user_id) as enrolled,
                SUM(CASE WHEN ucp.progress_percentage = 100 THEN 1 ELSE 0 END) as completed,
                AVG(ucp.progress_percentage) as avg_progress
            FROM courses c
            LEFT JOIN user_course_progress ucp ON c.id = ucp.course_id
            GROUP BY c.id, c.name
            ORDER BY enrolled DESC
        ''')
        course_stats = [{
            'id': row[0],
            'name': row[1],
            'enrolled': row[2] or 0,
            'completed': row[3] or 0,
            'avg_progress': round(row[4], 2) if row[4] else 0
        } for row in cursor.fetchall()]

        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'total_courses': total_courses,
            'total_tutorials': total_tutorials,
            'avg_completion': avg_completion,
            'user_growth': user_growth,
            'course_stats': course_stats
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()


# ============================================
# USER MANAGEMENT
# ============================================

@bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """Get all users with their statistics"""
    cursor = app.mysql.connection.cursor()

    try:
        cursor.execute('''
            SELECT
                u.id,
                u.username,
                u.email,
                u.role,
                u.created_at,
                COUNT(DISTINCT ucp.course_id) as courses_enrolled,
                COUNT(DISTINCT utp.tutorial_id) as tutorials_watched,
                COALESCE(SUM(ucp.progress_percentage), 0) / NULLIF(COUNT(DISTINCT ucp.course_id), 0) as avg_progress
            FROM users u
            LEFT JOIN user_course_progress ucp ON u.id = ucp.user_id
            LEFT JOIN user_tutorial_progress utp ON u.id = utp.user_id AND utp.completed = TRUE
            GROUP BY u.id, u.username, u.email, u.role, u.created_at
            ORDER BY u.created_at DESC
        ''')

        users = [{
            'id': row[0],
            'username': row[1],
            'email': row[2],
            'role': row[3],
            'created_at': str(row[4]),
            'courses_enrolled': row[5] or 0,
            'tutorials_watched': row[6] or 0,
            'avg_progress': round(row[7], 2) if row[7] else 0
        } for row in cursor.fetchall()]

        return jsonify(users), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()


@bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user_details(user_id):
    """Get detailed statistics for a specific user"""
    cursor = app.mysql.connection.cursor()

    try:
        # User basic info
        cursor.execute('''
            SELECT id, username, email, role, language_preference, created_at
            FROM users WHERE id = %s
        ''', (user_id,))
        user = cursor.fetchone()

        if not user:
            cursor.close()
            return jsonify({'error': 'User not found'}), 404

        # Courses enrolled
        cursor.execute('''
            SELECT COUNT(*) FROM user_course_progress WHERE user_id = %s
        ''', (user_id,))
        courses_enrolled = cursor.fetchone()[0]

        # Courses completed
        cursor.execute('''
            SELECT COUNT(*) FROM user_course_progress
            WHERE user_id = %s AND progress_percentage = 100
        ''', (user_id,))
        courses_completed = cursor.fetchone()[0]

        # Tutorials watched
        cursor.execute('''
            SELECT COUNT(*) FROM user_tutorial_progress
            WHERE user_id = %s AND completed = TRUE
        ''', (user_id,))
        tutorials_watched = cursor.fetchone()[0]

        # Quizzes submitted
        cursor.execute('''
            SELECT COUNT(*) FROM user_quiz_results WHERE user_id = %s
        ''', (user_id,))
        quizzes_submitted = cursor.fetchone()[0]

        # Average quiz score
        cursor.execute('''
            SELECT AVG(score) FROM user_quiz_results WHERE user_id = %s
        ''', (user_id,))
        result = cursor.fetchone()
        avg_quiz_score = round(result[0], 2) if result[0] else 0

        # Weekly activity
        cursor.execute('''
            SELECT DAYNAME(created_at) as day, COUNT(*) as count
            FROM web_traffic
            WHERE user_id = %s AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DAYNAME(created_at)
        ''', (user_id,))
        weekly_activity = {row[0]: row[1] for row in cursor.fetchall()}

        # Course progress details
        cursor.execute('''
            SELECT
                c.id,
                c.name,
                ucp.progress_percentage,
                ucp.last_updated
            FROM user_course_progress ucp
            JOIN courses c ON ucp.course_id = c.id
            WHERE ucp.user_id = %s
            ORDER BY ucp.last_updated DESC
        ''', (user_id,))
        course_progress = [{
            'course_id': row[0],
            'course_name': row[1],
            'progress': row[2],
            'last_updated': str(row[3])
        } for row in cursor.fetchall()]

        return jsonify({
            'user': {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'role': user[3],
                'language_preference': user[4],
                'created_at': str(user[5])
            },
            'stats': {
                'courses_enrolled': courses_enrolled,
                'courses_completed': courses_completed,
                'tutorials_watched': tutorials_watched,
                'quizzes_submitted': quizzes_submitted,
                'avg_quiz_score': avg_quiz_score
            },
            'weekly_activity': weekly_activity,
            'course_progress': course_progress
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()


# ============================================
# COURSE MANAGEMENT (CRUD)
# ============================================

@bp.route('/courses', methods=['POST'])
@admin_required
def create_course():
    """Create a new course"""
    data = request.json

    if not data.get('name'):
        return jsonify({'error': 'Course name is required'}), 400

    cursor = app.mysql.connection.cursor()

    try:
        cursor.execute('''
            INSERT INTO courses (
                name, description, difficulty, summary,
                learning_objectives, duration_min_minutes,
                duration_max_minutes, thumbnail_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            data.get('name'),
            data.get('description'),
            data.get('difficulty', 'Beginner'),
            data.get('summary'),
            data.get('learning_objectives'),
            data.get('duration_min_minutes'),
            data.get('duration_max_minutes'),
            data.get('thumbnail_url')
        ))

        app.mysql.connection.commit()
        course_id = cursor.lastrowid

        # Log admin action
        user_id = get_jwt_identity()
        cursor.execute('''
            INSERT INTO admin_logs (user_id, action)
            VALUES (%s, %s)
        ''', (user_id, f'Created course: {data.get("name")} (ID: {course_id})'))
        app.mysql.connection.commit()

        return jsonify({
            'message': 'Course created successfully',
            'course_id': course_id
        }), 201

    except Exception as e:
        app.mysql.connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()


@bp.route('/courses/<int:course_id>', methods=['PUT'])
@admin_required
def update_course(course_id):
    """Update an existing course"""
    data = request.json
    cursor = app.mysql.connection.cursor()

    try:
        # Check if course exists
        cursor.execute('SELECT name FROM courses WHERE id = %s', (course_id,))
        if not cursor.fetchone():
            cursor.close()
            return jsonify({'error': 'Course not found'}), 404

        # Build update query dynamically
        update_fields = []
        values = []

        for field in ['name', 'description', 'difficulty', 'summary',
                      'learning_objectives', 'duration_min_minutes',
                      'duration_max_minutes', 'thumbnail_url']:
            if field in data:
                update_fields.append(f'{field} = %s')
                values.append(data[field])

        if not update_fields:
            cursor.close()
            return jsonify({'error': 'No fields to update'}), 400

        values.append(course_id)
        query = f'UPDATE courses SET {", ".join(update_fields)} WHERE id = %s'

        cursor.execute(query, values)
        app.mysql.connection.commit()

        # Log admin action
        user_id = get_jwt_identity()
        cursor.execute('''
            INSERT INTO admin_logs (user_id, action)
            VALUES (%s, %s)
        ''', (user_id, f'Updated course ID: {course_id}'))
        app.mysql.connection.commit()

        return jsonify({'message': 'Course updated successfully'}), 200

    except Exception as e:
        app.mysql.connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()


@bp.route('/courses/<int:course_id>', methods=['DELETE'])
@admin_required
def delete_course(course_id):
    """Delete a course"""
    cursor = app.mysql.connection.cursor()

    try:
        # Check if course exists
        cursor.execute('SELECT name FROM courses WHERE id = %s', (course_id,))
        course = cursor.fetchone()
        if not course:
            cursor.close()
            return jsonify({'error': 'Course not found'}), 404

        course_name = course[0]

        # Delete related records (due to foreign key constraints)
        cursor.execute('DELETE FROM user_course_progress WHERE course_id = %s', (course_id,))
        cursor.execute('DELETE FROM course_tutorials WHERE course_id = %s', (course_id,))
        cursor.execute('DELETE FROM course_prerequisites WHERE course_id = %s OR prerequisite_course_id = %s', (course_id, course_id))
        cursor.execute('DELETE FROM course_requirements WHERE course_id = %s', (course_id,))

        # Delete the course
        cursor.execute('DELETE FROM courses WHERE id = %s', (course_id,))

        # Log admin action
        user_id = get_jwt_identity()
        cursor.execute('''
            INSERT INTO admin_logs (user_id, action)
            VALUES (%s, %s)
        ''', (user_id, f'Deleted course: {course_name} (ID: {course_id})'))

        app.mysql.connection.commit()

        return jsonify({'message': 'Course deleted successfully'}), 200

    except Exception as e:
        app.mysql.connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()


@bp.route('/courses', methods=['GET'])
@admin_required
def get_all_courses_admin():
    """Get all courses with additional admin info"""
    cursor = app.mysql.connection.cursor()

    try:
        cursor.execute('''
            SELECT
                c.id,
                c.name,
                c.description,
                c.difficulty,
                c.summary,
                c.learning_objectives,
                c.duration_min_minutes,
                c.duration_max_minutes,
                c.thumbnail_url,
                c.created_at,
                COUNT(DISTINCT ct.tutorial_id) as tutorial_count,
                COUNT(DISTINCT ucp.user_id) as enrolled_count
            FROM courses c
            LEFT JOIN course_tutorials ct ON c.id = ct.course_id
            LEFT JOIN user_course_progress ucp ON c.id = ucp.course_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        ''')

        courses = [{
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'difficulty': row[3],
            'summary': row[4],
            'learning_objectives': row[5],
            'duration_min_minutes': row[6],
            'duration_max_minutes': row[7],
            'thumbnail_url': row[8],
            'created_at': str(row[9]),
            'tutorial_count': row[10],
            'enrolled_count': row[11]
        } for row in cursor.fetchall()]

        return jsonify(courses), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
