
from fastapi import APIRouter

from app.engine.activations import SUPPORTED_ACTIVATIONS

router = APIRouter(prefix="/models", tags=["Models"])


@router.get("/")
def get_model_info():
    return {
        "name": "NeuralLens",
        "supported_architecture": "Fully Connected Neural Network",
        "activations": SUPPORTED_ACTIVATIONS,
        "max_layers": 6,
        "max_neurons_per_layer": 128
    }
