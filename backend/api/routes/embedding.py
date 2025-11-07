from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
import utils.embedding_utils as utils

bp = Blueprint('embedding', __name__, url_prefix='/embedding')

@bp.route('', methods=['GET'])
def handle_embed_request():
    utils.embed_courses()
    return jsonify({"data": "HI"}), 200