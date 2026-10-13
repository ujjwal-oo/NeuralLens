
import torch


def create_optimizer(model, learning_rate=0.01):
    if not 0 < learning_rate <= 1:
        raise ValueError(
            "Learning rate must be greater than 0 and at most 1."
        )

    return torch.optim.SGD(
        model.parameters(),
        lr=learning_rate
    )
