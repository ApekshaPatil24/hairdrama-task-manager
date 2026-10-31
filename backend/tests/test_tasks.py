
from unittest.mock import Mock

import pytest

import routes.tasks as task_routes

from services.task_service import (
    AssigneeNotFoundError,
    TaskNotFoundOrForbiddenError,
)


# --------------------------------------------------
# GET TASKS TESTS
# --------------------------------------------------

def test_get_tasks_success(
    client,
    auth_headers,
    monkeypatch,
):
    expected_result = {
        "tasks": [],
        "pagination": {
            "page": 1,
            "limit": 50,
            "total": 0,
            "totalPages": 0,
            "hasMore": False,
        },
    }

    monkeypatch.setattr(
        task_routes,
        "get_tasks_for_user",
        lambda *args: expected_result,
    )

    response = client.get(
        "/api/tasks",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json["success"] is True
    assert response.json["tasks"] == []


def test_get_tasks_invalid_page(
    client,
    auth_headers,
):
    response = client.get(
        "/api/tasks?page=0",
        headers=auth_headers,
    )

    assert response.status_code == 400


def test_get_tasks_invalid_limit(
    client,
    auth_headers,
):
    response = client.get(
        "/api/tasks?limit=101",
        headers=auth_headers,
    )

    assert response.status_code == 400


def test_get_tasks_without_authentication(client):
    response = client.get("/api/tasks")

    assert response.status_code == 401


# --------------------------------------------------
# CREATE TASK TESTS
# --------------------------------------------------

def test_create_task_success(
    client,
    auth_headers,
    valid_task_payload,
    sample_task,
    monkeypatch,
):
    create_mock = Mock(return_value=sample_task)
    email_mock = Mock(return_value=["test-message-id"])

    monkeypatch.setattr(
        task_routes,
        "create_task_for_user",
        create_mock,
    )

    monkeypatch.setattr(
        task_routes,
        "send_task_created_notification",
        email_mock,
    )

    response = client.post(
        "/api/tasks",
        json=valid_task_payload,
        headers=auth_headers,
    )

    assert response.status_code == 201
    assert response.json["success"] is True
    assert response.json["notificationSent"] is True

    create_mock.assert_called_once()
    email_mock.assert_called_once_with(sample_task)


def test_invalid_task_does_not_reach_service(
    client,
    auth_headers,
    monkeypatch,
):
    create_mock = Mock()

    monkeypatch.setattr(
        task_routes,
        "create_task_for_user",
        create_mock,
    )

    response = client.post(
        "/api/tasks",
        json={
            "description": "Task without title",
            "assignedTo": None,
            "priority": "medium",
        },
        headers=auth_headers,
    )

    assert response.status_code == 422
    assert response.json["success"] is False

    # Critical: Database service must not execute.
    create_mock.assert_not_called()


def test_invalid_json_body(
    client,
    auth_headers,
):
    response = client.post(
        "/api/tasks",
        data="invalid-json",
        headers={
            **auth_headers,
            "Content-Type": "application/json",
        },
    )

    assert response.status_code == 400


def test_nonexistent_assignee_rejected(
    client,
    auth_headers,
    valid_task_payload,
    monkeypatch,
):
    def fake_create(*args):
        raise AssigneeNotFoundError(
            "The selected assignee does not exist."
        )

    monkeypatch.setattr(
        task_routes,
        "create_task_for_user",
        fake_create,
    )

    response = client.post(
        "/api/tasks",
        json={
            **valid_task_payload,
            "assignedTo": "93a12975-5524-46c7-b19a-18613262c877",
        },
        headers=auth_headers,
    )

    assert response.status_code == 422
    assert "assignee" in response.json["error"].lower()


def test_task_saved_when_email_fails(
    client,
    auth_headers,
    valid_task_payload,
    sample_task,
    monkeypatch,
):
    create_mock = Mock(return_value=sample_task)

    def failed_email(task):
        raise RuntimeError("Gmail temporarily unavailable.")

    monkeypatch.setattr(
        task_routes,
        "create_task_for_user",
        create_mock,
    )

    monkeypatch.setattr(
        task_routes,
        "send_task_created_notification",
        failed_email,
    )

    response = client.post(
        "/api/tasks",
        json=valid_task_payload,
        headers=auth_headers,
    )

    # Task creation must remain successful.
    assert response.status_code == 201
    assert response.json["success"] is True
    assert response.json["notificationSent"] is False

    create_mock.assert_called_once()


# --------------------------------------------------
# UPDATE TASK STATUS TESTS
# --------------------------------------------------

def test_complete_task_sends_notification(
    client,
    auth_headers,
    sample_task,
    monkeypatch,
):
    updated_task = {
        **sample_task,
        "status": "completed",
        "completedAt": "2026-10-31T12:30:00+00:00",
    }

    update_mock = Mock(
        return_value=(updated_task, True)
    )

    email_mock = Mock(return_value="completion-message-id")

    monkeypatch.setattr(
        task_routes,
        "update_task_status_for_user",
        update_mock,
    )

    monkeypatch.setattr(
        task_routes,
        "send_task_completed_notification",
        email_mock,
    )

    response = client.patch(
        f"/api/tasks/{sample_task['id']}/status",
        json={"status": "completed"},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json["success"] is True
    assert response.json["notificationSent"] is True

    email_mock.assert_called_once_with(updated_task)


def test_in_progress_does_not_send_completion_email(
    client,
    auth_headers,
    sample_task,
    monkeypatch,
):
    updated_task = {
        **sample_task,
        "status": "in_progress",
    }

    update_mock = Mock(
        return_value=(updated_task, False)
    )

    email_mock = Mock()

    monkeypatch.setattr(
        task_routes,
        "update_task_status_for_user",
        update_mock,
    )

    monkeypatch.setattr(
        task_routes,
        "send_task_completed_notification",
        email_mock,
    )

    response = client.patch(
        f"/api/tasks/{sample_task['id']}/status",
        json={"status": "in_progress"},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json["success"] is True
    assert response.json["notificationSent"] is None

    email_mock.assert_not_called()


def test_invalid_status_is_rejected(
    client,
    auth_headers,
    sample_task,
    monkeypatch,
):
    update_mock = Mock()

    monkeypatch.setattr(
        task_routes,
        "update_task_status_for_user",
        update_mock,
    )

    response = client.patch(
        f"/api/tasks/{sample_task['id']}/status",
        json={"status": "invalid"},
        headers=auth_headers,
    )

    assert response.status_code == 422

    update_mock.assert_not_called()


def test_task_not_found_or_forbidden(
    client,
    auth_headers,
    sample_task,
    monkeypatch,
):
    def fake_update(*args):
        raise TaskNotFoundOrForbiddenError(
            "Task not found or permission denied."
        )

    monkeypatch.setattr(
        task_routes,
        "update_task_status_for_user",
        fake_update,
    )

    response = client.patch(
        f"/api/tasks/{sample_task['id']}/status",
        json={"status": "completed"},
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_completion_email_failure_does_not_undo_status(
    client,
    auth_headers,
    sample_task,
    monkeypatch,
):
    updated_task = {
        **sample_task,
        "status": "completed",
        "completedAt": "2026-10-31T12:30:00+00:00",
    }

    update_mock = Mock(
        return_value=(updated_task, True)
    )

    def failed_email(task):
        raise RuntimeError("Gmail unavailable.")

    monkeypatch.setattr(
        task_routes,
        "update_task_status_for_user",
        update_mock,
    )

    monkeypatch.setattr(
        task_routes,
        "send_task_completed_notification",
        failed_email,
    )

    response = client.patch(
        f"/api/tasks/{sample_task['id']}/status",
        json={"status": "completed"},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json["success"] is True
    assert response.json["notificationSent"] is False
    assert response.json["task"]["status"] == "completed"
