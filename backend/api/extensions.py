from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager

cors = CORS()
mysql = MySQL()
jwt = JWTManager()

def init_extensions(app):
    cors.init_app(app)
    mysql.init_app(app)
    jwt.init_app(app)

