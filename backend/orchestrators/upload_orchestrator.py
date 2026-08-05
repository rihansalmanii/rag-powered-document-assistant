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
        print("\n========== UPLOAD START ==========")

        print("STEP 1: Uploading to Supabase")
        upload_result = await store_pdf(
            file=file,
            user_id=user_id,
            conversation_id=conversation_id
        )
        print("STEP 1 COMPLETE:", upload_result.get("success"))

        if not upload_result.get("success"):
            return upload_result

        print("STEP 2: Writing metadata to MongoDB")
        store_result = pdfs_collection.insert_one({
            "user_id": user_id,
            "conversation_id": conversation_id,
            "file_name": file.filename,
            "storage_provider": "supabase",
            "storage_bucket": upload_result["bucket"],
            "storage_path": upload_result["storage_path"],
            "file_size": upload_result["file_size"],
        })
        print("STEP 2 COMPLETE:", store_result.inserted_id)

        doc_id = str(store_result.inserted_id)

        print("STEP 3: Extracting text")
        await file.seek(0)
        text = extract_text(file)
        print("STEP 3 COMPLETE: characters =", len(text))

        print("STEP 4: Creating chunks")
        chunks = chunk_text(text)

        chunk_texts = [
            chunk["text"]
            if isinstance(chunk, dict)
            else chunk
            for chunk in chunks
        ]
        print("STEP 4 COMPLETE: chunks =", len(chunk_texts))

        print("STEP 5: Generating embeddings")
        embeddings = get_embeddings(chunk_texts)
        print("STEP 5 COMPLETE: embeddings =", len(embeddings))

        print("STEP 6: Writing vectors to Qdrant")
        add_to_qdrant(
            chunks=chunk_texts,
            embeddings=embeddings,
            user_id=user_id,
            doc_id=doc_id,
            conversation_id=conversation_id
        )
        print("STEP 6 COMPLETE")

        print("========== UPLOAD COMPLETE ==========\n")

        return {
            "success": True,
            "message": "PDF processed successfully",
            "file_path": upload_result["storage_path"],
            "doc_id": doc_id,
            "conversation_id": conversation_id,
            "chunks_length": len(chunk_texts),
        }

    except Exception as error:
        print("\n========== UPLOAD FAILED ==========")
        print("ERROR TYPE:", type(error).__name__)
        print("ERROR MESSAGE:", str(error))
        traceback.print_exc()
        print("===================================\n")

        return {
            "success": False,
            "error": str(error)
        }