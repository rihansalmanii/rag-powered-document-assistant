from fastapi import APIRouter, UploadFile, File
from services.pdf_services import extract_text
from services.chunking import chunk_text
from services.embeddings import get_embeddings
from db.chroma import add_to_chroma
from creds.credentials import user_id, doc_id


router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        text = extract_text(file)

        chunks = chunk_text(text)
        embeddings = get_embeddings(chunks)

        

        data = add_to_chroma(chunks, embeddings, user_id, doc_id)

        return {
            "message": "PDF processed and stored successfully!",
            "filename": file.filename,
            "chunks": len(chunks)
            
        }

    except Exception as e:
        return {"error": str(e)}
    

