
from fastapi import APIRouter, HTTPException

from app.schemas.experiment import ModelConfig
from app.services.visualization_service import (
    build_network_description
)

router = APIRouter(
    prefix="/visualization",
    tags=["Visualization"]
)


@router.post("/network")
def get_network_visualization(request: ModelConfig):
    try:
        return build_network_description(
            request.layer_sizes
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
