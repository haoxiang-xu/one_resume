from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os

from extensions import limiter

register_blueprint = Blueprint('auth', __name__, url_prefix='/api/register')

# { registering } ---------------------------------------------------------------------------------------------------------------------------------------- #

# check if username is already exists
@register_blueprint.route('/check_username_exists/<username>', methods=['GET'])
def register_check_username_exists(username):
    pass

# check if email is already exists
@register_blueprint.route('/check_email_exists/<email>', methods=['GET'])
def register_check_email_exists(email):
    pass

# check if phone number is already exists
@register_blueprint.route('/check_phone_number_exists/<phone_number>', methods=['GET'])
def register_check_phone_number_exists(phone_number):
    pass

# register a new user
@register_blueprint.route('', methods=['POST'])
@register_blueprint.route('/', methods=['POST'], strict_slashes=False)
@limiter.limit("5 per minute")
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
            "_id": data['contact']['email'],
            "role": "user",
            "email": data['contact']['email'],
            "phone_number": data['contact']['cell']['countryCode'] + data['contact']['cell']['number'],
            "first_name": data['name']['firstName'],
            "last_name": data['name']['lastName'],
            "username": data['user']['username'],
            "password": generate_password_hash(data['user']['password']),
        }
        new_user_info = {
            "_id": data['contact']['email'],
            "first_name": data['name']['firstName'],
            "last_name": data['name']['lastName'],
            "contact": data['contact'],
            "education": data['education'],
            "experience": data['experience'],
        }
        
        user_auth_collection.insert_one(new_user_auth)
        user_info_collection.insert_one(new_user_info)
        client.close()
        
        return jsonify({
            'message': 'user created successfully!',
            'user_id': data['contact']['email'],
        })
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# { registering } ---------------------------------------------------------------------------------------------------------------------------------------- #
