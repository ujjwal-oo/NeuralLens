
def calculate_gradients(model, loss):
    model.zero_grad(set_to_none=True)
    loss.backward()

    gradients = []

    for name, parameter in model.named_parameters():
        if parameter.grad is not None:
            gradients.append({
                "parameter": name,
                "gradient": parameter.grad.detach().tolist()
            })

    return gradients
