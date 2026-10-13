
import torch

from app.engine.neural_network import NeuralNetwork


def run_forward(layer_sizes, inputs, activation="relu"):
    model = NeuralNetwork(
        layer_sizes=layer_sizes,
        activation=activation
    )

    x = torch.tensor(inputs, dtype=torch.float32)

    if x.ndim == 1:
        x = x.unsqueeze(0)

    if x.shape[-1] != layer_sizes[0]:
        raise ValueError(
            f"Expected {layer_sizes[0]} input values."
        )

    logits, trace = model.forward_with_trace(x)

    probabilities = torch.softmax(logits, dim=-1)

    trace["logits"] = logits.detach().tolist()
    trace["probabilities"] = probabilities.detach().tolist()
    trace["predicted_class"] = (
        probabilities.argmax(dim=-1).tolist()
    )

    return trace
