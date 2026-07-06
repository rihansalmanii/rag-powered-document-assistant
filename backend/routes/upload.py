from fastapi import APIRouter, UploadFile, File
from services.pdf_services import extract_text
from services.chunking import chunk_text
from services.embeddings import get_embeddings


router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        text = extract_text(file)

        chunks = chunk_text(text)
        embeddings = get_embeddings(chunks)

        return {
            "message": "PDF processed successfully!",
            "filename": file.filename,
            "chunks": len(chunks)
            
        }

    except Exception as e:
        return {"error": str(e)}
    

