
import torch
from fastapi import APIRouter, HTTPException

from app.schemas.experiment import TrainingRequest
from app.services.experiment_service import create_model
from app.engine.optimizers import create_optimizer
from app.engine.losses import calculate_loss

router = APIRouter(prefix="/training", tags=["Training"])


@router.post("/run")
def train_model(request: TrainingRequest):
    if request.layer_sizes[-1] < 2:
        raise HTTPException(
            status_code=400,
            detail="Training requires at least two output classes."
        )

    try:
        torch.manual_seed(request.seed)

        model = create_model(
            request.layer_sizes,
            request.activation,
            request.seed
        )

        input_size = request.layer_sizes[0]
        class_count = request.layer_sizes[-1]

        # Generate a reproducible synthetic dataset.
        x = torch.randn(request.samples, input_size)

        teacher_weights = torch.randn(
            input_size,
            class_count
        )

        y = (x @ teacher_weights).argmax(dim=1)

        optimizer = create_optimizer(
            model,
            request.learning_rate
        )

        history = []

        for epoch in range(request.epochs):
            model.train()
            optimizer.zero_grad()

            logits = model(x)
            loss = calculate_loss(logits, y)

            loss.backward()
            optimizer.step()

            with torch.no_grad():
                updated_logits = model(x)
                predictions = updated_logits.argmax(dim=1)
                accuracy = (predictions == y).float().mean()

            history.append({
                "epoch": epoch + 1,
                "loss": round(float(loss.item()), 6),
                "accuracy": round(float(accuracy.item()), 6)
            })

        return {
            "message": "Training completed.",
            "samples": request.samples,
            "epochs": request.epochs,
            "final_loss": history[-1]["loss"],
            "final_accuracy": history[-1]["accuracy"],
            "history": history
        }

    except (ValueError, RuntimeError) as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error
