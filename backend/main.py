from fastapi import FastAPI
from routes import upload

app = FastAPI()

app.include_router(upload.router)

@app.get("/")
def root():
    return {"message": "API is running"}


@app.get("/test")
def test():
    return {"message": "test endpoint is running"}
