from pypdf import PdfReader
import cloudinary
import cloudinary.uploader
import os
import uuid

from fastapi import HTTPException
from dotenv import load_dotenv
from config.supabase_client import SUPABASE_BUCKET, supabase

load_dotenv()


MAX_PDF_SIZE = 50 * 1024 * 1024


# cloudinary.config(
#     cloud_name = os.getenv("CLOUD_NAME"),
#     api_key = os.getenv("CLOUDINARY_API"),
#     api_secret = os.getenv("CLOUDINARY_API_SECRET")
# )


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

        print("SUPABASE RESPONSE:", response)

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


# store pdf in cloudinary
# def store_pdf(file):
#     try:
#         result = cloudinary.uploader.upload(
#             file,
#             resource_type = 'raw',
#             folder = "DocLens_pdfs"
#         )


#         return {
#             "success": True,
#             "message": "pdf uploaded successfully",
#             "url": result.get("secure_url"),

#         }


#     except Exception as e:
#         return {
#             "success": False,
#             "message": "cloudinary upload failed!",
#             "error": str(e)

#         }


# extract text from pdf
def extract_text(file):
    file.file.seek(0)
    pdf = PdfReader(file.file)
    text = ""

    for page in pdf.pages:
        text += page.extract_text() or ""

    return text
