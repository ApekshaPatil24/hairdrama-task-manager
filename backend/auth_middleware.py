from functools import wraps

from flask import current_app, g, jsonify, request

from supabase_client import supabase


def require_auth(view_function):
    @wraps(view_function)
    def decorated(*args, **kwargs):

        # Read Authorization header
        auth_header = request.headers.get("Authorization", "")

        scheme, separator, token = auth_header.partition(" ")

        if (
            scheme.lower() != "bearer"
            or not separator
            or not token.strip()
        ):
            return jsonify({
                "success": False,
                "error": "Authentication token is required."
            }), 401

        try:
            # Verify token with Supabase Auth
            response = supabase.auth.get_user(token.strip())

            user = response.user

            if not user or not user.id:
                return jsonify({
                    "success": False,
                    "error": "Invalid or expired access token."
                }), 401

            # Store verified identity for this request
            g.current_user = {
                "id": str(user.id),
                "email": user.email,
            }

        except Exception as error:
            status = getattr(error, "status", None)

            if status in (400, 401, 403):
                return jsonify({
                    "success": False,
                    "error": "Invalid or expired access token."
                }), 401

            current_app.logger.exception(
                "Supabase authentication verification failed"
            )

            return jsonify({
                "success": False,
                "error": "Authentication service is temporarily unavailable."
            }), 503

        return view_function(*args, **kwargs)

    return decorated