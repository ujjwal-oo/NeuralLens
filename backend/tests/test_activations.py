
import torch

from app.engine.activations import apply_activation


def test_relu():
    x = torch.tensor([-2.0, 0.0, 3.0])

    result = apply_activation(x, "relu")

    assert result.tolist() == [0.0, 0.0, 3.0]


def test_sigmoid():
    x = torch.tensor([0.0])

    result = apply_activation(x, "sigmoid")

    assert abs(result.item() - 0.5) < 1e-6


def test_tanh():
    x = torch.tensor([0.0])

    result = apply_activation(x, "tanh")

    assert abs(result.item()) < 1e-6


def test_softmax_sums_to_one():
    x = torch.tensor([1.0, 2.0, 3.0])

    result = apply_activation(x, "softmax")

    assert abs(result.sum().item() - 1.0) < 1e-6
