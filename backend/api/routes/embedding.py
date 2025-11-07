from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
import utils.embedding_utils as utils

bp = Blueprint('embedding', __name__, url_prefix='/embedding')

@bp.route('', methods=['POST'])
@jwt_required()
def handle_embed_request():
    text = request.get_json()["text"]
    data = utils.get_courses_from_embedding(text) 
    return jsonify({"data": data}), 200