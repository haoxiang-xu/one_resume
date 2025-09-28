import os
import re
import jwt
import math
import random
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from flask import Flask, jsonify, request, redirect, make_response, g
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_limiter.errors import RateLimitExceeded
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import smtplib
import mimetypes
from email.message import EmailMessage
from functools import wraps
import requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from urllib.parse import urlencode

FRONTEND_ORIGIN = os.getenv("FRONTEND_URL", "http://localhost:2907")

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,               # 允许携带 Cookie
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
load_dotenv()

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"]  # 全局限流
)

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

# { login & logout } ------------------------------------------------------------------------------------------------------------------------------------- #
# check user status
@app.route("/api/auth/user", methods=["GET"])
def auth_user():
    token = request.cookies.get(app.config["JWT_COOKIE_NAME"])
    if not token:
        return jsonify({'message': 'unauth'}), 401
    try:
        payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return jsonify({
            'user_id': payload['user_id'],
            'role': payload['role'],
            # 你也可以在这儿返回更多（名字、头像）
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'invalid token'}), 401
# authenticate user
@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    try:
        data = request.get_json()
        if (not data or
            not data.get('email') or
            not data.get('password')):
            return jsonify({'message': 'email and password are required!'}), 400

        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_auth_collection = database["user_auth"]

        user = user_auth_collection.find_one({"email": data['email']})
        if not user:
            return jsonify({'message': 'invalid email or password!'}), 401

        if not check_password_hash(user['password'], data['password']):
            return jsonify({'message': 'invalid email or password!'}), 401
        
        payload = {
            'user_id': str(user['_id']),
            'role': user['role'],
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }
        token = jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')

        client.close()

        resp = make_response(jsonify({
            'message': 'Login successful!',
            # 迁移期：仍返回 token，方便你调试；上线后可删
            'token': token,
            'user_id': user['_id'],
            'role': user['role'],
        }))
        resp.set_cookie(
            key=app.config["JWT_COOKIE_NAME"],
            value=token,
            httponly=True,
            secure=app.config.get("JWT_COOKIE_SECURE", False),
            samesite=app.config.get("JWT_COOKIE_SAMESITE", "Lax"),
            max_age=int(app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds()),
            path="/",
        )
        return resp
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# logout
@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    resp = make_response(jsonify({'message': 'Logged out.'}))
    resp.set_cookie(
        key=app.config["JWT_COOKIE_NAME"],
        value="",
        max_age=0,
        path="/",
        httponly=True,
        secure=app.config.get("JWT_COOKIE_SECURE", False),
        samesite=app.config.get("JWT_COOKIE_SAMESITE", "Lax"),
    )
    return resp
# forgot password -> send validation code to email
@app.route('/api/auth/forgot_password/send_validation_code', methods=['POST'])
@limiter.limit("5 per 15 minutes")
def auth_forgot_password_send_validation_code():
    def send_validation_email(receiver_email, code):
        EMAIL_ADDRESS = app.config["SMTP_EMAIL"]
        EMAIL_PASSWORD = app.config["SMTP_PASSWORD"]

        msg = EmailMessage()
        msg['Subject'] = "Your One Resume Password Reset Code"
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = receiver_email

        # 你可以用本地图片，也可以用网络图片（建议放cdn或外链，省事）
        # 假设你有一个 logo.png 和你代码同级目录
        image_path = "./assets/logos/logo_512_white_outline.png"
        cid = "one-resume-logo"  # Content-ID

        # 构造 HTML 内容，嵌入图片并加简单样式
        html_content = f"""
        <html>
        <head>
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body {{
            font-family: Jost;
            background: #fff;
            padding: 0;
            margin: 0;
            }}
            .container {{
            max-width: 400px;
            margin: 40px auto;
            padding: 32px 32px 28px 32px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.09);
            }}
            .logo {{
            width: 120px;
            display: block;
            margin-bottom: 20px;
            }}
            .title {{
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 8px 0;
            text-align: left;
            color: #000;
            }}
            .info {{
            font-size: 16px;
            color: #000;
            margin: 0 0 20px 0;
            text-align: left;
            }}
            .code {{
            font-size: 32px;
            letter-spacing: 6px;
            font-weight: bold;
            color: #000;
            text-align: left;
            margin: 0 0 16px 0;
            }}
            .expire {{
            font-size: 13px;
            color: #888;
            margin-top: 20px;
            text-align: left;
            }}
        </style>
        </head>
        <body>
        <div class="container">
            <img src="cid:{cid}" alt="Logo" class="logo" />
            <h2 class="title">One Resume</h2>
            <p class="info">Your password reset code is:</p>
            <div class="code">{code}</div>
            <p class="expire">This code will expire in 10 minutes.</p>
        </div>
        </body>
        </html>
        """

        # 添加 HTML 内容
        msg.add_alternative(html_content, subtype="html")
        # 添加本地图片 (嵌入，非附件)
        with open(image_path, "rb") as img:
            maintype, subtype = mimetypes.guess_type(image_path)[0].split("/")
            msg.get_payload()[0].add_related(
                img.read(),
                maintype=maintype,
                subtype=subtype,
                cid=f"<{cid}>"
            )
        # 发送
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
    try:
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({'success': False, 'message': 'email and code are required!'}), 400

        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_auth_collection = database["user_auth"]
        user = user_auth_collection.find_one({"email": email})
        if not user:
            return jsonify({'success': False, 'message': 'email not found!'}), 404

        # 生成6位数字验证码
        code = str(random.randint(100000, 999999))
        expire_time = datetime.now(timezone.utc) + timedelta(minutes=10)

        # 保存验证码和过期时间到用户数据（可以用单独collection更安全）
        user_auth_collection.update_one(
            {"email": email},
            {"$set": {
                "reset_code": code,
                "reset_code_expires": expire_time
            }}
        )

        # 发送邮件
        send_validation_email(email, code)

        return jsonify({'message': 'validation code sent to your email!'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': str(e)}), 500
# forgot password -> validate code
@app.route('/api/auth/forgot_password/validate_code', methods=['POST'])
@limiter.limit("5 per 15 minutes")
def auth_forgot_password_validate_code():
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        if not email or not code:
            return jsonify({'success': False, 'message': 'email and code are required!'}), 400

        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_auth_collection = database["user_auth"]
        user = user_auth_collection.find_one({"email": email})
        if not user:
            client.close()
            return jsonify({'success': False, 'message': 'email not found!'}), 404

        # 检查验证码和过期时间
        reset_code_expires = user.get('reset_code_expires')
        if reset_code_expires is not None and reset_code_expires.tzinfo is None:
            reset_code_expires = reset_code_expires.replace(tzinfo=timezone.utc)
        if (user.get('reset_code') != code or
            datetime.now(timezone.utc) > reset_code_expires):
            client.close()
            return jsonify({'success': False, 'message': 'invalid or expired code!'}), 400

        client.close()
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
# forgot password -> reset password
@app.route('/api/auth/forgot_password/reset_password', methods=['POST'])
@limiter.limit("5 per 15 minutes")
def auth_forgot_password_reset_password():
    try:
        data = request.get_json()
        email = data.get('email')
        new_password = data.get('new_password')
        code = data.get('code')
        if not email or not new_password or not code:
            return jsonify({'success': False, 'message': 'email, code, and new password are required!'}), 400

        client = MongoClient(os.getenv("MONGODB_URL"))
        database = client["one_resume_db"]
        user_auth_collection = database["user_auth"]
        user = user_auth_collection.find_one({"email": email})
        if not user:
            client.close()
            return jsonify({'success': False, 'message': 'email not found!'}), 404

        # 再次校验验证码和过期时间
        reset_code_expires = user.get('reset_code_expires')
        if reset_code_expires is not None and reset_code_expires.tzinfo is None:
            reset_code_expires = reset_code_expires.replace(tzinfo=timezone.utc)
        if (user.get('reset_code') != code or
            datetime.now(timezone.utc) > reset_code_expires):
            client.close()
            return jsonify({'success': False, 'message': 'invalid or expired code!'}), 400

        # 更新密码
        hashed_password = generate_password_hash(new_password)
        user_auth_collection.update_one(
            {"email": email},
            {"$set": {
                "password": hashed_password,
                "reset_code": None,
                "reset_code_expires": None
            }}
        )

        client.close()
        return jsonify({'success': True, 'message': 'password reset successfully!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
# { login & logout } ------------------------------------------------------------------------------------------------------------------------------------- #

# { authentication } ------------------------------------------------------------------------------------------------------------------------------------- #
def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        # Let CORS pre‑flight (OPTIONS) requests through unchallenged
        if request.method == "OPTIONS":
            return f(*args, **kwargs)

        token = request.cookies.get(app.config["JWT_COOKIE_NAME"])
        if not token:
            return jsonify({'message': 'unauth'}), 401
        try:
            payload = jwt.decode(token,
                                 app.config['JWT_SECRET_KEY'],
                                 algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'invalid token'}), 401

        g.current_user = payload         # store for the downstream route
        return f(*args, **kwargs)
    return wrapper
# { authentication } ------------------------------------------------------------------------------------------------------------------------------------- #

# { data retrieving } ------------------------------------------------------------------------------------------------------------------------------------ #
@app.route("/api/user/get_user_info", methods=["GET"])
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
# { data retrieving } ------------------------------------------------------------------------------------------------------------------------------------ #

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
