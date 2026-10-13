
import torch
import torch.nn.functional as F


SUPPORTED_ACTIVATIONS = [
    "relu",
    "sigmoid",
    "tanh",
    "softmax"
]


def apply_activation(x, name):
    name = name.lower()

    if name == "relu":
        return F.relu(x)

    if name == "sigmoid":
        return torch.sigmoid(x)

    if name == "tanh":
        return torch.tanh(x)

    if name == "softmax":
        return F.softmax(x, dim=-1)

    raise ValueError(f"Unsupported activation: {name}")
