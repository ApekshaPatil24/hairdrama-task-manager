
import re

from flask import Blueprint, current_app, g, jsonify, request

from auth_middleware import require_auth
from services.user_service import get_users_for_assignment


users_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users",
)


@users_bp.get("")
@require_auth
def get_users():

    current_user_id = g.current_user["id"]

    # 1. Validate pagination.
    try:
        page = int(request.args.get("page", "1"))
        page_size = int(request.args.get("limit", "20"))

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "error": "Page and limit must be valid integers.",
        }), 400

    if page < 1 or page_size < 1 or page_size > 50:
        return jsonify({
            "success": False,
            "error": "Page must be positive and limit must be between 1 and 50.",
        }), 400

    # 2. Validate search input.
    search = request.args.get("search", "").strip()

    if len(search) > 80:
        return jsonify({
            "success": False,
            "error": "Search cannot exceed 80 characters.",
        }), 400

    # Allow letters (including Unicode), numbers, spaces and common
    # email/name characters. This prevents PostgREST filter syntax
    # characters from being injected into the OR expression.
    if not re.fullmatch(r"[\w\s@.+-]*", search, flags=re.UNICODE):
        return jsonify({
            "success": False,
            "error": "Search contains unsupported characters.",
        }), 400

    # 3. Fetch registered users.
    try:
        result = get_users_for_assignment(
            current_user_id=current_user_id,
            search=search,
            page=page,
            page_size=page_size,
        )

        return jsonify({
            "success": True,
            **result,
        }), 200

    except Exception:
        current_app.logger.exception(
            "Failed to fetch user directory for user %s",
            current_user_id,
        )

        return jsonify({
            "success": False,
            "error": "Unable to fetch users. Please try again.",
        }), 500
