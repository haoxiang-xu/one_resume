import os
import re
import jwt
import math
from bson import ObjectId
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, redirect, make_response, g
from flask_cors import CORS
from flask_limiter.errors import RateLimitExceeded
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from urllib.parse import urlencode

from extensions import limiter
from routes.register_route import register_blueprint
from routes.auth_route import auth_blueprint
from routes.user_route import user_blueprint
from routes.resume_route import resume_blueprint

FRONTEND_ORIGIN = os.getenv("FRONTEND_URL", "http://localhost:2907")

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,               # 允许携带 Cookie
    methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"]
)
load_dotenv()

limiter.init_app(app)

app.register_blueprint(register_blueprint)
app.register_blueprint(auth_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(resume_blueprint)

# Email configuration
app.config['SMTP_EMAIL'] = "lance924852785@gmail.com"
app.config['SMTP_PASSWORD'] = "gwflwteesyburspz"

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'LMdcjmsgY-ABxvGd1EBvq4jGQGAg-lqeSylnPrdQu_DM-3Z6dDHeiiLFROjc5u6Y'
app.config["JWT_COOKIE_NAME"] = "access_token"        # 自定义
app.config["JWT_COOKIE_SECURE"] = False               # 本地开发 http
app.config["JWT_COOKIE_SAMESITE"] = "Lax"             # 跨站表单登录可用；生产跨域再改 None+Secure
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

# Google OAuth configuration
app.config['GOOGLE_CLIENT_ID'] = os.getenv('GOOGLE_CLIENT_ID')
app.config['GOOGLE_CLIENT_SECRET'] = os.getenv('GOOGLE_CLIENT_SECRET')
app.config['GOOGLE_REDIRECT_URI'] = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8888/api/auth/google/callback')
app.config['FRONTEND_ENDPOINT'] = os.getenv('FRONTEND_URL')

# { google login } ---------------------------------------------------------------------------------------------------------------------------------------- #
@app.route('/api/auth/google/login', methods=['GET'])
def google_login():
    """Initiate Google OAuth flow"""
    try:
        # Google OAuth 2.0 authorization endpoint
        auth_url = 'https://accounts.google.com/o/oauth2/auth'
        
        params = {
            'client_id': app.config['GOOGLE_CLIENT_ID'],
            'redirect_uri': app.config['GOOGLE_REDIRECT_URI'],
            'scope': 'openid email profile',
            'response_type': 'code',
            'access_type': 'offline',
            'prompt': 'consent'
        }
        
        authorization_url = f"{auth_url}?{urlencode(params)}"
        
        return jsonify({
            'authorization_url': authorization_url
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# { google login } ---------------------------------------------------------------------------------------------------------------------------------------- #

# { google login callback } ------------------------------------------------------------------------------------------------------------------------------ #
@app.route('/api/auth/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback"""
    try:
        code = request.args.get('code')
        if not code:
            return jsonify({'message': 'Authorization code not provided'}), 400
        
        # Exchange authorization code for access token, and the access token will be used for getting the user info from Google
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'client_id': app.config['GOOGLE_CLIENT_ID'],
            'client_secret': app.config['GOOGLE_CLIENT_SECRET'],
            'redirect_uri': app.config['GOOGLE_REDIRECT_URI'],
            'grant_type': 'authorization_code',
            'code': code
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()
        
        if 'error' in token_json:
            return jsonify({'message': f'Failed to get access token: {token_json.get("error_description", token_json["error"])}'}), 400
        
        # Get user info using access token
        access_token = token_json.get('access_token')
        user_info_response = requests.get(
            # Get user info from Google
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if user_info_response.status_code != 200:
            return jsonify({'message': 'Failed to get user info from Google'}), 400
            
        user_info = user_info_response.json()
        
        # Extract user information
        google_user_id = user_info['id']
        email = user_info['email']
        given_name = user_info.get('given_name', '')
        family_name = user_info.get('family_name', '')
        picture = user_info.get('picture', '')
        
        # Database operations (same as before)
        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_auth_collection = database["user_auth"]
        user_info_collection = database["user_info"]
        
        # Check if user already exists
        existing_user = user_auth_collection.find_one({"email": email})
        
        if existing_user:
            # User exists, update Google ID if not set
            if not existing_user.get('google_id'):
                user_auth_collection.update_one(
                    {"email": email},
                    {"$set": {"google_id": google_user_id}}
                )
            user_id = existing_user['_id']
            role = existing_user['role']
        else:
            # Create new user
            new_user_auth = {
                "_id": email,
                "role": "user",
                "email": email,
                "google_id": google_user_id,
                "first_name": given_name,
                "last_name": family_name,
                "username": email.split('@')[0],
                "password": None,
                "created_via": "google"
            }
            
            new_user_info = {
                "_id": email,
                "first_name": given_name,
                "last_name": family_name,
                "profile_picture": picture,
                "contact": {
                    "email": email,
                    "cell": {"countryCode": "", "number": ""}
                },
                "education": [],
                "experience": [],
                "created_via": "google"
            }
            
            user_auth_collection.insert_one(new_user_auth)
            user_info_collection.insert_one(new_user_info)
            
            user_id = email
            role = "user"
        
        client.close()
        
        # Generate JWT token
        payload = {
            'user_id': str(user_id),
            'role': role,
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }
        token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        
        # Return JSON response like normal login API
        resp = make_response(redirect(app.config['FRONTEND_ENDPOINT']))
        resp.set_cookie(
            key="access_token",
            value=token,
            httponly=True,      # JS 无法读，防 XSS
            samesite="Lax",     # 正常表单跳转可带 Cookie，跨站点 GET 不会
            secure=False,       # 本地开发 http 用 False；线上 https 一定设 True
            max_age=60*60*24*7, # 7 天
            path="/"            # 前端所有路由都能带上
            # domain="localhost"  # 默认即可；如果用自定义域，写成 ".example.com"
        )
        return resp
    except Exception as e:
        print(f"DEBUG: General exception: {str(e)}")
        # Return error as JSON
        return jsonify({
            'message': f'Google login failed: {str(e)}'
        }), 500
# { google login callback } ------------------------------------------------------------------------------------------------------------------------------ #


# { debug } ---------------------------------------------------------------------------------------------------------------------------------------------- #
@app.route('/api/debug/google-config', methods=['GET'])
def debug_google_config():
    return jsonify({
        'google_client_id': app.config.get('GOOGLE_CLIENT_ID', 'NOT_SET'),
        'google_client_secret': app.config.get('GOOGLE_CLIENT_SECRET', 'NOT_SET')[:10] + '...' if app.config.get('GOOGLE_CLIENT_SECRET') else 'NOT_SET',
        'google_redirect_uri': app.config.get('GOOGLE_REDIRECT_URI', 'NOT_SET'),
        'frontend_url': os.getenv('FRONTEND_URL', 'NOT_SET')
    })
# { debug } ---------------------------------------------------------------------------------------------------------------------------------------------- #

# { error handling } ------------------------------------------------------------------------------------------------------------------------------------- #
@app.errorhandler(RateLimitExceeded)
def ratelimit_handler(e):
    retry_after = None
    match = re.search(r"reset in (\d+) seconds", str(e.description))
    if match:
        retry_after = int(match.group(1))
    if retry_after is not None:
        minutes = math.ceil(retry_after / 60)
        msg = f"Too many requests, please try again later. You can try again in {minutes} minute(s)."
    else:
        msg = "Too many requests, please try again later."
    return jsonify({
        "message": msg,
        "detail": str(e)
    }), 429
# { error handling } ------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/')
def home():
    return 'Debug: Flask server is running on port 8888'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888)
