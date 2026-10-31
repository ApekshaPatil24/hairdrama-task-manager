
import base64
import html
import logging
import os

from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
]

TOKEN_FILE = BASE_DIR / "token.json"

logger = logging.getLogger(__name__)


def get_gmail_service():
    """Load Gmail credentials and refresh them when necessary."""

    token_json = os.getenv("GMAIL_TOKEN_JSON")

    if token_json:
        import json

        credentials_info = json.loads(token_json)

        credentials = Credentials.from_authorized_user_info(
            credentials_info,
            SCOPES,
        )

    elif TOKEN_FILE.exists():
        credentials = Credentials.from_authorized_user_file(
            str(TOKEN_FILE),
            SCOPES,
        )

    else:
        raise RuntimeError(
            "Gmail is not authorized. Run authorize_gmail.py first."
        )

    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())

        # Persist refreshed credentials locally.
        if not token_json:
            TOKEN_FILE.write_text(
                credentials.to_json(),
                encoding="utf-8",
            )

    if not credentials.valid:
        raise RuntimeError(
            "Gmail credentials are invalid. Reauthorize Gmail."
        )

    return build(
        "gmail",
        "v1",
        credentials=credentials,
        cache_discovery=False,
    )


def send_email(
    recipient: str,
    subject: str,
    text_body: str,
    html_body: str | None = None,
) -> str:
    """Send an email through the authorized Gmail account."""

    sender = os.getenv("GMAIL_SENDER_EMAIL", "").strip()

    if not sender:
        raise RuntimeError(
            "GMAIL_SENDER_EMAIL is missing from backend/.env."
        )

    if not recipient or "@" not in recipient:
        raise ValueError("A valid recipient email is required.")

    if not subject.strip():
        raise ValueError("Email subject cannot be empty.")

    message = EmailMessage()

    message["To"] = recipient
    message["From"] = sender
    message["Subject"] = subject

    message.set_content(text_body)

    if html_body:
        message.add_alternative(
            html_body,
            subtype="html",
        )

    encoded_message = base64.urlsafe_b64encode(
        message.as_bytes()
    ).decode("utf-8")

    try:
        service = get_gmail_service()

        result = (
            service.users()
            .messages()
            .send(
                userId="me",
                body={"raw": encoded_message},
            )
            .execute()
        )

        logger.info(
            "Email sent successfully to %s. Message ID: %s",
            recipient,
            result.get("id"),
        )

        return result["id"]

    except HttpError:
        logger.exception("Gmail API failed to send an email.")
        raise



def send_task_created_notification(task: dict) -> list[str]:
    """
    Notify both the creator and assignee when a task is assigned.

    For an unassigned task, notify only its creator.
    Avoid sending duplicate emails when both addresses match.
    """

    creator = task.get("createdBy") or {}
    assignee = task.get("assignedTo")

    creator_email = creator.get("email")

    if not creator_email:
        raise RuntimeError(
            "Task creator email is missing."
        )

    creator_name = creator.get("fullName") or "there"
    task_title = task["title"]
    priority = task["priority"]
    due_date = task.get("dueDate") or "Not specified"

    safe_title = html.escape(task_title)
    safe_priority = html.escape(priority)
    safe_due_date = html.escape(due_date)

    recipients = []

    # Prepare creator notification.
    if assignee:
        assignee_name = (
            assignee.get("fullName") or "the assigned user"
        )

        creator_message = (
            f"You created a new task and assigned it to {assignee_name}."
        )
    else:
        creator_message = (
            "A new unassigned task has been created."
        )

    recipients.append({
        "email": creator_email,
        "name": creator_name,
        "subject": f"Task created: {task_title}",
        "message": creator_message,
    })

    # Prepare assignee notification.
    if assignee:
        assignee_email = assignee.get("email")

        if not assignee_email:
            raise RuntimeError(
                "Assigned user's email is missing."
            )

        # Avoid duplicate messages for self-assigned tasks.
        if assignee_email.casefold() != creator_email.casefold():

            assignee_message = (
                f"A new task has been assigned to you by {creator_name}."
            )

            recipients.append({
                "email": assignee_email,
                "name": assignee.get("fullName") or "there",
                "subject": f"New task assigned: {task_title}",
                "message": assignee_message,
            })

        else:
            recipients[0]["message"] = (
                "A new task has been created and assigned to you."
            )

            recipients[0]["subject"] = f"New task: {task_title}"

    message_ids = []
    delivery_errors = []

    # Send a separate personalized email to each recipient.
    for recipient in recipients:

        safe_name = html.escape(recipient["name"])
        safe_message = html.escape(recipient["message"])

        text_body = f"""
Hello {recipient['name']},

{recipient['message']}

Task: {task_title}
Priority: {priority}
Due date: {due_date}

Open Hairdrama Tasks to view your task.

Regards,
Hairdrama Tasks
""".strip()

        html_body = f"""
        <div style="font-family:Arial,sans-serif;color:#26382f;line-height:1.7;">
            <h2 style="color:#315b48;">New task notification</h2>

            <p>Hello {safe_name},</p>

            <p>{safe_message}</p>

            <div style="background:#f6f8f2;padding:20px;border-radius:12px;">
                <h3>{safe_title}</h3>
                <p><strong>Priority:</strong> {safe_priority}</p>
                <p><strong>Due date:</strong> {safe_due_date}</p>
            </div>

            <p>Open Hairdrama Tasks to view your task.</p>

            <p>Regards,<br/>Hairdrama Tasks</p>
        </div>
        """

        try:
            message_id = send_email(
                recipient["email"],
                recipient["subject"],
                text_body,
                html_body,
            )

            message_ids.append(message_id)

        except Exception as error:
            logger.exception(
                "Failed to send task notification to %s",
                recipient["email"],
            )

            delivery_errors.append(
                recipient["email"]
            )

    if delivery_errors:
        raise RuntimeError(
            "Task email notification failed for: "
            + ", ".join(delivery_errors)
        )

    return message_ids


def send_task_completed_notification(task: dict) -> str:
    """Notify the task creator when their task is completed."""

    creator = task.get("createdBy") or {}
    assignee = task.get("assignedTo")

    recipient = creator.get("email")

    if not recipient:
        raise RuntimeError(
            "Task creator email is missing."
        )

    creator_name = creator.get("fullName") or "there"
    completed_by = (
        (assignee or {}).get("fullName")
        or creator.get("fullName")
        or "A task collaborator"
    )

    task_title = task["title"]

    safe_creator = html.escape(creator_name)
    safe_title = html.escape(task_title)
    safe_completed_by = html.escape(completed_by)

    subject = f"Task completed: {task_title}"

    text_body = f"""
Hello {creator_name},

Your task has been marked as completed.

Task: {task_title}
Completed by: {completed_by}

Open Hairdrama Tasks to review the task.

Regards,
Hairdrama Tasks
""".strip()

    html_body = f"""
    <div style="font-family:Arial,sans-serif;color:#26382f;line-height:1.7;">
        <h2 style="color:#315b48;">Task completed</h2>
        <p>Hello {safe_creator},</p>
        <p>Your task has been marked as completed.</p>
        <div style="background:#f6f8f2;padding:20px;border-radius:12px;">
            <h3>{safe_title}</h3>
            <p><strong>Completed by:</strong> {safe_completed_by}</p>
        </div>
        <p>Open Hairdrama Tasks to review the task.</p>
        <p>Regards,<br/>Hairdrama Tasks</p>
    </div>
    """

    return send_email(
        recipient,
        subject,
        text_body,
        html_body,
    )
