from fastapi import APIRouter, UploadFile, File
from services.pdf_services import extract_text
from services.chunking import chunk_text


router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        text = extract_text(file)

        chunks = chunk_text(text)

        return {
            "filename": file.filename,
            "text_length": len(text),
            "chunks_length": len(chunks),
            "first_chunk": chunks[0], 
            "preview": text[:500]
        }

    except Exception as e:
        return {"error": str(e)}

