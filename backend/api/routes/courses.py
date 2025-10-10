from flask import Blueprint, jsonify
import MySQLdb.cursors
from flask_jwt_extended import jwt_required

import app

bp = Blueprint('courses', __name__, url_prefix='/courses')

@bp.route('', methods=['GET'])
@jwt_required()
def get_courses():
    """
    Returns all courses stored on the DB

    Response:
        [
            { "id": number, "description": string, "course_type": string },
            { "id": number, "description": string, "course_type": string }
        ]
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, name, description, course_type FROM courses")
    courses = cursor.fetchall()
    cursor.close()
    return jsonify(courses), 200


@bp.route('/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    """
    Returns a specific course based on course ID parameter

    Response:
        { "id": number, "description": string, "course_type": string }
    """
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, name, description, course_type FROM courses WHERE id = %s", (course_id,))
    course = cursor.fetchone()
    cursor.close()
    if not course:
        return jsonify({'error': 'Course not found'}), 404
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
