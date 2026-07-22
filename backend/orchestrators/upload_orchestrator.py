from services.chunking import chunk_text
from services.embeddings import get_embeddings
from services.pdf_services import extract_text, store_pdf
from db.chroma import add_to_chroma
from creds.credentials import user_id
from db.mongo import pdfs_collection


def handle_upload(file, conversation_id: str = None):
    try:
        upload_result = store_pdf(file.file)

        if not upload_result["success"]:
            return upload_result

        # storing the pdf in db
        store_result = pdfs_collection.insert_one({
            "user_id": user_id,
            "file_url": upload_result["url"],
            "file_name": file.filename,
            "conversation_id": conversation_id
        })

        doc_id = str(store_result.inserted_id)

        # extract text
        file.file.seek(0)  # Reset the file pointer to the beginning after storing
        text = extract_text(file)

        # chunking
        chunks = chunk_text(text)
        print("CHUNK TYPE:", type(chunks[0]))
        print("CHUNK VALUE:", chunks[0])    

        # embeddings
        embeddings = get_embeddings(chunks)

        # store in chrome
        add_to_chroma(chunks, embeddings, user_id, doc_id, conversation_id)

        return {
            "success": True,
            "message": "PDF processed successfully",
            "file_url": upload_result["url"],
            "doc_id": doc_id,
            "chunks_length": len(chunks)
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
         