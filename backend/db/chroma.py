import chromadb
import uuid

client = chromadb.Client()

collection = client.get_or_create_collection(name="pdf_db")


def add_to_chroma(chunks, embeddings, user_id, doc_id, conversation_id):
    ids = [str(uuid.uuid4()) for _ in chunks]

    metadatas = [
    {
        "user_id": str(user_id),
        "doc_id": str(doc_id),
        "conversation_id": str(conversation_id) if conversation_id else "default"
    }
    for _ in chunks
]

    collection.add(
        documents = chunks,
        embeddings = embeddings,
        metadatas = metadatas,
        ids = ids,
    )


