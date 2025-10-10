from flask import Blueprint, jsonify
import MySQLdb.cursors
from flask_jwt_extended import jwt_required, get_jwt_identity

import app

bp = Blueprint('users', __name__, url_prefix='')

@bp.route('/user_details', methods=['GET'])
@jwt_required()
def user_details():
    """
    Return details for the current authenticated user using JWT identity.

    Response:
        { "id": number, "username": string, "email": string }
    """
    user_id = int(get_jwt_identity())
    cursor = app.mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user), 200

