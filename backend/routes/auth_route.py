import os
import jwt
import random
import smtplib
import mimetypes
from email.message import EmailMessage
from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request, make_response, current_app as app, g
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import limiter

auth_blueprint = Blueprint('auth', __name__, url_prefix='/api/auth')

# { login & logout } ------------------------------------------------------------------------------------------------------------------------------------- #

# check user status
@auth_blueprint.route("/user", methods=["GET"])
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
@auth_blueprint.route('/login', methods=['POST'])
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
@auth_blueprint.route("/logout", methods=["POST"])
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
@auth_blueprint.route('/forgot_password/send_validation_code', methods=['POST'])
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
@auth_blueprint.route('/forgot_password/validate_code', methods=['POST'])
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
@auth_blueprint.route('/forgot_password/reset_password', methods=['POST'])
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