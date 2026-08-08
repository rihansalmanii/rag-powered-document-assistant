from pypdf import PdfReader
import os
import uuid

from fastapi import HTTPException
from dotenv import load_dotenv
from config.supabase_client import SUPABASE_BUCKET, supabase

load_dotenv()


MAX_PDF_SIZE = 50 * 1024 * 1024


async def store_pdf(file, user_id, conversation_id):
    try:
        file_bytes = await file.read()

        if len(file_bytes) > MAX_PDF_SIZE:
            raise HTTPException(status_code=400, detail="Maximum PDF size is 50 MB")

        original_name = os.path.basename(file.filename or "document.pdf")

        storage_path = (
            f"DocLens_pdfs/"
            f"{user_id}/"
            f"{conversation_id}/"
            f"{uuid.uuid4()}-{original_name}"
        )

        response = supabase.storage.from_(SUPABASE_BUCKET).upload(
                    path=storage_path,
                    file=file_bytes,
                    file_options={"content-type": "application/pdf", "upsert": "false"},
                )


        await file.seek(0)

        return {
            "success": True,
            "message": "pdf stored successfully",
            "storage_path": storage_path,
            "bucket": SUPABASE_BUCKET,
            "file_size": len(file_bytes),
        }

    except Exception as e:
        await file.seek(0)

        return {"success": False, "message": "Supabase upload failed!", "error": str(e)}


def delete_pdf_from_storage(
    bucket: str,
    storage_path: str
):
    supabase.storage.from_(bucket).remove([
        storage_path
    ])



# extract text from pdf
def extract_text(file):
    file.file.seek(0)
    pdf = PdfReader(file.file)
    text = ""

    for page in pdf.pages:
        text += page.extract_text() or ""

    return text
