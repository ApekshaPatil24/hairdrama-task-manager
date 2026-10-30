
from flask import Blueprint, current_app, g, jsonify, request

from auth_middleware import require_auth

from services.task_service import (
    AssigneeNotFoundError,
    InvalidTaskStatusError,
    TaskNotFoundOrForbiddenError,
    create_task_for_user,
    get_tasks_for_user,
    update_task_status_for_user,
)

from validators.task_validator import validate_create_task_payload


tasks_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/api/tasks",
)


@tasks_bp.get("")
@require_auth
def get_tasks():

    user_id = g.current_user["id"]

    # Validate pagination.
    try:
        page = int(request.args.get("page", "1"))
        page_size = int(request.args.get("limit", "50"))

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "error": "Page and limit must be valid integers.",
        }), 400

    if page < 1 or page_size < 1 or page_size > 100:
        return jsonify({
            "success": False,
            "error": (
                "Page must be positive and limit must be "
                "between 1 and 100."
            ),
        }), 400

    try:
        result = get_tasks_for_user(
            user_id,
            page,
            page_size,
        )

        return jsonify({
            "success": True,
            **result,
        }), 200

    except Exception:
        current_app.logger.exception(
            "Failed to fetch tasks for user %s",
            user_id,
        )

        return jsonify({
            "success": False,
            "error": "Unable to fetch tasks. Please try again.",
        }), 500



@tasks_bp.post("")
@require_auth
def create_task():

    user_id = g.current_user["id"]

    # 1. Require a valid JSON request body.
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({
            "success": False,
            "error": "A valid JSON request body is required.",
        }), 400

    # 2. Validate and normalize incoming data.
    task_data, errors = validate_create_task_payload(payload)

    # 3. Stop execution if validation fails.
    # No task service or database INSERT is called.
    if errors or task_data is None:
        return jsonify({
            "success": False,
            "error": "Task validation failed.",
            "details": errors,
        }), 422

    # 4. Create the task only after successful validation.
    try:
        created_task = create_task_for_user(
            user_id,
            task_data,
        )

        return jsonify({
            "success": True,
            "message": "Task created successfully.",
            "task": created_task,
        }), 201

    except AssigneeNotFoundError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 422

    except Exception:
        current_app.logger.exception(
            "Failed to create task for user %s",
            user_id,
        )

        return jsonify({
            "success": False,
            "error": "Unable to create task. Please try again.",
        }), 500


@tasks_bp.patch("/<task_id>/status")
@require_auth
def update_task_status(task_id):

    user_id = g.current_user["id"]

    # 1. Validate JSON body.
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({
            "success": False,
            "error": "A valid JSON request body is required.",
        }), 400

    # 2. Only the status field is allowed.
    if set(payload.keys()) != {"status"}:
        return jsonify({
            "success": False,
            "error": "Only the status field is allowed.",
        }), 422

    # 3. Validate status.
    new_status = payload.get("status")

    allowed_statuses = {
        "pending",
        "in_progress",
        "completed",
    }

    if not isinstance(new_status, str) or new_status not in allowed_statuses:
        return jsonify({
            "success": False,
            "error": (
                "Status must be pending, in_progress, or completed."
            ),
        }), 422

    # 4. Update task.
    try:
        updated_task = update_task_status_for_user(
            user_id,
            task_id,
            new_status,
        )

        return jsonify({
            "success": True,
            "message": "Task status updated successfully.",
            "task": updated_task,
        }), 200

    except InvalidTaskStatusError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 422

    except TaskNotFoundOrForbiddenError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 404

    except Exception:
        current_app.logger.exception(
            "Failed to update task status for user %s",
            user_id,
        )

        return jsonify({
            "success": False,
            "error": "Unable to update task status. Please try again.",
        }), 500
