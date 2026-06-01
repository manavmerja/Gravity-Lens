from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers.aws_accounts import router as aws_router

# This creates all tables automatically when app starts
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GravityLens API",
    description="Cloud Infrastructure Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aws_router)

@app.get("/")
def health_check():
    return {
        "status": "running",
        "product": "GravityLens API",
        "version": "1.0.0"
    }