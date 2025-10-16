from flask import Blueprint, jsonify
import MySQLdb.cursors
from flask_jwt_extended import jwt_required
import json

import app

bp = Blueprint('courses', __name__, url_prefix='/courses')

@bp.route('', methods=['GET'])
@jwt_required()
def get_courses():
    """
    Returns all courses with summary data suitable for a list view.
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
                    SELECT
                        id,
                        name,
                        description,
                        difficulty,
                        duration_min_minutes,
                        duration_max_minutes
                    FROM courses
                    """)
    courses = cursor.fetchall()
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

    cursor.close()
    return jsonify(course), 200


@bp.route('/<int:course_id>/tutorials', methods=['GET'])
@jwt_required()
def get_course_tutorials(course_id):
    """
    Returns all tutorials for a specific course

    Response:
        [
            {
                "category": string,
                "description": string,
                "id": number,
                "title": string,
                "video_provider": enum string (synthesia or youtube),
                "video_url": url string
            }
        ]
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

    Response:
        {
            "category": string,
            "description": string,
            "id": number,
            "title": string,
            "video_provider": enum string (synthesia or youtube),
            "video_url": url string
        }
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
        WHERE ct.course_id = %s AND t.id = %s
        """,
        (course_id, tutorial_id,),
    )
    tutorial = cursor.fetchone()
    cursor.close()
    if not tutorial:
        return jsonify({'error': 'Tutorial not found'}), 404
    return jsonify(tutorial), 200
