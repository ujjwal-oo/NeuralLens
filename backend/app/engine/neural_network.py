
import torch
import torch.nn as nn

from app.engine.activations import apply_activation


class NeuralNetwork(nn.Module):
    def __init__(
        self,
        layer_sizes,
        activation="relu"
    ):
        super().__init__()

        if len(layer_sizes) < 2:
            raise ValueError(
                "At least input and output layers are required."
            )

        if any(size < 1 or size > 128 for size in layer_sizes):
            raise ValueError(
                "Layer sizes must be between 1 and 128."
            )

        if len(layer_sizes) > 6:
            raise ValueError(
                "Maximum supported network depth is 6 layers."
            )

        self.layer_sizes = layer_sizes
        self.activation_name = activation.lower()

        if self.activation_name not in ("relu", "sigmoid", "tanh"):
            raise ValueError(
                "Hidden activation must be relu, sigmoid, or tanh."
            )

        self.layers = nn.ModuleList([
            nn.Linear(layer_sizes[i], layer_sizes[i + 1])
            for i in range(len(layer_sizes) - 1)
        ])

    def forward_with_trace(self, x):
        trace = {
            "input": x.detach().tolist(),
            "layers": []
        }

        current = x

        for index, layer in enumerate(self.layers):
            z = layer(current)

            is_output_layer = (
                index == len(self.layers) - 1
            )

            if is_output_layer:
                current = z
                activation_name = "linear"
            else:
                current = apply_activation(
                    z,
                    self.activation_name
                )
                activation_name = self.activation_name

            trace["layers"].append({
                "layer_index": index + 1,
                "pre_activation": z.detach().tolist(),
                "activation": current.detach().tolist(),
                "activation_function": activation_name,
                "weights": layer.weight.detach().tolist(),
                "biases": layer.bias.detach().tolist()
            })

        return current, trace

    def forward(self, x):
        output, _ = self.forward_with_trace(x)
        return output
