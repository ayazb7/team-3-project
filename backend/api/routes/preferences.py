from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

import app

bp = Blueprint('preferences', __name__, url_prefix='')

@bp.route('/preferences', methods=['GET'])
@jwt_required()
def get_preferences():
    """
    Get user preferences for the current authenticated user.
    
    Returns:
        { "preferences": { ... } } or empty dict if no preferences set
    """
    user_id = int(get_jwt_identity())
    cursor = app.mysql.connection.cursor()
    
    try:
        cursor.execute(
            "SELECT preferences FROM user_preferences WHERE user_id = %s",
            (user_id,)
        )
        result = cursor.fetchone()
        cursor.close()
        
        if result:
            # Parse JSON preferences
            preferences = json.loads(result['preferences']) if isinstance(result['preferences'], str) else result['preferences']
            return jsonify({"preferences": preferences}), 200
        else:
            # Return default preferences if none set
            return jsonify({"preferences": {}}), 200
            
    except Exception as e:
        cursor.close()
        return jsonify({'error': str(e)}), 500


@bp.route('/preferences', methods=['POST'])
@jwt_required()
def save_preferences():
    """
    Save or update user preferences for the current authenticated user.
    
    Request body:
        { "preferences": { ... } }
    
    Returns:
        { "message": "Preferences saved successfully" }
    """
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or 'preferences' not in data:
        return jsonify({'error': 'Preferences data required'}), 400
    
    preferences = data['preferences']
    preferences_json = json.dumps(preferences)
    
    cursor = app.mysql.connection.cursor()
    
    try:
        # Check if preferences already exist
        cursor.execute(
            "SELECT id FROM user_preferences WHERE user_id = %s",
            (user_id,)
        )
        existing = cursor.fetchone()
        
        if existing:
            # Update existing preferences
            cursor.execute(
                """UPDATE user_preferences 
                   SET preferences = %s, updated_at = NOW() 
                   WHERE user_id = %s""",
                (preferences_json, user_id)
            )
        else:
            # Insert new preferences
            cursor.execute(
                """INSERT INTO user_preferences (user_id, preferences) 
                   VALUES (%s, %s)""",
                (user_id, preferences_json)
            )
        
        app.mysql.connection.commit()
        cursor.close()
        
        return jsonify({"message": "Preferences saved successfully"}), 200
        
    except Exception as e:
        app.mysql.connection.rollback()
        cursor.close()
        return jsonify({'error': str(e)}), 500


@bp.route('/preferences/reset', methods=['POST'])
@jwt_required()
def reset_preferences():
    """
    Reset user preferences to defaults by deleting the record.
    
    Returns:
        { "message": "Preferences reset successfully" }
    """
    user_id = int(get_jwt_identity())
    cursor = app.mysql.connection.cursor()
    
    try:
        cursor.execute(
            "DELETE FROM user_preferences WHERE user_id = %s",
            (user_id,)
        )
        app.mysql.connection.commit()
        cursor.close()
        
        return jsonify({"message": "Preferences reset successfully"}), 200
        
    except Exception as e:
        app.mysql.connection.rollback()
        cursor.close()
        return jsonify({'error': str(e)}), 500

