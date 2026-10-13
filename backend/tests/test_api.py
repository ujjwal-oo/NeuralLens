
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_model_info():
    response = client.get("/api/models/")

    assert response.status_code == 200
    assert response.json()["name"] == "NeuralLens"


def test_forward_propagation():
    response = client.post(
        "/api/forward/",
        json={
            "layer_sizes": [3, 4, 2],
            "activation": "relu",
            "seed": 42,
            "inputs": [0.5, 0.8, 0.2],
            "target": 1
        }
    )

    assert response.status_code == 200

    result = response.json()

    assert len(result["layers"]) == 2
    assert len(result["probabilities"][0]) == 2
    assert "gradients" in result
    assert "loss" in result


def test_network_visualization():
    response = client.post(
        "/api/visualization/network",
        json={
            "layer_sizes": [2, 3, 2],
            "activation": "relu",
            "seed": 42
        }
    )

    assert response.status_code == 200

    result = response.json()

    assert len(result["layers"]) == 3
    assert len(result["connections"]) == 12


def test_training():
    response = client.post(
        "/api/training/run",
        json={
            "layer_sizes": [2, 4, 2],
            "activation": "relu",
            "seed": 42,
            "epochs": 3,
            "learning_rate": 0.01,
            "samples": 20
        }
    )

    assert response.status_code == 200
    assert len(response.json()["history"]) == 3
