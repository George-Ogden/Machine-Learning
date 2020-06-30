const Matrix = require("./Matrix.js");
const Neural_Network = require("./ANN.js")
const Activation_Function = require("./Activation_Functions.js")
class Fully_Connected_Network extends Neural_Network {
    constructor(        inputs,        hidden_layers,        layer_thickness,        outputs,        activation_function,        learning_rate = 0.1    ) {
        //superclass constructor
        super("Fully_Connected_Network", activation_function, learning_rate)
        //initialise variables
        this.length = hidden_layers + 2;
        this.width = layer_thickness;
        //creates weights and biases matrices
        this.weights = [];
        this.biases = [];
        //initialise on deltas
        this.weight_deltas = []
        this.bias_deltas = []
        for (let i = 0; i < this.length; i++) {
            //set up values
            this.weights.push(Matrix.multiply(new Matrix(this.width, this.width),Math.sqrt(2/this.width)));
            this.biases.push(Matrix.multiply(new Matrix(1, this.width),Math.sqrt(2/this.width)));
            this.weight_deltas.push(Matrix.blank(this.weights[i].rows,this.weights[i].cols))
            this.bias_deltas.push(Matrix.blank(1, this.biases[i].cols))
        }
        //alter significant matrices
        this.weights[0] = Matrix.multiply(new Matrix(inputs, this.width),Math.sqrt(2/this.width));
        this.weight_deltas[0] = Matrix.blank(inputs, this.width);
        this.weights[this.length - 1] = Matrix.multiply(new Matrix(this.width, outputs),Math.sqrt(2/this.width));
        this.weight_deltas[this.length - 1] = Matrix.blank(this.width, outputs);
        this.biases[this.length - 1] =Matrix.multiply(new Matrix(1, outputs),Math.sqrt(4/outputs));
        this.bias_deltas[this.length - 1] = Matrix.blank(1, outputs);
    }
    copy() {
        //create network from string of self
        return eval(this.type).from_string(this);
    }
    show() {
        //display weights and biases
        for (let i = 0; i < this.length; i++) {
            this.weights[i].show();
            this.biases[i].show();
        }
    }
    forward_propagate(inputs) {
        let output = inputs.copy();
        this.process = [output.copy()];
        //set first output as input
        for (let i = 0; i < this.length; i++) {
            //multiply by weights
            output.dot(this.weights[i]);
            //add biases
            output.add(this.biases[i]);
            //activation function
            output.map(this.activation_function.function);
            //add to the current process
            this.process.push(output.copy());
        }
        return output;
    }
    backward_propagate(error) {
        //loop backwards through rows
        for (let j = this.length - 1; j >= 0; j--) {
            //calculate the gradients
            let gradient = Matrix.map(
                this.process[j + 1],
                this.activation_function.derivative
            );
            //console.log(error)
            gradient.multiply(error);
            //change the error
            error.dot(Matrix.transpose(this.weights[j]));
            //add the deltas
            this.bias_deltas[j].add(gradient);
            this.weight_deltas[j].add(
                Matrix.dot(Matrix.transpose(this.process[j]),gradient)
            )
        }
        return error

    }
    update(){
        for (let i = 0; i < this.length; i++) {
            //add deltas to weights and biases
            this.weights[i].add(Matrix.clip(Matrix.multiply(this.weight_deltas[i],this.learning_rate),10))
            this.biases[i].add(Matrix.clip(Matrix.multiply(this.bias_deltas[i],this.learning_rate),10));
            //reset deltas
            this.weight_deltas[i].reset()
            this.bias_deltas[i].reset()
        }
    }
    train(training_set, batches = 1, batch_size = training_set.length){
        //start at random position
        let r = Math.floor(Math.random() * training_set.length);
        for (let i = r; i < batches * batch_size + r; i++){
            for (let j = 0; j < batch_size; j++) {
                //calculate error
                let error = Matrix.subtract(training_set[(i+j)%batch_size][1], this.forward_propagate(training_set[(i+j)%batch_size][0]));
                //loop backwards through rows
                this.backward_propagate(error)
            }
            //update
            this.update()
        }
    }
    static from_string(dict) {
        //create new network
        let network = new Fully_Connected_Network(
            dict.weights[0].rows,
            dict.length - 2,
            dict.weights[0].cols,
            dict.weights[dict.weights.length - 1].cols,
            dict.activation_function_name,
            dict.learning_rate
        );
        //set variables
        for (let i = 0; i < network.length; i++) {
            network.weights[i] = Matrix.fromArray(dict.weights[i].data)
            network.biases[i] = Matrix.fromArray(dict.biases[i].data)
        }
        return network;
    }
}
module.exports = Fully_Connected_Network