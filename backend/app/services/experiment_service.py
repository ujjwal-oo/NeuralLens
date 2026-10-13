
import torch

from app.engine.neural_network import NeuralNetwork
from app.engine.losses import calculate_loss
from app.engine.backpropagation import calculate_gradients


def create_model(layer_sizes, activation, seed):
    torch.manual_seed(seed)

    return NeuralNetwork(
        layer_sizes=layer_sizes,
        activation=activation
    )


def run_experiment(request):
    model = create_model(
        request.layer_sizes,
        request.activation,
        request.seed
    )

    x = torch.tensor(
        [request.inputs],
        dtype=torch.float32
    )

    logits, trace = model.forward_with_trace(x)
    probabilities = torch.softmax(logits, dim=-1)

    trace["logits"] = logits.detach().tolist()
    trace["probabilities"] = probabilities.detach().tolist()
    trace["predicted_class"] = int(
        probabilities.argmax(dim=-1).item()
    )

    if request.target is not None:
        if request.target >= request.layer_sizes[-1]:
            raise ValueError(
                "Target must identify a valid output class."
            )

        target = torch.tensor([request.target])

        loss = calculate_loss(logits, target)

        trace["loss"] = float(loss.detach().item())
        trace["gradients"] = calculate_gradients(
            model,
            loss
        )

    return trace
