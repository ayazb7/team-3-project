
from flask import Blueprint, request, jsonify
import requests
import markdown
from socket_wrapper import socketio


BOT_TEST_ENDPOINT = "http://localhost:11434/api/generate"
MODEL = "gemma3:4b"
STREAM = False

requestDict = {
    "prompt": "",
    "model": MODEL,
    "stream": STREAM
}

# bp = Blueprint('bot', __name__, url_prefix="/chat")

@socketio.on('connect' , namespace='/chat')
def handle_connect():
    print('Client connected to /chat namespace')
    socketio.emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/chat')
def handle_disconnect():
    print('Client disconnected from /chat namespace')

@socketio.on('message', namespace='/chat')
def handle_message(message):
    print('Received message:', message)
    socketio.emit('response', {'data': 'Message received!'}, namespace='/chat')


# @bp.route('/generate', methods=['POST'])
# def generate():
#     print("reached")
#     data = request.get_json()

#     if not data:
#         return jsonify({'error': 'missing json body'})


#     prompt = data["prompt"]

#     requestDict["prompt"] = prompt

#     res = requests.post(BOT_TEST_ENDPOINT, json=requestDict)
#     text = res.json()

#     # print(text["response"])

#     built_response = markdown.markdown(text["response"])


#     print(built_response)
#     return jsonify({"response": built_response})

    

