import jwt
from flask import request, jsonify, g, current_app as app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from functools import wraps

# { rate limiting } -------------------------------------------------------------------------------------------------------------------------------------- #
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per hour"],
)
# { rate limiting } -------------------------------------------------------------------------------------------------------------------------------------- #

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