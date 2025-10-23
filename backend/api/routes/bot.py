from flask import Blueprint, request, jsonify
import requests
import markdown
from socket_wrapper import socketio
from openai import OpenAI

client = OpenAI()

conversation = [{
    "role" : "system", "content" : "You are a helpful assistant called Ano that helps users with their questions about the learning platform called FlowState"
}]

def trim_conversation(conversation, max_length=10):
    system_prompts = [{"role": "system", "content": m["content"]} for m in conversation if m["role"] == "system"]

    if len(conversation) > max_length:
        bridged_conversation = system_prompts + conversation[-max_length:]
        return bridged_conversation
    return conversation


@socketio.on('connect' , namespace='/chat')
def handle_connect():
    print('Client connected to /chat namespace')
    socketio.emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/chat')
def handle_disconnect():
    print('Client disconnected from /chat namespace')

@socketio.on('message', namespace='/chat')
def handle_message(message):
    global conversation
    print('Received message:', message)

    # Trim conversation to last 10 messages
    conversation = trim_conversation(conversation, max_length=2)

    conversation.append({"role": "user", "content": message})
    response = client.responses.create(
        model="gpt-5",
        input=conversation,
    )

    conversation.append({"role": "assistant", "content": response.output_text})

    socketio.emit('response', {'data': response.output_text}, namespace='/chat')



    

