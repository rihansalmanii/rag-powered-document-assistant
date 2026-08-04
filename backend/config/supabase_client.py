import os

from supabase import Client, create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_BUCKET = os.get("SUPABASE_BUCKET")
SUPABASE_SECRET_KEY = os.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    raise RuntimeError("supabase url is missing")

if not SUPABASE_SECRET_KEY:
    raise RuntimeError("supabase key is missing")

supabase: Client = creat_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)
