const Matrix = require("./Matrix");
const Neural_Network = require("./ANN")
const Fully_Connected_Network = require("./FCNN")
const activation_functions = require("./Activation_Functions").activation_functions;
class Advanced_Fully_Connected_Network extends Fully_Connected_Network {
    constructor(layers,activation_function,learning_rate = 0.1) {
        //initialise variables
        this.length = layers.length -1;
        //creates weights and biases matrices
        this.weights = [];
        this.biases = [];
        //initialise on deltas
        this.weight_deltas = []
        this.bias_deltas = []
        for (let i = 0; i < this.length-1; i++) {
            //set up values
            this.weights.push(Matrix.multiply(new Matrix(layers[i], layers[i+1]),1/layers[i]*layers[i+1]));
            this.biases.push(Matrix.multiply(new Matrix(1,  layers[i+1]),1/this.width));
            this.weight_deltas.push(Matrix.blank(layers[i], layers[i+1]))
            this.bias_deltas.push(Matrix.blank(1,  layers[i+1]))
        }
        this.activation_function_name = activation_function
        this.activation_function = activation_functions[activation_function];
        this.type = "Advanced_Fully_Connected_Network"
    }
}
module.exports = Advanced_Fully_Connected_Network