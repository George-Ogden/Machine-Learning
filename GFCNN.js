const Genetic_Neural_Network = require("./GNN.js")
const Matrix = require("./Matrix.js");
class Genetic_Fully_Connected_Neural_Network extends Genetic_Neural_Network {
    constructor(inputs, hidden_layers, layer_thickness, outputs, activation_function="tanh") {
        //create FCNN
        super("Genetic_Fully_Connected_Neural_Network",activation_function)
        //initialise variables
        this.length = hidden_layers + 2;
        this.width = layer_thickness;
        //creates weights and biases matrices
        this.weights = [];
        this.biases = [];
        for (let i = 0; i < this.length; i++) {
            //set up values
            this.weights.push(Matrix.multiply(new Matrix(this.width, this.width),Math.sqrt(2/this.width)));
            this.biases.push(Matrix.multiply(new Matrix(1, this.width),Math.sqrt(2/this.width)));
        }
        //alter significant matrices
        this.weights[0] = Matrix.multiply(new Matrix(inputs, this.width),Math.sqrt(2/this.width));
        this.weights[this.length - 1] = Matrix.multiply(new Matrix(this.width, outputs),Math.sqrt(2/this.width));
        this.biases[this.length - 1] =Matrix.multiply(new Matrix(1, outputs),Math.sqrt(4/outputs));
    }
    replicate() {
        //copy
        return this.copy()
    }
    copy(){
        return Genetic_Fully_Connected_Neural_Network.from_string(eval("("+JSON.stringify(this)+")"))
    }
    static from_string(dict) {
        //create new network
        let network = new Genetic_Fully_Connected_Neural_Network(
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
    forward_propagate(input) {
        let output = input.copy();
        this.process = [output.copy()];
        //set first output as input
        for (let i = 0; i < this.length; i++) {
            //multiply by weights
            output.dot(this.weights[i]);
            //add biases
            output.add(this.biases[i]);
            //activation function
            output.map(this.activation_function.function);
        }
        return output;
    }
}
module.exports = Genetic_Fully_Connected_Neural_Network