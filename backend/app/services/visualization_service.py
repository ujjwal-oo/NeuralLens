
def build_network_description(layer_sizes):
    layers = []

    for index, size in enumerate(layer_sizes):
        layers.append({
            "layer_index": index,
            "layer_type": (
                "input"
                if index == 0
                else "output"
                if index == len(layer_sizes) - 1
                else "hidden"
            ),
            "neuron_count": size,
            "neurons": [
                {
                    "neuron_index": neuron_index,
                    "label": f"L{index}_N{neuron_index}"
                }
                for neuron_index in range(size)
            ]
        })

    connections = []

    for index in range(len(layer_sizes) - 1):
        for source in range(layer_sizes[index]):
            for target in range(layer_sizes[index + 1]):
                connections.append({
                    "source": f"L{index}_N{source}",
                    "target": f"L{index + 1}_N{target}"
                })

    return {
        "layers": layers,
        "connections": connections
    }
