import sys
import os
import eventlet
eventlet.monkey_patch()
from flask import Flask
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager
from config import Config
from socket_wrapper import socketio

cors = CORS()
mysql = MySQL()
jwt = JWTManager()

def init_extensions(app):
    cors.init_app(
        app,
        origins=app.config.get('CORS_ORIGINS', ['http://localhost:83']),
        supports_credentials=True,
        allow_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    )
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins=app.config.get('CORS_ORIGINS', ['http://localhost:83']))
    if not app.config.get('TESTING'):
        mysql.init_app(app)

def create_app(testing: bool = False) -> Flask:
    app = Flask(__name__)

    app.config.from_object(Config)
    if testing:
        app.config['TESTING'] = True

    init_extensions(app)

    # Register routes
    from routes.auth import bp as auth_bp
    from routes.users import bp as users_bp
    from routes.courses import bp as courses_bp
    from routes.quizzes import bp as quizzes_bp
    from routes.dashboard import bp as dashboard_bp
    from routes.tutorials import bp as tutorials_bp
    from routes.admin import bp as admin_bp
    from routes.preferences import bp as preferences_bp
    from routes.embedding import bp as embedding_bp
    # from routes.bot import bp as bot_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(quizzes_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(tutorials_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(preferences_bp)
    app.register_blueprint(embedding_bp)
    # app.register_blueprint(bot_bp)

    import routes.bot as bot
    with app.app_context():
       bot.init() 
    return app

if __name__ == '__main__':
    app = create_app()
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5003))
    host = os.getenv('HOST', '0.0.0.0')
    
    socketio.run(app, host=host, port=port, debug=debug_mode, log_output=True)
