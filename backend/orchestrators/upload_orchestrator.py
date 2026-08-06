from services.chunking import chunk_text
from services.embeddings import get_embeddings
from services.pdf_services import extract_text, store_pdf
from db.qdrant import add_to_qdrant
from db.mongo import pdfs_collection


import traceback

from services.chunking import chunk_text
from services.embeddings import get_embeddings
from services.pdf_services import extract_text, store_pdf
from db.qdrant import add_to_qdrant
from db.mongo import pdfs_collection


import traceback

async def handle_upload(
    file,
    user_id: str,
    conversation_id: str
):
    try:

        upload_result = await store_pdf(
            file=file,
            user_id=user_id,
            conversation_id=conversation_id
        )
        

        if not upload_result.get("success"):
            return upload_result

        store_result = pdfs_collection.insert_one({
            "user_id": user_id,
            "conversation_id": conversation_id,
            "file_name": file.filename,
            "storage_provider": "supabase",
            "storage_bucket": upload_result["bucket"],
            "storage_path": upload_result["storage_path"],
            "file_size": upload_result["file_size"],
        })

        doc_id = str(store_result.inserted_id)

        await file.seek(0)
        text = extract_text(file)


        chunks = chunk_text(text)

        chunk_texts = [
            chunk["text"]
            if isinstance(chunk, dict)
            else chunk
            for chunk in chunks
        ]

        embeddings = get_embeddings(chunk_texts)

        add_to_qdrant(
            chunks=chunk_texts,
            embeddings=embeddings,
            user_id=user_id,
            doc_id=doc_id,
            conversation_id=conversation_id
        )


        return {
            "success": True,
            "message": "PDF processed successfully",
            "file_path": upload_result["storage_path"],
            "doc_id": doc_id,
            "conversation_id": conversation_id,
            "chunks_length": len(chunk_texts),
        }

    except Exception as error:

        traceback.print_exc()

        return {
            "success": False,
            "error": str(error)
        }