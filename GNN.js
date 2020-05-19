class Genetic_Neural_Network extends Fully_Connected_Network {
    constructor(inputs, hidden_layers, layer_thickness, outputs, activation_function) {
        //create FCNN
        super(inputs, hidden_layers, layer_thickness, outputs, activation_function)
        this.type = Genetic_Neural_Network
    }
    replicate() {
        //copy
        return this.copy()
    }
    mutate(rate = 0.1) {
        //define result
        let result = this.copy()
        //loop through all weights and biases
        for (let i = 0; i < this.length; i++) {
            //mutate each neuron after coin-toss function
            result.weights[i].map(x => Math.random() < rate ? x + Math.random() * 2 - 1 : x)
            result.biases[i].map(x => Math.random() < rate ? x + Math.random() * 2 - 1 : x)
        }
        //return result
        return result
    }
    static crossover(network1, network2, weight = 0.5) {
        //define results
        network1 = network1.copy()
        network2 = network2.copy()
        //loop through all weights and biases
        for (let i = 0; i < network1.length; i++) {
            //loop through matrix details
            network1.weights[i].set(network1.weights[i].map((x,y) => Math.random() < weight ?x : y,network2.weights[i]))
            network1.biases[i].set(network1.biases[i].map((x,y) => Math.random() < weight ?x : y,network2.biases[i]))
        }
        //return results
        return network1.mutate(0.01)
    }
    static from_string(dict) {
        //create new network
        let network = new Genetic_Neural_Network(
            dict.weights[0].rows,
            dict.length - 2,
            dict.weights[0].cols,
            dict.weights[dict.weights.length - 1].cols,
            dict.activation_function_name,
            dict.learning_rate
        );
        //set variables
        for (let i = 0; i < network.length; i++) {
            network.weights[i] = network.weights[i].copy();
            network.biases[i] = network.biases[i].copy();
        }
        return network;
    }
}