from fastapi import FastAPI
from routes import upload_routes
from routes import query_routes
from routes import conversation_routes
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_routes.router)
app.include_router(query_routes.router)
app.include_router(conversation_routes.router)

@app.get("/")
def root():
    return {"message": "API is running"}


@app.get("/test")
def test():
    return {"message": "test endpoint is running"}
