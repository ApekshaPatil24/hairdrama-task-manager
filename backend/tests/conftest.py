
from types import SimpleNamespace

import pytest


TEST_USER_ID = "1759fbda-6fb8-41b4-bc73-9a845b2e701a"
TEST_USER_EMAIL = "test@example.com"
TEST_ACCESS_TOKEN = "test-access-token"


@pytest.fixture
def app(monkeypatch):
    import auth_middleware

    # Simulate Supabase authentication without calling Supabase.
    def mock_get_user(token):
        if token != TEST_ACCESS_TOKEN:
            raise Exception("Invalid test token.")

        return SimpleNamespace(
            user=SimpleNamespace(
                id=TEST_USER_ID,
                email=TEST_USER_EMAIL,
            )
        )

    fake_supabase = SimpleNamespace(
        auth=SimpleNamespace(get_user=mock_get_user)
    )

    monkeypatch.setattr(
        auth_middleware,
        "supabase",
        fake_supabase,
    )

    from app import app as flask_app

    flask_app.config.update(
        TESTING=True,
    )

    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_headers():
    return {
        "Authorization": f"Bearer {TEST_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }


@pytest.fixture
def valid_task_payload():
    from validators.task_validator import get_today_date

    return {
        "title": "Prepare project documentation",
        "description": "Complete the project report.",
        "assignedTo": None,
        "priority": "medium",
        "dueDate": get_today_date().isoformat(),
    }


@pytest.fixture
def sample_task():
    return {
        "id": "d5a56020-6d13-4341-ba7f-9108425d1f8d",
        "title": "Prepare project documentation",
        "description": "Complete the project report.",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2026-11-06",
        "completedAt": None,
        "createdAt": "2026-10-31T12:00:00+00:00",
        "updatedAt": "2026-10-31T12:00:00+00:00",
        "createdBy": {
            "id": TEST_USER_ID,
            "fullName": "Test Creator",
            "email": TEST_USER_EMAIL,
            "avatarUrl": None,
        },
        "assignedTo": None,
    }
