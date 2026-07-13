from fastapi import FastAPI
from routes import upload
from routes import query_routes

app = FastAPI()

app.include_router(upload.router)
app.include_router(query_routes.router)

@app.get("/")
def root():
    return {"message": "API is running"}


@app.get("/test")
def test():
    return {"message": "test endpoint is running"}
