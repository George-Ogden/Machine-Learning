const Genetic_Neural_Network = require("./GNN.js")
const Matrix = require("./Matrix.js");
const Convoluting = require("./Convolutional Layers.js")
class Genetic_Convolutional_Neural_Network extends Genetic_Neural_Network {
    constructor(kernel_width, kernel_height, kernels, activation_function = "swish") {
        //create CNN
        super("Genetic_Convolutional_Neural_Network", activation_function);
        //initialise variables
        this.length = kernels;
        this.width = kernel_width;
        this.height = kernel_height;
        //creates weights and biases matrices
        this.weights = [];
        this.biases = [];
        //create kernels
        this.kernels = [];
        //loop through kernels
        for (let i = 0; i < kernels; i++) {
            //insert kernel into array
            this.kernels.push(Matrix.multiply(new Matrix(kernel_height, kernel_width), 2 / kernel_width ** 2));
        }
    }
    static convolution = Convoluting.convolution;
    replicate() {
        //copy
        return this.copy();
    }
    copy() {
        return Genetic_Convolutional_Neural_Network.from_string(eval("(" + JSON.stringify(this) + ")"));
    }
    static from_string(dict) {
        //create new network
        let network = new Genetic_Convolutional_Neural_Network(dict.width, dict.height, dict.length, dict.activation_function_name);
        //set variables
        for (let i = 0; i < network.length; i++) {
            network.kernels[i] = network.kernels[i].copy();
        }
        return network;
    }

    forward_propagate(input) {
        let output = input.copy();
        //set first output as input
        for (let i = 0; i < this.length; i++) {
            //add to next layer
            output.set(Matrix.map(Convoluting.convolution(output, this.kernels[i]),this.activation_function.function))
        }
        return output;
    }
    mutate(rate = 0.05) {
        //define result
        let result = this.copy();
        //loop through all weights and biases
        for (let i = 0; i < this.length; i++) {
            //mutate each neuron after coin-toss function
            result.kernels[i].map((x) => (Math.random() < rate ? x + Math.random() * 2 - 1 : x));
        }
        //return result
        return result;
    }
    static crossover(network1, network2, weight = 0.5) {
        //define results
        network1 = network1.copy();
        network2 = network2.copy();
        //loop through all weights and biases
        for (let i = 0; i < network1.length; i++) {
            //loop through matrix details
            network1.kernels[i].set(network1.kernels[i].map((x, y) => (Math.random() < weight ? x : y), network2.kernels[i]));
        }
        //return results
        return network1.mutate(0.01);
    }
}
module.exports = Genetic_Convolutional_Neural_Network;
