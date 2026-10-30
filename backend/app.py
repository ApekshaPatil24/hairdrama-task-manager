import os

from dotenv import load_dotenv
from flask import Flask, g, jsonify
from flask_cors import CORS


from auth_middleware import require_auth

from routes.tasks import tasks_bp
from routes.users import users_bp

load_dotenv()

app = Flask(__name__)

app.register_blueprint(tasks_bp)
app.register_blueprint(users_bp)

allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000"
).split(",")

CORS(
    app,
    origins=[
        origin.strip()
        for origin in allowed_origins
        if origin.strip()
    ],
    allow_headers=[
        "Content-Type",
        "Authorization"
    ],
    methods=[
        "GET",
        "POST",
        "PATCH",
        "PUT",
        "DELETE",
        "OPTIONS"
    ]
)


@app.get("/health")
def health_check():
    return jsonify({
        "status": "ok",
        "service": "hairdrama-api"
    }), 200


# Test authenticated user
@app.get("/api/auth/me")
@require_auth
def get_current_user():

    return jsonify({
        "success": True,
        "user": {
            "id": g.current_user["id"],
            "email": g.current_user["email"]
        }
    }), 200


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=int(os.getenv("PORT", "5000")),
        debug=True
    )