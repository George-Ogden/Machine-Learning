const fs = require("fs")
const Matrix = require("./Matrix.js");
const Neural_Network = require("./ANN.js");
const Activation_Function = require("./Activation_Functions.js");
class Recurrent_Neural_Network extends Neural_Network {
    constructor(input, memory, activation_function = "sigmoid", learning_rate = 0.1) {
        //superclass constructor
        super("Recurrent_Neural_Network", activation_function, learning_rate);
        //create weights
        this.weights = {
            input: new Matrix(input, memory),
            hidden: new Matrix(memory, memory),
            output: new Matrix(memory, input),
        };
        //create biases
        this.biases = {
            input: new Matrix(1, 1),
            hidden: new Matrix(1, memory),
            output: new Matrix(1, input),
        };
        //create hidden
        this.hidden = Matrix.blank(1, memory);
        //initialise on deltas
        this.weight_deltas = {
            input: Matrix.blank(input, memory),
            hidden: Matrix.blank(memory, memory),
            output: Matrix.blank(memory, input),
        };
        this.bias_deltas = {
            input: new Matrix(1, 1),
            hidden: new Matrix(1, memory),
            output: new Matrix(1, input),
        };
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
    step(input) {
        //update process
        this.process.input.push(input);
        //calculate hidden state
        this.hidden.dot(this.weights.hidden);
        this.hidden.add(Matrix.dot(input, this.weights.input));
        this.hidden.add(this.biases.hidden);
        this.hidden.map(this.activation_function.function);
        //update process
        this.process.hidden.push(this.hidden);
        //calculate output
        let output = Matrix.dot(this.hidden, this.weights.output);
        output.add(this.biases.output);
        output.map(this.activation_function.function)
        output = this.activate(output)
        //update process
        this.process.output.push(output);
        return output;
    }
    activate(output = this.process.output[this.process.output.length-1]){
        output.map(Math.exp);
        output.multiply(1 / output.sum());
        return output
    }
    forward_propagate(inputs){
        //create process
        this.process = {
            input: [],
            hidden: [Matrix.blank(1, this.hidden.cols)],
            output: [],
        };
        let outputs = []
        for (let input of inputs){
            outputs.push(this.step(input))
        }
        return outputs[outputs.length-1]
    }
    backward_propagate(sequence) {
        let gradient = {hidden:Matrix.blank(1, this.hidden.cols)}
        //loop backwards through rows
        for (let j = sequence.length-2; j >= 0; j--) {
            //calculate the output gradient
            gradient.output = Matrix.subtract(sequence[j+1],this.process.output[j].copy());
            //console.log(Matrix.transpose(this.process.hidden[j + 1]), gradient.output)
            //calculate output deltas
            this.weight_deltas.output.add(Matrix.dot(Matrix.transpose(this.process.hidden[j + 1]), gradient.output));
            this.bias_deltas.output.add(gradient.output);
            //calculate hidden gradient
            gradient.hidden.add(Matrix.dot(gradient.output,Matrix.transpose(this.weights.output)))
            gradient.hidden.multiply(Matrix.map(this.process.hidden[j+1],this.activation_function.derivative))
            //calculate hidden and input deltas
            this.bias_deltas.hidden.add(gradient.hidden)
            this.weight_deltas.input.add(Matrix.dot(Matrix.transpose(this.process.input[j]),gradient.hidden))
            this.weight_deltas.hidden.add(Matrix.dot(Matrix.transpose(this.process.hidden[j]),gradient.hidden))
            //modify gradient
            gradient.hidden.dot(Matrix.transpose(this.weights.hidden))
        }
        return gradient.output
    }
    update() {
        for (let i of Object.keys(this.weights)) {
            //add deltas to weights and biases
            this.weights[i].add(Matrix.clip(Matrix.multiply(this.weight_deltas[i], this.learning_rate), 10));
            this.biases[i].add(Matrix.clip(Matrix.multiply(this.bias_deltas[i], this.learning_rate), 10));
            //reset deltas
            this.weight_deltas[i].reset();
            this.bias_deltas[i].reset();
        }
    }
    train(training_set, batches = 1, batch_size = training_set.length) {
        //start at random position
        let r = Math.floor(Math.random() * training_set.length);
        for (let i = r; i < batches * batch_size + r; i++) {
            for (let j = 0; j < batch_size; j++) {
                //calculate error
                this.backward_propagate([...training_set[(i+j)%training_set.length],this.forward_propagate(training_set[(i+j)%training_set.length])]);
            }
            //update
            this.update();
        }
    }
    export() {
        //copy
        let copy = this.copy();
        //remove attributes
        delete copy.process;
        delete copy.bias_deltas;
        delete copy.weight_deltas;
        delete copy.activation_function;
        //convert to JSON
        return JSON.stringify(copy);
    }
    static from_string(dict) {
        //create new network
        let network = new Recurrent_Neural_Network(
            dict.weights.input.rows,
            dict.weights.input.cols,
            dict.activation_function_name,
            dict.learning_rate
        );
        //set variables
        for (let i of Object.keys(network.weights)) {
            network.weights[i] = Matrix.fromArray(dict.weights[i].data);
            network.biases[i] = Matrix.fromArray(dict.biases[i].data);
        }
        return network;
    }
    static load(type,name=type){
        return eval(type).from_string(eval("(" + fs.readFileSync(name+".json").toString() + ")"))
    }
}
