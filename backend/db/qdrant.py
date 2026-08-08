import uuid

from qdrant_client.models import (
    FieldCondition,
    Filter,
    FilterSelector,
    MatchValue,
)

from config.qdrant_client import (
    client,
    QDRANT_COLLECTION
)


def add_to_qdrant(
    chunks,
    embeddings,
    user_id: str,
    doc_id: str,
    conversation_id: str,
    batch_size: int = 25
):
    if len(chunks) != len(embeddings):
        raise ValueError(
            "Chunks and embeddings length do not match"
        )

    points = []

    for chunk, embedding in zip(
        chunks,
        embeddings
    ):
        if isinstance(chunk, dict):
            chunk = chunk.get("text", "")

        if not isinstance(chunk, str):
            raise TypeError(
                "Each chunk must be a string"
            )

        vector = (
            embedding.tolist()
            if hasattr(embedding, "tolist")
            else list(embedding)
        )

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload={
                    "text": chunk,
                    "user_id": str(user_id),
                    "doc_id": str(doc_id),
                    "conversation_id": str(
                        conversation_id
                    )
                }
            )
        )

    total_batches = (
        len(points) + batch_size - 1
    ) // batch_size


    for start in range(
        0,
        len(points),
        batch_size
    ):
        batch = points[
            start:start + batch_size
        ]

        batch_number = (
            start // batch_size
        ) + 1


        client.upsert(
            collection_name=QDRANT_COLLECTION,
            points=batch,
            wait=True
        )


def delete_document_vectors(
    user_id: str,
    doc_id: str
):
    client.delete(
        collection_name=QDRANT_COLLECTION,
        points_selector=FilterSelector(
            filter=Filter(
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
            )
        ),
        wait=True
    )    
