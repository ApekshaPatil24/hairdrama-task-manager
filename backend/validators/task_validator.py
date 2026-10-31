
from datetime import date, datetime
from typing import Any
from unicodedata import category
from uuid import UUID
from zoneinfo import ZoneInfo


# India is the default task timezone.
# Can be overridden using the TASK_TIMEZONE environment variable.
import os

TASK_TIMEZONE = ZoneInfo(
    os.getenv("TASK_TIMEZONE", "Asia/Kolkata")
)

ALLOWED_FIELDS = {
    "title",
    "description",
    "assignedTo",
    "priority",
    "dueDate",
}

ALLOWED_PRIORITIES = {"low", "medium", "high"}


def get_today_date() -> date:
    """Return today's date using the configured application timezone."""
    return datetime.now(TASK_TIMEZONE).date()


def contains_invalid_control_characters(
    value: str,
    *,
    allow_multiline: bool = False,
) -> bool:
    """
    Reject control characters and invalid Unicode surrogates.

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

    # --------------------------------------------------
    # 1. REQUEST BODY VALIDATION
    # --------------------------------------------------

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
    # 2. TITLE VALIDATION (REQUIRED)
    # --------------------------------------------------

    title = payload.get("title")

    if not isinstance(title, str):
        errors["title"] = (
            "Task title is required and must be a string."
        )
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
    # 3. DESCRIPTION VALIDATION (OPTIONAL)
    # --------------------------------------------------

    description = payload.get("description")

    if description is None:
        description = None

    elif not isinstance(description, str):
        errors["description"] = (
            "Description must be a string."
        )

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
    # 4. ASSIGNEE VALIDATION (REQUIRED SELECTION)
    # --------------------------------------------------

    assigned_to = None

    if "assignedTo" not in payload:
        errors["assignedTo"] = (
            "Please select an assignee or choose Unassigned."
        )

    else:
        assigned_to = payload["assignedTo"]

        # Explicit null means the user selected Unassigned.
        if assigned_to is None:
            assigned_to = None

        elif not isinstance(assigned_to, str):
            errors["assignedTo"] = (
                "Assignee must be a valid user ID or null."
            )

        else:
            assigned_to = assigned_to.strip()

            if not assigned_to:
                errors["assignedTo"] = (
                    "Please select a valid assignee or choose Unassigned."
                )

            else:
                try:
                    parsed_uuid = UUID(assigned_to)
                    normalized_uuid = str(parsed_uuid)

                    # Accept standard hyphenated UUID format.
                    if assigned_to.lower() != normalized_uuid:
                        raise ValueError("Invalid UUID format.")

                    assigned_to = normalized_uuid

                except ValueError:
                    errors["assignedTo"] = (
                        "Assignee must be a valid user UUID."
                    )

    # --------------------------------------------------
    # 5. PRIORITY VALIDATION (REQUIRED)
    # --------------------------------------------------

    if "priority" not in payload:
        errors["priority"] = (
            "Please select a task priority."
        )
        priority = None

    else:
        priority = payload["priority"]

        if not isinstance(priority, str):
            errors["priority"] = (
                "Priority must be a string."
            )

        else:
            priority = priority.strip().lower()

            if priority not in ALLOWED_PRIORITIES:
                errors["priority"] = (
                    "Priority must be low, medium, or high."
                )

    # --------------------------------------------------
    # 6. DUE DATE VALIDATION (REQUIRED)
    # --------------------------------------------------

    if "dueDate" not in payload:
        errors["dueDate"] = (
            "Due date is required."
        )
        due_date = None

    else:
        due_date = payload["dueDate"]

        if not isinstance(due_date, str):
            errors["dueDate"] = (
                "Due date must be a YYYY-MM-DD string."
            )

        else:
            due_date = due_date.strip()

            if not due_date:
                errors["dueDate"] = (
                    "Due date is required."
                )

            else:
                try:
                    parsed_date = date.fromisoformat(due_date)

                    # Reject alternative formats and impossible dates.
                    if parsed_date.isoformat() != due_date:
                        raise ValueError("Invalid date format.")

                    # Reject dates earlier than today.
                    if parsed_date < get_today_date():
                        errors["dueDate"] = (
                            "Past due dates are not allowed."
                        )

                except ValueError:
                    errors["dueDate"] = (
                        "Enter a valid future or today's date in YYYY-MM-DD format."
                    )

    # --------------------------------------------------
    # 7. FINAL VALIDATION RESULT
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
