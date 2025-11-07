from flask_socketio import SocketIO

socketio = SocketIO(cors_allowed_origins=["http://localhost:83"], async_mode='eventlet', allow_upgrades=True)