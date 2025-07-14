import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
load_dotenv()

# { registering } ---------------------------------------------------------------------------------------------------------------------------------------- #
# check if username is already exists
@app.route('/api/register/check_username_exists/<username>', methods=['GET'])
def register_check_username_exists(username):
    pass
# check if email is already exists 
@app.route('/api/register/check_email_exists/<email>', methods=['GET'])
def register_check_email_exists(email):
    pass
# check if phone number is already exists
@app.route('/api/register/check_phone_number_exists/<phone_number>', methods=['GET'])
def register_check_phone_number_exists(phone_number):
    pass
# register a new user
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        if (not data or
            not data.get('user') or
            not data['user'].get('username') or
            not data['user'].get('password')):
            return jsonify({'message': 'username and password are required!'}), 400
        
        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_auth_collection = database["user_auth"]
        user_info_collection = database["user_info"]
        
        if user_auth_collection.find_one({"username": data['user']['username']}):
            return jsonify({'message': 'Username already exists!'}), 400
        if user_auth_collection.find_one({"email": data['contact']['email']}):
            return jsonify({'message': 'email already exists!'}), 400
        if user_auth_collection.find_one({"phone_number": data['contact']['cell']['countryCode'] + data['contact']['cell']['number']}):
            return jsonify({'message': 'phone number already exists!'}), 400
        
        new_user_auth = {
            "_id": data['user']['username'],
            "role": "user",
            "email": data['contact']['email'],
            "phone_number": data['contact']['cell']['countryCode'] + data['contact']['cell']['number'],
            "first_name": data['name']['firstName'],
            "last_name": data['name']['lastName'],
            "username": data['user']['username'],
            "password": generate_password_hash(data['user']['password']),
        }
        new_user_info = {
            "_id": data['user']['username'],
            "contact": data['contact'],
            "education": data['education'],
            "experience": data['experience'],
        }
        
        user_auth_collection.insert_one(new_user_auth)
        user_info_collection.insert_one(new_user_info)
        client.close()
        
        return jsonify({
            'message': 'user created successfully!',
            'user_id': data['user']['username'],
        })
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# { registering } ---------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/')
def home():
    return 'Debug: Flask server is running on port 8888'

if __name__ == '__main__':
    app.run(port=8888)