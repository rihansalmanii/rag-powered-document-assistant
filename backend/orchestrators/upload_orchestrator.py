from services.chunking import chunk_text
from services.embeddings import get_embeddings
from services.pdf_services import extract_text, store_pdf
from db.chroma import add_to_chroma
from db.mongo import pdfs_collection


async def handle_upload(file, user_id: str, conversation_id: str = None):
    try:
        upload_result = await store_pdf(
            file=file, user_id=user_id, conversation_id=conversation_id
        )

        if not upload_result["success"]:
            return upload_result

        # storing the pdf in db
        store_result = pdfs_collection.insert_one(
            {
                "user_id": user_id,
                "conversation_id": conversation_id,
                "file_name": file.filename,
                "storage_provider": "supabase",
                "storage_bucket": upload_result["bucket"],
                "storage_path": upload_result["storage_path"],
                "file_size": upload_result["file_size"],
            }
        )

        print("Mongo insert acknowledged:", store_result.acknowledged)
        print("Mongo inserted ID:", store_result.inserted_id)

        print("Database:", pdfs_collection.database.name)
        print("Collection:", pdfs_collection.name)

        stored_pdf = pdfs_collection.find_one({
            "_id": store_result.inserted_id
        })

        print("Stored PDF record:", stored_pdf)

        doc_id = str(store_result.inserted_id)

        # extract text
        file.file.seek(0)  # Reset the file pointer to the beginning after storing
        text = extract_text(file)

        # chunking
        chunks = chunk_text(text)

        # embeddings
        embeddings = get_embeddings(chunks)

        # store in chrome
        add_to_chroma(chunks, embeddings, user_id, doc_id, conversation_id)

        return {
            "success": True,
            "message": "PDF processed successfully",
            "file_path": upload_result["storage_path"],
            "doc_id": doc_id,
            "chunks_length": len(chunks),
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
