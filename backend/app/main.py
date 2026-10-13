
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import (
    APP_NAME,
    APP_VERSION,
    FRONTEND_URL
)

from app.api.routes import (
    models,
    forward,
    training,
    visualization
)

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=(
        "Interactive neural network visualization and "
        "deep learning education API."
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(models.router, prefix="/api")
app.include_router(forward.router, prefix="/api")
app.include_router(training.router, prefix="/api")
app.include_router(visualization.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Welcome to NeuralLens API",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": APP_NAME,
        "version": APP_VERSION
    }
