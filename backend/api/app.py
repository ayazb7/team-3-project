import sys
import os
import eventlet
eventlet.monkey_patch()
from flask import Flask, g, current_app
from flask_cors import CORS
import pymysql
from flask_jwt_extended import JWTManager
from config import Config
from socket_wrapper import socketio

cors = CORS()
jwt = JWTManager()

class MySQL:
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        self.app = app
        app.mysql = self 
        app.teardown_appcontext(self.teardown)
    
    def connect(self):
        return pymysql.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            database=current_app.config['MYSQL_DB'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False
        )
    
    def teardown(self, exception):
        ctx = g.pop('_mysql_connection', None)
        if ctx is not None:
            try:
                if exception:
                    ctx.rollback()
                ctx.close()
            except Exception:
                pass
    
    @property
    def connection(self):
        if '_mysql_connection' not in g:
            g._mysql_connection = self.connect()
        return g._mysql_connection

mysql = MySQL()

def init_extensions(app):
    cors.init_app(
        app,
        origins=app.config.get('CORS_ORIGINS', ['http://localhost:5173']),
        supports_credentials=True,
        allow_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    )
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins=app.config.get('CORS_ORIGINS', ['http://localhost:5173']))
    if not app.config.get('TESTING'):
        mysql.init_app(app)
    
    @app.after_request
    def add_security_headers(response):
        response.headers['X-Frame-Options'] = 'ALLOWALL'
        response.headers['Cross-Origin-Embedder-Policy'] = 'unsafe-none'
        response.headers['Cross-Origin-Opener-Policy'] = 'unsafe-none'
        return response

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

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(quizzes_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(tutorials_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(preferences_bp)
    app.register_blueprint(embedding_bp)

    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'service': 'skywise-api'}, 200

    if not testing:
        _init_background_tasks(app)
    
    return app


def _init_background_tasks(app):
    """Initialize background tasks like bot and embeddings"""
    import routes.bot as bot
    import threading
    from utils.embedding_utils import ensure_courses_embedded
    
    app.bot_module = bot
    app._bot_initialized = False
    app._embeddings_initialized = False
    
    def init_embeddings_background():
        """Initialize course embeddings in background on startup"""
        try:
            with app.app_context():
                ensure_courses_embedded()
                app._embeddings_initialized = True
                app.logger.info("Course embeddings initialized successfully")
        except Exception as e:
            app.logger.warning(f"Embeddings initialization error: {e}")
    
    @app.before_request
    def init_bot_once():
        """Initialize bot module once on first request"""
        if not app._bot_initialized:
            try:
                with app.app_context():
                    app.bot_module.init()
                app._bot_initialized = True
            except Exception as e:
                app.logger.warning(f"Bot initialization deferred: {e}")
    
    @app.before_request
    def init_embeddings_once():
        """Initialize course embeddings in background thread on first request"""
        if not app._embeddings_initialized:
            try:
                thread = threading.Thread(target=init_embeddings_background, daemon=True)
                thread.start()
                app._embeddings_initialized = True
            except Exception as e:
                app.logger.warning(f"Failed to start embeddings thread: {e}")

if __name__ == '__main__':
    app = create_app()
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5003))
    host = os.getenv('HOST', '0.0.0.0')
    
    socketio.run(app, host=host, port=port, debug=debug_mode, log_output=True)
