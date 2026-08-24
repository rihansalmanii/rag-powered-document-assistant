from fastapi import FastAPI
from routes import upload_routes
from routes import query_routes
from routes import conversation_routes
from routes import auth_routes
from fastapi.middleware.cors import CORSMiddleware

import os

app = FastAPI()

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(upload_routes.router)
app.include_router(query_routes.router)
app.include_router(conversation_routes.router)

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }



