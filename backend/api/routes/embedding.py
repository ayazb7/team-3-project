from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import utils.embedding_utils as utils

bp = Blueprint('embedding', __name__, url_prefix='/embedding')

@bp.route('course', methods=['POST'])
@jwt_required()
def handle_embed_request():
    user_id = get_jwt_identity()
    req = request.get_json()
    text = ""
    course_id = None

    if "text" in req:
        text = req["text"]
    
    if "id" in req:
        course_id =  req["id"]

    if course_id is None:
        
        data, code = utils.get_courses_from_embedding(text=text, user_id=user_id) 

        return jsonify(data), code
    else:
        data, code = utils.get_courses_from_embedding(text=text, ids=[course_id], user_id=user_id) 

        return jsonify(data), code

@bp.route('recommended', methods=['GET'])
@jwt_required()
def get_recommended_courses_based_on_user_details():
    user_id = get_jwt_identity()
    data, code =  utils.get_recommended_courses_based_on_user_details(user_id)
    return jsonify(data), code


@bp.route('embed-all', methods=['GET'])
@jwt_required()
def embed_all_courses():
    utils.embed_all_courses()
    return jsonify("embedded"),200