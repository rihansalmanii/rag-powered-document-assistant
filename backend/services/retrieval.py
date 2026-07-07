from db.chroma import collection
from services.embeddings import model


def retrieve_chunks(query, top_k=3, user_id=None, doc_id=None):
    # query -> embeddings
    query_embedding = model.encode([query]).tolist()

    # filtering

    # empty dictionary for filters
    filters = []

    if user_id is not None:
        filters.append({"user_id": user_id})

    if doc_id is not None:
        filters.append({"doc_id": doc_id})

    # Final where condition
    where = None

    if len(filters) == 1:
        where = filters[0]  # single condition

    elif len(filters) > 1:
        where = {"$and": filters} 

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

    chunks = []

    # picking one by one
    for doc, meta, dist in zip(documents, metadatas, distances):
        chunks.append({
            "text": doc,
            "metadata": meta,
            "distance": dist
        })

    return chunks
    
