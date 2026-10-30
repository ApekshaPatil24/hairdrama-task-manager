
from datetime import date
from typing import Any
from unicodedata import category
from uuid import UUID


ALLOWED_FIELDS = {
    "title",
    "description",
    "assignedTo",
    "priority",
    "dueDate",
}

ALLOWED_PRIORITIES = {"low", "medium", "high"}


def contains_invalid_control_characters(
    value: str,
    *,
    allow_multiline: bool = False,
) -> bool:
    """
    Reject control characters and invalid Unicode surrogate characters.

    Descriptions may contain tabs and line breaks.
    Titles may not contain them.
    """
    for character in value:
        if category(character) in {"Cc", "Cs"}:
            if allow_multiline and character in {"\n", "\r", "\t"}:
                continue

            return True

    return False


def validate_create_task_payload(
    payload: Any,
) -> tuple[dict[str, Any] | None, dict[str, str]]:

    # Validate request body.
    if not isinstance(payload, dict):
        return None, {
            "body": "A valid JSON object is required."
        }

    errors: dict[str, str] = {}

    # Reject unsupported and server-controlled fields.
    unknown_fields = sorted(
        str(key)
        for key in payload
        if not isinstance(key, str) or key not in ALLOWED_FIELDS
    )

    if unknown_fields:
        errors["fields"] = (
            "Unsupported fields: " + ", ".join(unknown_fields)
        )

    # --------------------------------------------------
    # 1. TITLE VALIDATION
    # --------------------------------------------------

    title = payload.get("title")

    if not isinstance(title, str):
        errors["title"] = "Task title is required and must be a string."
        title = ""
    else:
        title = title.strip()

        if not title:
            errors["title"] = "Task title cannot be empty."

        elif len(title) > 200:
            errors["title"] = (
                "Task title cannot exceed 200 characters."
            )

        elif contains_invalid_control_characters(title):
            errors["title"] = (
                "Task title cannot contain control characters or line breaks."
            )

    # --------------------------------------------------
    # 2. DESCRIPTION VALIDATION
    # --------------------------------------------------

    description = payload.get("description")

    if description is None:
        description = None

    elif not isinstance(description, str):
        errors["description"] = "Description must be a string."

    else:
        description = description.strip()

        if not description:
            description = None

        elif len(description) > 5000:
            errors["description"] = (
                "Description cannot exceed 5000 characters."
            )

        elif contains_invalid_control_characters(
            description,
            allow_multiline=True,
        ):
            errors["description"] = (
                "Description contains invalid control characters."
            )

    # --------------------------------------------------
    # 3. ASSIGNEE VALIDATION
    # --------------------------------------------------

    assigned_to = payload.get("assignedTo")

    if assigned_to is None:
        assigned_to = None

    elif not isinstance(assigned_to, str):
        errors["assignedTo"] = (
            "Assignee must be a valid user ID."
        )

    else:
        assigned_to = assigned_to.strip()

        if not assigned_to:
            assigned_to = None

        else:
            try:
                parsed_uuid = UUID(assigned_to)
                normalized_uuid = str(parsed_uuid)

                # Accept standard UUID format only.
                if assigned_to.lower() != normalized_uuid:
                    raise ValueError("Non-canonical UUID format.")

                assigned_to = normalized_uuid

            except ValueError:
                errors["assignedTo"] = (
                    "Assignee must be a valid user UUID."
                )

    # --------------------------------------------------
    # 4. PRIORITY VALIDATION
    # --------------------------------------------------

    priority = payload.get("priority", "medium")

    if not isinstance(priority, str):
        errors["priority"] = "Priority must be a string."

    else:
        priority = priority.strip().lower()

        if priority not in ALLOWED_PRIORITIES:
            errors["priority"] = (
                "Priority must be low, medium, or high."
            )

    # --------------------------------------------------
    # 5. DUE DATE VALIDATION
    # --------------------------------------------------

    due_date = payload.get("dueDate")

    if due_date is None or due_date == "":
        due_date = None

    elif not isinstance(due_date, str):
        errors["dueDate"] = (
            "Due date must be a YYYY-MM-DD string."
        )

    else:
        try:
            parsed_date = date.fromisoformat(due_date)

            # Reject alternative formats and impossible dates.
            if parsed_date.isoformat() != due_date:
                raise ValueError("Invalid date format.")

        except ValueError:
            errors["dueDate"] = (
                "Enter a valid due date in YYYY-MM-DD format."
            )

    # --------------------------------------------------
    # 6. FINAL VALIDATION RESULT
    # --------------------------------------------------

    if errors:
        return None, errors

    return {
        "title": title,
        "description": description,
        "assignedTo": assigned_to,
        "priority": priority,
        "dueDate": due_date,
    }, {}
