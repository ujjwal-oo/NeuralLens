
import torch
import torch.nn.functional as F


def calculate_loss(logits, targets, loss_name="cross_entropy"):
    loss_name = loss_name.lower()

    if loss_name == "cross_entropy":
        targets = targets.long().reshape(-1)
        return F.cross_entropy(logits, targets)

    if loss_name == "mse":
        targets = targets.float()
        return F.mse_loss(logits, targets)

    raise ValueError(
        "Supported losses are cross_entropy and mse."
    )
