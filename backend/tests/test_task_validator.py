
from datetime import timedelta

import pytest

from validators.task_validator import (
    get_today_date,
    validate_create_task_payload,
)


VALID_TASK = {
    "title": "Prepare project documentation",
    "description": "Complete the project report.",
    "assignedTo": None,
    "priority": "medium",
    "dueDate": get_today_date().isoformat(),
}


# ---------------- VALID PAYLOAD TESTS ----------------

def test_valid_task_payload():
    data, errors = validate_create_task_payload(VALID_TASK)

    assert errors == {}
    assert data is not None
    assert data["title"] == VALID_TASK["title"]


def test_title_is_trimmed():
    payload = {**VALID_TASK, "title": "  Test task  "}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["title"] == "Test task"


def test_description_can_be_null():
    payload = {**VALID_TASK, "description": None}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["description"] is None


def test_empty_description_becomes_none():
    payload = {**VALID_TASK, "description": "   "}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["description"] is None


def test_unassigned_task_accepts_null():
    payload = {**VALID_TASK, "assignedTo": None}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["assignedTo"] is None


def test_valid_user_uuid():
    payload = {
        **VALID_TASK,
        "assignedTo": "93a12975-5524-46c7-b19a-18613262c877",
    }

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["assignedTo"] == payload["assignedTo"]


def test_priority_is_normalized():
    payload = {**VALID_TASK, "priority": " HIGH "}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["priority"] == "high"


# ---------------- REQUEST BODY TESTS ----------------

@pytest.mark.parametrize("payload", [None, [], "invalid", 123])
def test_invalid_request_body(payload):
    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "body" in errors


def test_extra_fields_are_rejected():
    payload = {**VALID_TASK, "status": "completed"}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "fields" in errors


# ---------------- TITLE VALIDATION ----------------

@pytest.mark.parametrize("title", [None, 123, "", "   "])
def test_invalid_title(title):
    payload = {**VALID_TASK, "title": title}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "title" in errors


def test_title_over_200_characters():
    payload = {**VALID_TASK, "title": "A" * 201}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "title" in errors


def test_title_with_control_characters():
    payload = {**VALID_TASK, "title": "Invalid\nTitle"}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "title" in errors


# ---------------- DESCRIPTION VALIDATION ----------------

def test_description_over_5000_characters():
    payload = {**VALID_TASK, "description": "A" * 5001}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "description" in errors


def test_description_must_be_string_or_null():
    payload = {**VALID_TASK, "description": 123}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "description" in errors


def test_description_allows_multiline():
    description = "First line\nSecond line\nThird line"

    payload = {**VALID_TASK, "description": description}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["description"] == description


def test_description_rejects_null_character():
    payload = {
        **VALID_TASK,
        "description": "Invalid\x00description",
    }

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "description" in errors


# ---------------- ASSIGNEE VALIDATION ----------------

def test_missing_assignee_is_rejected():
    payload = VALID_TASK.copy()
    del payload["assignedTo"]

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "assignedTo" in errors


def test_invalid_assignee_uuid():
    payload = {**VALID_TASK, "assignedTo": "invalid-user-id"}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "assignedTo" in errors


def test_non_string_assignee_is_rejected():
    payload = {**VALID_TASK, "assignedTo": 123}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "assignedTo" in errors


# ---------------- PRIORITY VALIDATION ----------------

def test_missing_priority_is_rejected():
    payload = VALID_TASK.copy()
    del payload["priority"]

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "priority" in errors


@pytest.mark.parametrize(
    "priority",
    ["urgent", "normal", "", None, 123],
)
def test_invalid_priority(priority):
    payload = {**VALID_TASK, "priority": priority}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "priority" in errors


# ---------------- DUE DATE VALIDATION ----------------

def test_missing_due_date_is_rejected():
    payload = VALID_TASK.copy()
    del payload["dueDate"]

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "dueDate" in errors


@pytest.mark.parametrize(
    "due_date",
    [
        None,
        "",
        "   ",
        "2026-02-30",
        "2026-13-01",
        "31-10-2026",
        "invalid-date",
    ],
)
def test_invalid_due_date(due_date):
    payload = {**VALID_TASK, "dueDate": due_date}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "dueDate" in errors


def test_past_due_date_is_rejected():
    yesterday = (
        get_today_date() - timedelta(days=1)
    ).isoformat()

    payload = {**VALID_TASK, "dueDate": yesterday}

    data, errors = validate_create_task_payload(payload)

    assert data is None
    assert "dueDate" in errors


def test_today_is_valid_due_date():
    today = get_today_date().isoformat()

    payload = {**VALID_TASK, "dueDate": today}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["dueDate"] == today


def test_future_due_date_is_valid():
    tomorrow = (
        get_today_date() + timedelta(days=1)
    ).isoformat()

    payload = {**VALID_TASK, "dueDate": tomorrow}

    data, errors = validate_create_task_payload(payload)

    assert errors == {}
    assert data["dueDate"] == tomorrow
