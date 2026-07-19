from fastapi import APIRouter, UploadFile, File
from services.pdf_services import extract_text
from services.chunking import chunk_text
from services.embeddings import get_embeddings
from db.chroma import add_to_chroma
from creds.credentials import user_id, doc_id
from services.pdf_services import store_pdf
from orchestrators.upload_orchestrator import handle_upload


router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    result = await handle_upload(file)
    return result

    # try:
    #     upload_result = store_pdf(file.file)

    #     if not upload_result["success"]:
    #         return upload_result

    #     text = extract_text(file)

    #     chunks = chunk_text(text)
    #     embeddings = get_embeddings(chunks)
        

    #     data = add_to_chroma(chunks, embeddings, user_id, doc_id)

    #     return { 
    #         "message": "PDF processed and stored successfully!",
    #         "filename": file.filename,
    #         "chunks": len(chunks)
            
    #     }

    # except Exception as e:
    #     return {"error": str(e)}
    

