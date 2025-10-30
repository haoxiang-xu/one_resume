from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Shared rate limiter instance used across blueprints.
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per hour"],
)
