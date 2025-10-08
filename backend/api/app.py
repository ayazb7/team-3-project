import sys
from flask import Flask
from config import Config
from extensions import init_extensions

def create_app() -> Flask:
    app = Flask(__name__)

    app.config.from_object(Config)

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