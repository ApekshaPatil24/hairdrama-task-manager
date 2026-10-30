import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


# Read Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")


# Validate required configuration
if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is missing from backend/.env")

if not SUPABASE_SECRET_KEY:
    raise RuntimeError("SUPABASE_SECRET_KEY is missing from backend/.env")


# Initialize the Supabase client
supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
)