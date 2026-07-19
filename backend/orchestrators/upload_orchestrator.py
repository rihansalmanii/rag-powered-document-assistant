from services.chunking import chunk_text
from services.embeddings import get_embeddings
from services.pdf_services import extract_text, store_pdf
from db.chroma import add_to_chroma
from creds.credentials import user_id, doc_id



async def handle_upload(file):
    try:
        upload_result = store_pdf(file.file)

        if not upload_result["success"]:
            return upload_result

        # extract text
        file.file.seek(0)  # Reset the file pointer to the beginning after storing
        text = extract_text(file)

        # chunking
        chunks = chunk_text(text)

        # embeddings
        embeddings = get_embeddings(chunks)

        # store in chrome
        add_to_chroma(chunks, embeddings, user_id, doc_id)

        return {
            "success": True,
            "message": "PDF processed successfully",
            "file_url": upload_result["url"],
            "chunks_length": len(chunks),
            "chunks": chunks
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
         