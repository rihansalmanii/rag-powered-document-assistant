from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-mpnet-base-v2")

def  get_embeddings(chunks):
    embeddings = model.encode(chunks)

    return embeddings
