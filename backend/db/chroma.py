import chromadb
import uuid

client = chromadb.Client()

collection = client.get_or_create_collection(name="pdf_db")


def add_to_chroma(chunks, embeddings, user_id, doc_id):
    ids = [str(uuid.uuid4()) for _ in chunks]

    metadatas = [
        {"user_id": user_id, "doc_id": doc_id}
        for _ in chunks
    ]

    collection.add(
        documents = chunks,
        embeddings = embeddings,
        metadatas = metadatas,
        ids = ids
    )


