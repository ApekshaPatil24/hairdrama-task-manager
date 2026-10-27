import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

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
    ]
)


@app.get("/health")
def health_check():
    return jsonify({
        "status": "ok",
        "service": "hairdrama-api"
    }), 200


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=int(os.getenv("PORT", "5000")),
        debug=True
    )