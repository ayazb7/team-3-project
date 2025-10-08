import sys
from flask import Flask
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager
from config import Config

cors = CORS()
mysql = MySQL()
jwt = JWTManager()

def init_extensions(app):
    cors.init_app(app)
    jwt.init_app(app)
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

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(quizzes_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)