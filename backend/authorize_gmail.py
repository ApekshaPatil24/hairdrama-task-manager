
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


BASE_DIR = Path(__file__).resolve().parent

CREDENTIALS_FILE = BASE_DIR / "credentials.json"
TOKEN_FILE = BASE_DIR / "token.json"

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
]


def main():
    if not CREDENTIALS_FILE.exists():
        raise FileNotFoundError(
            "credentials.json is missing from the backend folder."
        )

    print("Starting Gmail authorization...")

    flow = InstalledAppFlow.from_client_secrets_file(
        str(CREDENTIALS_FILE),
        scopes=SCOPES,
    )

    credentials = flow.run_local_server(
        port=0,
        access_type="offline",
        prompt="consent",
    )

    # Save credentials securely for backend use.
    TOKEN_FILE.write_text(
        credentials.to_json(),
        encoding="utf-8",
    )

print("\nGmail OAuth authorization successful!")
print("Token saved securely:", TOKEN_FILE.name)
print("Gmail sending permission granted.")

if __name__ == "__main__":
    main()
