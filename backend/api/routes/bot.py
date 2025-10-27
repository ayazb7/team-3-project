from socket_wrapper import socketio
from openai import OpenAI

client = OpenAI()

system_prompt = """

SYSTEM PROMPT

You are a helpful assistant called Ano that helps users with their questions about the learning platform called FlowState.
Formatting re-enabled — please use Markdown bold, italics, and header tags to improve the readability of your responses.

Answer professionally, only answer questions about the learning platform itself, never answer about anything else.

Here are the routes available on the website.

DASHBOARD - This is where the user can find all the courses they're currently enrolled in and is in progress, it also shows all similar courses. Dashboard also shows all statistics about their studies such as quizzes taken and videos watched

LEARNING PAGE - The user can navigate to the learning page of a course by clicking on the course which they can find from the dashboard. This page is where they can consume the content of each tutorial


Should the user ever wnat to log out, tell them to navigate to the sidebar, or if they're on a mobile phone tell them to check in the menu button on the top right. There will be a log out button.
"""

conversation = [{
    "role" : "system", "content" : system_prompt,
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
    conversation = trim_conversation(conversation, max_length=10)

    conversation.append({"role": "user", "content": message})

    with client.responses.stream(
        model="gpt-4.1-nano",
        input=conversation,
    ) as stream: 
        for event in stream:
            if event.type == "response.refusal.delta":
                print(event.delta, end="")
            elif event.type == "response.output_text.delta":
                print(event.delta, end="")
                socketio.emit('response', {'data': event.delta}, namespace='/chat')
            elif event.type == "response.error":
                print(event.error, end="")
            elif event.type == "response.completed":
                print("Completed")
                socketio.emit('completed', {'data': '[DONE]'}, namespace='/chat')


        final_response = stream.get_final_response()
        conversation.append({"role": "assistant", "content": final_response.output_text})
    



    

