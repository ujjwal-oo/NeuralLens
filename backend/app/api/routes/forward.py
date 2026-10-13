
from fastapi import APIRouter, HTTPException

from app.schemas.experiment import ForwardRequest
from app.services.experiment_service import run_experiment

router = APIRouter(prefix="/forward", tags=["Forward Propagation"])


@router.post("/")
def forward_propagation(request: ForwardRequest):
    try:
        return run_experiment(request)
    except (ValueError, RuntimeError) as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
