from flask import Blueprint, jsonify, request
import requests, os, re
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


@bp.route('/support_ticket', methods=['POST'])
def support_ticket():
    data = request.get_json(silent=True) or {}

    required_fields = ("name", "email", "subject", "message")
    missing = [k for k in required_fields if not data.get(k) or not str(data.get(k)).strip()]
    if missing:
        return jsonify({'error': 'Missing or empty required fields', 'fields': missing}), 400

    email = data['email'].strip()
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({'error': 'Invalid email address'}), 400

    access_key = os.getenv('WEB3FORMS_ACCESS_KEY')
    if not access_key:
        return jsonify({'error': 'Server not configured for Web3Forms'}), 500

    payload = {
        'access_key': access_key,
        'subject': data['subject'].strip(),
        'from_name': data['name'].strip(),
        'email': email,
        'from_email': email,
        'replyto': email,
        'message': data['message'].strip(),
        'website': 'team-3-project',
    }

    web3forms_url = 'https://api.web3forms.com/submit'

    try:
        resp = requests.post(
            web3forms_url,
            json=payload,                       # ← send JSON
            headers={'Accept': 'application/json'},
            timeout=10
        )
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to contact Web3Forms', 'details': str(e)}), 502

    # Parse JSON response safely
    try:
        body = resp.json()
    except ValueError:
        return jsonify({'error': 'Invalid response from Web3Forms'}), 502

    if resp.ok and body.get('success'):
        return jsonify({'message': 'Support request submitted successfully'}), 200

    # Bubble up detail for easier debugging in dev
    return jsonify({
        'error': 'Web3Forms rejected the submission',
        'status': resp.status_code,
        'details': body,
    }), 502
