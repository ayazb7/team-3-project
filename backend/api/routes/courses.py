from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
import courses_routes_utils as utils

bp = Blueprint('courses', __name__, url_prefix='/courses')



@bp.route('/public', methods=['GET'])
def get_public_courses():
    return jsonify(utils.get_public_courses()), 200


@bp.route('', methods=['GET'])
@jwt_required()
def get_courses():
    return utils.get_courses()

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
