
from typing import Any
from datetime import datetime, timezone
from supabase_client import supabase


TASK_COLUMNS = """
    id,
    title,
    description,
    created_by,
    assigned_to,
    status,
    priority,
    due_date,
    completed_at,
    created_at,
    updated_at
"""


class AssigneeNotFoundError(Exception):
    """Raised when the requested assignee has no application profile."""

ALLOWED_TASK_STATUSES = {
    "pending",
    "in_progress",
    "completed",
}


class TaskNotFoundOrForbiddenError(Exception):
    """Raised when a task does not exist or the user cannot access it."""


class InvalidTaskStatusError(Exception):
    """Raised when an unsupported task status is requested."""


def serialize_profile(user_id: str | None, profiles: dict) -> dict | None:
    if not user_id:
        return None

    profile = profiles.get(user_id)

    if not profile:
        return {
            "id": user_id,
            "fullName": None,
            "avatarUrl": None,
        }

    return {
        "id": profile["user_id"],
        "fullName": profile["full_name"],
        "avatarUrl": profile["avatar_url"],
    }


def fetch_profiles(profile_ids: set[str]) -> dict:
    if not profile_ids:
        return {}

    response = (
        supabase
        .table("profiles")
        .select("user_id, full_name, avatar_url")
        .in_("user_id", list(profile_ids))
        .execute()
    )

    return {
        profile["user_id"]: profile
        for profile in (response.data or [])
    }


def serialize_task(task: dict, profiles: dict) -> dict:
    return {
        "id": task["id"],
        "title": task["title"],
        "description": task["description"],
        "status": task["status"],
        "priority": task["priority"],
        "dueDate": task["due_date"],
        "completedAt": task["completed_at"],
        "createdAt": task["created_at"],
        "updatedAt": task["updated_at"],
        "createdBy": serialize_profile(
            task["created_by"],
            profiles,
        ),
        "assignedTo": serialize_profile(
            task["assigned_to"],
            profiles,
        ),
    }


def get_tasks_for_user(
    user_id: str,
    page: int,
    page_size: int,
) -> dict:

    start = (page - 1) * page_size
    end = start + page_size - 1

    response = (
        supabase
        .table("tasks")
        .select(TASK_COLUMNS, count="exact")
        .or_(
            f"created_by.eq.{user_id},assigned_to.eq.{user_id}"
        )
        .order("created_at", desc=True)
        .range(start, end)
        .execute()
    )

    task_rows = response.data or []

    profile_ids = {
        task["created_by"]
        for task in task_rows
    }

    profile_ids.update(
        task["assigned_to"]
        for task in task_rows
        if task["assigned_to"]
    )

    profiles = fetch_profiles(profile_ids)

    tasks = [
        serialize_task(task, profiles)
        for task in task_rows
    ]

    total = (
        response.count
        if response.count is not None
        else len(tasks)
    )

    total_pages = (total + page_size - 1) // page_size

    return {
        "tasks": tasks,
        "pagination": {
            "page": page,
            "limit": page_size,
            "total": total,
            "totalPages": total_pages,
            "hasMore": page < total_pages,
        },
    }


def create_task_for_user(
    user_id: str,
    task_data: dict[str, Any],
) -> dict:

    assigned_to = task_data["assignedTo"]

    # Confirm that the selected assignee has an application profile.
    if assigned_to:
        assignee_response = (
            supabase
            .table("profiles")
            .select("user_id")
            .eq("user_id", assigned_to)
            .limit(1)
            .execute()
        )

        if not assignee_response.data:
            raise AssigneeNotFoundError(
                "The selected assignee does not exist."
            )

    # The creator always comes from the verified access token.
    insert_payload = {
        "title": task_data["title"],
        "description": task_data["description"],
        "created_by": user_id,
        "assigned_to": assigned_to,
        "status": "pending",
        "priority": task_data["priority"],
        "due_date": task_data["dueDate"],
        "completed_at": None,
    }

    response = (
        supabase
        .table("tasks")
        .insert(insert_payload)
        .execute()
    )

    created_rows = response.data or []

    if not created_rows:
        raise RuntimeError(
            "Supabase did not return the created task."
        )

    created_task = created_rows[0]

    profile_ids = {created_task["created_by"]}

    if created_task["assigned_to"]:
        profile_ids.add(created_task["assigned_to"])

    profiles = fetch_profiles(profile_ids)

    return serialize_task(created_task, profiles)


def update_task_status_for_user(
    user_id: str,
    task_id: str,
    new_status: str,
) -> dict:

    # 1. Validate requested status.
    if new_status not in ALLOWED_TASK_STATUSES:
        raise InvalidTaskStatusError(
            "Status must be pending, in_progress, or completed."
        )

    # 2. Find the task only if the user created or is assigned to it.
    existing_response = (
        supabase
        .table("tasks")
        .select("id, status, completed_at")
        .eq("id", task_id)
        .or_(
            f"created_by.eq.{user_id},assigned_to.eq.{user_id}"
        )
        .limit(1)
        .execute()
    )

    existing_rows = existing_response.data or []

    if not existing_rows:
        raise TaskNotFoundOrForbiddenError(
            "Task not found or you do not have permission to update it."
        )

    existing_task = existing_rows[0]

    # 3. Manage completion timestamp.
    if new_status == "completed":

        if (
            existing_task["status"] == "completed"
            and existing_task["completed_at"]
        ):
            completed_at = existing_task["completed_at"]
        else:
            completed_at = datetime.now(timezone.utc).isoformat()

    else:
        completed_at = None

    # 4. Update with ownership condition again for safety.
    supabase.table("tasks").update({
        "status": new_status,
        "completed_at": completed_at,
    }).eq(
        "id", task_id
    ).or_(
        f"created_by.eq.{user_id},assigned_to.eq.{user_id}"
    ).execute()

    # 5. Retrieve the updated task.
    updated_response = (
        supabase
        .table("tasks")
        .select(TASK_COLUMNS)
        .eq("id", task_id)
        .or_(
            f"created_by.eq.{user_id},assigned_to.eq.{user_id}"
        )
        .limit(1)
        .execute()
    )

    updated_rows = updated_response.data or []

    if not updated_rows:
        raise TaskNotFoundOrForbiddenError(
            "Unable to retrieve the updated task."
        )

    updated_task = updated_rows[0]

    # 6. Fetch creator and assignee profiles.
    profile_ids = {updated_task["created_by"]}

    if updated_task["assigned_to"]:
        profile_ids.add(updated_task["assigned_to"])

    profiles = fetch_profiles(profile_ids)

    # 7. Return the updated task in the existing API format.
    return serialize_task(updated_task, profiles)
