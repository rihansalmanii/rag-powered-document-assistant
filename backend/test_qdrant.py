import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient

load_dotenv(override=True)

qdrant_url = os.getenv("QDRANT_URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")

print("URL:", repr(qdrant_url))
print("KEY EXISTS:", bool(qdrant_api_key))
print(
    "KEY PREFIX:",
    repr(qdrant_api_key[:10])
    if qdrant_api_key
    else None
)

client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key,
    timeout=20
)

print(
    client.get_collection(
        collection_name="pdf_chunks"
    )
)