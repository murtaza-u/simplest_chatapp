from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = "oywpQyaUqh8qXY8NcNqzLbcAT51ntD"
app.config['DEBUG'] = True
socketio = SocketIO(app)

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        username = request.form.get('username')
        if username != "":
            return render_template('chat.html', username=username)
    return render_template('index.html')

@socketio.on('joined_room')
def handle_new_connection(username):
    emit('joined_announcement', username, broadcast=True)

@socketio.on('new_message')
def handle_new_message(data):
    emit('broadcast_message', data, broadcast=True)

@socketio.on('file')
def broadcast_file(data):
    emit('file_received', data, broadcast=True, include_self=False)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0")
