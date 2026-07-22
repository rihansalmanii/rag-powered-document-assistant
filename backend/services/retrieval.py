from db.chroma import collection
from services.embeddings import model



def retrieve_chunks(query, doc_id, top_k=5):
    # query -> embeddings
    query_embedding = model.encode([query]).tolist()

    # Final where condition
    where = {
        "doc_id": str(doc_id)
    }


    # searching in db
    result = collection.query(
        query_embeddings = query_embedding,
        n_results = top_k,
        where = where 
    )

    
    # retreival return 2d list so taking first one
    documents = result.get("documents", [[]])[0] or []
    metadatas = result.get("metadatas", [[]])[0] or []
    distances = result.get("distances", [[]])[0] or []

    THRESHOLD = 1.2

    chunks = []

    # picking one by one
    for doc, meta, dist in zip(documents, metadatas, distances):
        if dist < THRESHOLD:
            chunks.append({
            "text": doc,
            "metadata": meta,
            "distance": dist
        })

    return chunks
    
