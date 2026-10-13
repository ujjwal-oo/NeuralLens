
from typing import Literal

from pydantic import BaseModel, Field, model_validator


ActivationName = Literal["relu", "sigmoid", "tanh"]


class ModelConfig(BaseModel):
    layer_sizes: list[int] = Field(
        default=[4, 5, 3],
        min_length=2,
        max_length=6
    )

    activation: ActivationName = "relu"
    seed: int = Field(default=42, ge=0, le=1000000)

    @model_validator(mode="after")
    def validate_layer_sizes(self):
        if any(size < 1 or size > 128 for size in self.layer_sizes):
            raise ValueError(
                "Layer sizes must be between 1 and 128."
            )
        return self


class ForwardRequest(ModelConfig):
    inputs: list[float]
    target: int | None = Field(default=None, ge=0)

    @model_validator(mode="after")
    def validate_inputs(self):
        if len(self.inputs) != self.layer_sizes[0]:
            raise ValueError(
                "Input count must match the input layer size."
            )
        return self


class TrainingRequest(ModelConfig):
    epochs: int = Field(default=50, ge=1, le=500)
    learning_rate: float = Field(
        default=0.01,
        gt=0,
        le=1
    )
    samples: int = Field(default=200, ge=20, le=2000)
