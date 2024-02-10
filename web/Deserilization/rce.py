import subprocess
import base64
import pickle
import logging
from flask import Flask, request, make_response, render_template

app = Flask(__name__)

# Secret flag stored on the remote host
SECRET_FLAG = "i-CES{1ns3cure_de5erial1zat10n_f1ag}"

class Session:
    def __init__(self, username, is_admin=False):
        self.username = username
        self.is_admin = is_admin

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        
        # Perform authentication logic (e.g., check username and password)
        # For simplicity, let's assume the login is successful
        session = Session(username)
        serialized_session = base64.b64encode(pickle.dumps(session)).decode('utf-8')
        response = make_response(render_template('homepage.html'))
        response.set_cookie('session_cookie', serialized_session)  # Serialize session object into a cookie
        return response
    
    # For GET requests, create a session with the username "user"
    try:
        session = request.cookies.get('session_cookie')
        session = pickle.loads(base64.b64decode(session.encode('utf-8')))
        response = make_response(render_template('login.html'))
        response.set_cookie('session_cookie', serialized_session)  # Serialize session object into a cookie
        return response
    except:
        session = "user"
        serialized_session = base64.b64encode(pickle.dumps(session)).decode('utf-8')
        response = make_response(render_template('homepage.html'))
        response.set_cookie('session_cookie', serialized_session)  # Serialize session object into a cookie
        return response


@app.route('/admin')
def admin_panel():
    session_data = request.cookies.get('session_cookie')
    if session_data:
        try:
            session = pickle.loads(base64.b64decode(session_data.encode('utf-8')))  # Deserialize session data
            # Check if the user is an admin and perform admin actions
            if session.is_admin:
                return f"Welcome to the admin panel, {session.username}!"
            else:
                return "You are not authorized to access this page as an admin."
        except Exception as e:
            logging.error(f"Error processing session: {e}")
            return "Error processing session.", 500
    return "Session data not found.", 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
