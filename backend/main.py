from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# { registering } ---------------------------------------------------------------------------------------------------------------------------------------- #
# { registering } ---------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/')
def home():
    return 'Debug: Flask server is running on port 8888'

if __name__ == '__main__':
    app.run(port=8888)