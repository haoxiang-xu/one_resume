import os
from flask import Blueprint, jsonify, request, g
from extensions import limiter, require_auth
from pymongo import MongoClient
from werkzeug.security import generate_password_hash

user_blueprint = Blueprint('user', __name__, url_prefix='/api/user')

# { user related routes } ---------------------------------------------------------------------------------------------------------------------------------------- #
# get all user info
@user_blueprint.route("/get_user_info", methods=["GET"])
@limiter.limit("60 per minute")
@require_auth
def get_user_info():
    try:
        user_id = g.current_user['user_id']
        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_info_collection = database["user_info"]

        user_info = user_info_collection.find_one({"_id": user_id})

        if not user_info:
            client.close()
            return jsonify({'message': 'User not found!'}), 404
        
        user_info["_id"] = str(user_info["_id"])
        user_info.pop('password', None)
        
        client.close()
        
        return jsonify(user_info), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# update user info
@user_blueprint.route("/update_user_info", methods=["PUT"])
@limiter.limit("60 per minute")
@require_auth
def update_user_info():
    try:
        user_id = g.current_user['user_id']
        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_info_collection = database["user_info"]
        
        # No user found check
        user_info = user_info_collection.find_one({"_id": user_id})
        if not user_info:
            client.close()
            return jsonify({'message': 'User not found!'}), 404

        # Get the updated user info from the request
        updated_info = request.json
        if not updated_info:
            client.close()
            return jsonify({'message': 'No data provided'}), 400

        # Update the user info in the database
        user_info_collection.update_one({"_id": user_id}, {"$set": updated_info})

        client.close()
        return jsonify({'message': 'User info updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# { user related routes } ---------------------------------------------------------------------------------------------------------------------------------------- #