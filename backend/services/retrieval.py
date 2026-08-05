from qdrant_client.models import (
    FieldCondition,
    Filter,
    MatchValue
)

from config.qdrant_client import (
    client,
    QDRANT_COLLECTION
)

from services.embeddings import model


def retrieve_chunks(
    query: str,
    doc_id: str,
    user_id: str,
    top_k: int = 5
):
    if not query or not query.strip():
        return []

    # Keep embedding format consistent with document embeddings
    query_embedding = model.encode(
        [query.strip()]
    )[0]

    query_vector = (
        query_embedding.tolist()
        if hasattr(query_embedding, "tolist")
        else list(query_embedding)
    )

    print("RETRIEVING FROM QDRANT")
    print("USER ID:", str(user_id))
    print("DOC ID:", str(doc_id))
    print("VECTOR LENGTH:", len(query_vector))

    result = client.query_points(
        collection_name=QDRANT_COLLECTION,
        query=query_vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(
                        value=str(user_id)
                    )
                ),
                FieldCondition(
                    key="doc_id",
                    match=MatchValue(
                        value=str(doc_id)
                    )
                )
            ]
        ),
        limit=top_k,
        with_payload=True,
        with_vectors=False
    )

    print("QDRANT MATCHES:", len(result.points))

    chunks = []

    for point in result.points:
        payload = point.payload or {}
        text = payload.get("text")

        print(
            "SCORE:",
            point.score,
            "DOC ID:",
            payload.get("doc_id")
        )

    for index, point in enumerate(result.points, start=1):
        payload = point.payload or {}
        text = payload.get("text", "")

        distance = 1 - point.score

        print(f"\nRESULT {index}")
        print("SCORE:", point.score)
        print("DISTANCE:", distance)
        print("TEXT:", text[:400])

        SCORE_THRESHOLD = 0.46

        # Do not apply a threshold yet.
        # First confirm that retrieval works correctly.
        if text and point.score >= SCORE_THRESHOLD:
            chunks.append({
                "text": text,
                "metadata": payload,
                "score": point.score,
                "distance": 1 - point.score
            })

    return chunks