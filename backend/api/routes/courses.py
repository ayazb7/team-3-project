from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import utils.courses_routes_utils as utils

bp = Blueprint('courses', __name__, url_prefix='/courses')


def calculate_course_progress(cursor, course_id, user_id):
    """
    Calculates user's progress for a course based on completed tutorials and passed quizzes (score >= 80%).

    Progress formula: (completed_tutorials + passed_quizzes) / (total_tutorials + total_quizzes) * 100

    Returns:
        float: Progress percentage (0-100), or 0 if no tutorials/quizzes exist
    """
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM course_tutorials
        WHERE course_id = %s
    """, (course_id,))
    total_tutorials_result = cursor.fetchone()
    total_tutorials = total_tutorials_result['count'] if total_tutorials_result else 0
    
    cursor.execute("""
        SELECT COUNT(DISTINCT q.id) as count
        FROM quizzes q
        INNER JOIN tutorials t ON q.tutorial_id = t.id
        INNER JOIN course_tutorials ct ON t.id = ct.tutorial_id
        WHERE ct.course_id = %s
    """, (course_id,))
    total_quizzes_result = cursor.fetchone()
    total_quizzes = total_quizzes_result['count'] if total_quizzes_result else 0
    
    if total_tutorials == 0 and total_quizzes == 0:
        return 0.0
    
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
    
    # Get user's passed quizzes for tutorials in this course (score >= 80%)
    cursor.execute("""
        SELECT COUNT(DISTINCT uqr.quiz_id) as count
        FROM user_quiz_results uqr
        INNER JOIN quizzes q ON uqr.quiz_id = q.id
        INNER JOIN tutorials t ON q.tutorial_id = t.id
        INNER JOIN course_tutorials ct ON t.id = ct.tutorial_id
        WHERE ct.course_id = %s
        AND uqr.user_id = %s
        AND uqr.score >= 80
    """, (course_id, user_id))
    passed_quizzes_result = cursor.fetchone()
    passed_quizzes = passed_quizzes_result['count'] if passed_quizzes_result else 0
    
    total_items = total_tutorials + total_quizzes
    completed_items = completed_tutorials + passed_quizzes
    
    if total_items == 0:
        return 0.0
    
    progress = (completed_items / total_items) * 100
    return round(progress, 2)

@bp.route('/public', methods=['GET'])
def get_public_courses():
    return jsonify(utils.get_public_courses()), 200


@bp.route('', methods=['GET'])
@jwt_required()
def get_courses():
    return utils.get_courses()

@bp.route('/unenrolled-courses', methods=['GET'])
@jwt_required()
def get_unenrolled_courses():
    user_id = get_jwt_identity()
    data, code = utils.get_unenrolled_courses(user_id)
    return jsonify(data), code

@bp.route('/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    return  utils.get_course(course_id)

@bp.route('/<int:course_id>/tutorials', methods=['GET'])
@jwt_required()
def get_course_tutorials(course_id):
    return utils.get_course_tutorials(course_id)

@bp.route('/<int:course_id>/tutorials/<int:tutorial_id>', methods=['GET'])
@jwt_required()
def get_tutorial(course_id, tutorial_id):
   return utils.get_tutorial(course_id, tutorial_id)

@bp.route('/<int:course_id>/progress', methods=['POST'])
@jwt_required()
def update_course_progress(course_id):
    return utils.update_course_progress(course_id)    

@bp.route('/<int:course_id>/progress', methods=['GET'])
@jwt_required()
def get_course_progress(course_id):
    return utils.get_course_progress(course_id)

@bp.route('/<int:course_id>/next-step', methods=['GET'])
@jwt_required()
def get_next_step(course_id):
    return utils.get_next_step(course_id)
