from flask import Blueprint, jsonify, request
import MySQLdb.cursors
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

import app

bp = Blueprint('courses', __name__, url_prefix='/courses')


def calculate_course_progress(cursor, course_id, user_id):
    """
    Calculates user's progress for a course based on completed tutorials and submitted quizzes.
    
    Progress formula: (completed_tutorials + submitted_quizzes) / (total_tutorials + total_quizzes) * 100
    
    Returns:
        float: Progress percentage (0-100), or 0 if no tutorials/quizzes exist
    """
    # Get total tutorials for this course
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM course_tutorials
        WHERE course_id = %s
    """, (course_id,))
    total_tutorials_result = cursor.fetchone()
    total_tutorials = total_tutorials_result['count'] if total_tutorials_result else 0
    
    # Get total quizzes for this course (quizzes linked to tutorials in this course)
    cursor.execute("""
        SELECT COUNT(DISTINCT q.id) as count
        FROM quizzes q
        INNER JOIN tutorials t ON q.tutorial_id = t.id
        INNER JOIN course_tutorials ct ON t.id = ct.tutorial_id
        WHERE ct.course_id = %s
    """, (course_id,))
    total_quizzes_result = cursor.fetchone()
    total_quizzes = total_quizzes_result['count'] if total_quizzes_result else 0
    
    # If no tutorials or quizzes, return 0
    if total_tutorials == 0 and total_quizzes == 0:
        return 0.0
    
    # Get user's completed tutorials for this course
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM user_tutorial_progress utp
        INNER JOIN course_tutorials ct ON utp.tutorial_id = ct.tutorial_id
        WHERE ct.course_id = %s 
        AND utp.user_id = %s 
        AND utp.completed = TRUE
    """, (course_id, user_id))
    completed_tutorials_result = cursor.fetchone()
    completed_tutorials = completed_tutorials_result['count'] if completed_tutorials_result else 0
    
    # Get user's submitted quizzes for tutorials in this course
    cursor.execute("""
        SELECT COUNT(DISTINCT uqr.quiz_id) as count
        FROM user_quiz_results uqr
        INNER JOIN quizzes q ON uqr.quiz_id = q.id
        INNER JOIN tutorials t ON q.tutorial_id = t.id
        INNER JOIN course_tutorials ct ON t.id = ct.tutorial_id
        WHERE ct.course_id = %s 
        AND uqr.user_id = %s
    """, (course_id, user_id))
    submitted_quizzes_result = cursor.fetchone()
    submitted_quizzes = submitted_quizzes_result['count'] if submitted_quizzes_result else 0
    
    # Calculate progress percentage
    total_items = total_tutorials + total_quizzes
    completed_items = completed_tutorials + submitted_quizzes
    
    if total_items == 0:
        return 0.0
    
    progress = (completed_items / total_items) * 100
    return round(progress, 2)

@bp.route('', methods=['GET'])
@jwt_required()
def get_courses():
    """
    Returns all courses with summary data suitable for a list view.
    Includes progress percentage for each course based on user's completed tutorials and submitted quizzes.
    """
    user_id = get_jwt_identity()
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
                    SELECT
                        c.id,
                        c.name,
                        c.description,
                        c.difficulty,
                        c.duration_min_minutes,
                        c.duration_max_minutes,
                        c.thumbnail_url,
                        COALESCE(ucp.progress_percentage, 0) AS progress_percentage
                    FROM courses c
                    LEFT JOIN user_course_progress ucp
                        ON c.id = ucp.course_id AND ucp.user_id = %s
                    ORDER BY c.id
                    """, (user_id,))
    courses = cursor.fetchall()

    # Calculate progress for each course
    for course in courses:
        course['progress'] = calculate_course_progress(cursor, course['id'], user_id)

    cursor.close()
    return jsonify(courses), 200


@bp.route('/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    """
    Returns a specific course, including its prerequisites and requirements.

    Response:
        {
            "id": number,
            "name": string,
            "description": string,
            // ... other course fields
            "prerequisites": [
                { "id": number, "name": string },
                ...
            ],
            "requirements": [
                { "requirement_text": string },
                ...
            ]
        }
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Fetch the main course details
    cursor.execute("""
        SELECT id, name, description, difficulty, summary,
               learning_objectives, duration_min_minutes, duration_max_minutes
        FROM courses
        WHERE id = %s
    """, (course_id,))
    course = cursor.fetchone()

    if not course:
        cursor.close()
        return jsonify({'error': 'Course not found'}), 404
        
    # Parse the learning_objectives string into a list
    if course.get('learning_objectives'):
        course['learning_objectives'] = json.loads(course['learning_objectives'])
    else:
        course['learning_objectives'] = []

    # Fetch the prerequisites (links to other courses)
    cursor.execute("""
        SELECT c.id, c.name
        FROM course_prerequisites AS cp
        INNER JOIN courses AS c ON cp.prerequisite_course_id = c.id
        WHERE cp.course_id = %s
    """, (course_id,))
    course['prerequisites'] = cursor.fetchall()

    # Fetch the text-based requirements
    cursor.execute("""
        SELECT requirement_text
        FROM course_requirements
        WHERE course_id = %s
    """, (course_id,))
    requirements_data = cursor.fetchall()
    course['requirements'] = [item['requirement_text'] for item in requirements_data]
    
    # Calculate and add progress
    user_id = get_jwt_identity()
    course['progress'] = calculate_course_progress(cursor, course_id, user_id)

    cursor.close()
    return jsonify(course), 200


@bp.route('/<int:course_id>/tutorials', methods=['GET'])
@jwt_required()
def get_course_tutorials(course_id):
    """
    Returns all tutorials for a specific course
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        """
        SELECT
            t.id,
            t.title,
            t.description,
            t.video_provider,
            t.video_url,
            t.category
        FROM course_tutorials AS ct
        INNER JOIN tutorials AS t ON ct.tutorial_id = t.id
        WHERE ct.course_id = %s
        ORDER BY t.id
        """,
        (course_id,),
    )
    tutorials = cursor.fetchall()
    cursor.close()
    return jsonify(tutorials), 200


@bp.route('/<int:course_id>/tutorials/<int:tutorial_id>', methods=['GET'])
@jwt_required()
def get_tutorial(course_id, tutorial_id):
    """
    Returns a specific tutorial for a specific course
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        """
        SELECT 
            t.id, 
            t.title, 
            t.description, 
            t.video_provider, 
            t.video_url, 
            t.category,
            t.created_at
        FROM course_tutorials AS ct
        INNER JOIN tutorials AS t ON ct.tutorial_id = t.id
        WHERE ct.course_id = %s AND t.id = %s
        """,
        (course_id, tutorial_id,),
    )
    tutorial = cursor.fetchone()
    cursor.close()
    if not tutorial:
        return jsonify({'error': 'Tutorial not found'}), 404
    return jsonify(tutorial), 200

@bp.route('/<int:course_id>/progress', methods=['POST'])
@jwt_required()
def update_course_progress(course_id):
    """
    Updates or creates a record of user progress for a specific course.
    Expects JSON body: { "progress_percentage": <int> }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        progress_percentage = data.get('progress_percentage', 1)
        
        cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Check if progress record exists
        cursor.execute("""
            SELECT id FROM user_course_progress 
            WHERE user_id = %s AND course_id = %s
        """, (user_id, course_id))
        
        existing = cursor.fetchone()
        
        if existing:
            # Update existing progress
            cursor.execute("""
                UPDATE user_course_progress 
                SET progress_percentage = %s, last_updated = NOW()
                WHERE user_id = %s AND course_id = %s
            """, (progress_percentage, user_id, course_id))
        else:
            # Insert new progress record
            cursor.execute("""
                INSERT INTO user_course_progress 
                (user_id, course_id, progress_percentage, last_updated)
                VALUES (%s, %s, %s, NOW())
            """, (user_id, course_id, progress_percentage))
        
        app.mysql.connection.commit()
        cursor.close()
        
        return jsonify({"message": "Progress updated successfully"}), 200
        
    except Exception as e:
        print(f"Error updating course progress: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@bp.route('/<int:course_id>/progress', methods=['GET'])
@jwt_required()
def get_course_progress(course_id):
    """
    Retrieves the user's current progress for a specific course.
    Returns JSON: { "course_id": <int>, "progress_percentage": <float> }
    """
    try:
        user_id = get_jwt_identity()
        cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        cursor.execute("""
            SELECT progress_percentage 
            FROM user_course_progress
            WHERE user_id = %s AND course_id = %s
        """, (user_id, course_id))

        progress = cursor.fetchone()
        cursor.close()

        if progress:
            return jsonify({
                "course_id": course_id,
                "progress_percentage": float(progress["progress_percentage"])
            }), 200
        else:
            return jsonify({
                "course_id": course_id,
                "progress_percentage": 0.0
            }), 200

    except Exception as e:
        print(f"Error fetching course progress: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

