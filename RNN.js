const fs = require("fs");
const Matrix = require("./Matrix.js");
const Neural_Network = require("./ANN .js");
const activation_functions = require("./Activation_Functions.js").activation_functions;
const dinosarus = require("./dinosaurs.js").dinosaurs;
const alphabet = require("./dinosaurs.js").alphabet;
const betalpha = require("./dinosaurs.js").betalpha;
class Recurrent_Neural_Network extends Neural_Network {
    constructor(input, memory, activation_function = "tanh", learning_rate = 0.1) {
        //superclass constructor
        super("Recurrent_Neural_Network", activation_function, learning_rate);
        //create weights
        this.weights = {
            input: Matrix.multiply(new Matrix(input, memory), Math.sqrt(1 / memory)),
            hidden: Matrix.multiply(new Matrix(memory, memory),  1 / memory),
            output: Matrix.multiply(new Matrix(memory, input), Math.sqrt(1 / memory)),
        };
        //create biases
        this.biases = {
            input: new Matrix(1, 1),
            hidden: Matrix.multiply(new Matrix(1, memory),  1 / memory),
            output: Matrix.multiply(new Matrix(1, input), Math.sqrt(1 / memory)),
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
        this.hidden.add(this.biases.hidden);
        this.hidden.add(Matrix.dot(input, this.weights.input));
        this.hidden.map(this.activation_function.function);
        //update process
        this.process.hidden.push(this.hidden);
        //calculate output
        let output = Matrix.dot(this.hidden, this.weights.output);
        output.add(this.biases.output);
        output.map(this.activation_function.function);
        //output = this.activate(output);
        //update process
        this.process.output.push(output);
        return output;
    }
    activate(output = this.process.output[this.process.output.length - 1]) {
        output.map(Math.exp);
        output.multiply(1 / output.sum());
        return output;
    }
    forward_propagate(inputs) {
        //create process
        this.process = {
            input: [],
            hidden: [Matrix.blank(1, this.hidden.cols)],
            output: [],
        };
        let outputs = [];
        for (let input of inputs) {
            outputs.push(this.step(input))
        }
        return outputs[outputs.length - 1];
    }
    cross_entropy(test_data, n = test_data.length) {
        let loss = 0;
        //create process
        let r = Math.floor(Math.random() * test_data.length);
        for (let i = r; i < n + r; i++) {
            this.process = {
                input: [],
                hidden: [Matrix.blank(1, this.hidden.cols)],
                output: [],
            };
            for (let j = 0; j < test_data[i % test_data.length].length - 1; j++) {
                //find errors
                loss -= Math.log(Matrix.multiply(test_data[i%test_data.length][j+1].max_plot(),this.adjust(this.step(test_data[i%test_data.length][j]))).sum())
            }
        }
        this.loss = loss / n;
        //return loss
        return loss / n;
    }
    cost(test_data, n = test_data.length) {
        let loss = 0;
        //create process
        let r = Math.floor(Math.random() * test_data.length);
        for (let i = r; i < n + r; i++) {
            this.process = {
                input: [],
                hidden: [Matrix.blank(1, this.hidden.cols)],
                output: [],
            };
            for (let j = 0; j < test_data[i % test_data.length].length - 1; j++) {
                //find errors
                loss += Matrix.subtract(test_data[i % test_data.length][j + 1], this.step(test_data[i % test_data.length][j])).rss();
            }
        }
        this.loss = loss / n;
        //return loss
        return loss / n;
    }
    accuracy(test_data, n = test_data.length) {
        let value = 0;
        //create process
        let r = Math.floor(Math.random() * test_data.length);
        for (let i = r; i < n + r; i++) {
            this.process = {
                input: [],
                hidden: [Matrix.blank(1, this.hidden.cols)],
                output: [],
            };
            for (let j = 0; j < test_data[i % test_data.length].length - 1; j++) {
                //find errors
                value += Matrix.subtract(test_data[i%test_data.length][j + 1].max_plot(),this.step(test_data[i%test_data.length][j]).max_plot()).rss() == 0;
            }
        }
        this.value  = value/n
        //return average
        return value / n * 100;
    }
    backward_propagate(sequence) {
        let gradient = { hidden: Matrix.blank(1, this.hidden.cols) };
        //loop backwards through rows
        for (let j = sequence.length - 2; j >= 0; j--) {
            //calculate the output gradient
            gradient.output = Matrix.subtract(sequence[j + 1], this.process.output[j].copy());
            //add output deltas
            this.weight_deltas.output.add(Matrix.dot(Matrix.transpose(this.process.hidden[j + 1]), gradient.output));
            this.bias_deltas.output.add(gradient.output);
            //calculate hidden gradient
            gradient.hidden.add(Matrix.dot(gradient.output, Matrix.transpose(this.weights.output)));
            gradient.hidden.multiply(Matrix.map(this.process.hidden[j + 1], this.activation_function.derivative));
            //add hidden deltas
            this.bias_deltas.hidden.add(gradient.hidden);
            this.weight_deltas.hidden.add(Matrix.dot(Matrix.transpose(this.process.hidden[j]), gradient.hidden));
            //add input deltas
            this.weight_deltas.input.add(Matrix.dot(Matrix.transpose(this.process.input[j]), gradient.hidden));
            //modify gradient
            gradient.hidden.dot(Matrix.transpose(this.weights.hidden))
            //gradient.hidden.dot(this.weights.hidden);
        }
        return gradient.output;
    }
    update() {
        for (let i of Object.keys(this.weights)) {
            //add deltas to weights and biases
            //console.log(this.weight_deltas[i].rss(),i)
            //console.log(this.bias_deltas[i].rss(),i)
            this.weights[i].add(Matrix.clip(Matrix.multiply(this.weight_deltas[i], this.learning_rate), 0.25,this.weights[i]));
            this.biases[i].add(Matrix.clip(Matrix.multiply(this.bias_deltas[i], this.learning_rate), 0.25,this.biases[i]));
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
                this.forward_propagate(training_set[(i + j) % training_set.length]);
                this.backward_propagate(training_set[(i + j) % training_set.length]);
            }
            //update
            this.update();
        }
    }
    export() {
        //copy
        let copy = eval("("+JSON.stringify(this)+")")
        //remove attributes
        delete copy.process;
        delete copy.bias_deltas;
        delete copy.weight_deltas;
        delete copy.activation_function;
        delete copy.hidden;
        //convert to JSON
        return JSON.stringify(copy);
    }
    static from_string(dict) {
        //create new network
        let network = new Recurrent_Neural_Network(dict.weights.input.rows, dict.weights.input.cols, dict.activation_function_name, dict.learning_rate);
        //set variables
        for (let i of Object.keys(network.weights)) {
            network.weights[i] = Matrix.fromArray(dict.weights[i].data);
            network.biases[i] = Matrix.fromArray(dict.biases[i].data);
        }
        return network;
    }
    static load(type, name = type) {
        return eval(type).from_string(eval("(" + fs.readFileSync(name + ".json").toString() + ")"));
    }
    save(name = this.type) {
        fs.writeFileSync(name + ".json", this.export());
    }
    static positive = 1;
    static negative = 0;
    static prepareWords(words) {
        const terminator = Matrix.blank(1, 27, Recurrent_Neural_Network.negative);
        terminator.data[0][26] = Recurrent_Neural_Network.positive;
        return words.map((word) =>
            [...word]
                .map(function (letter) {
                    let matrix = Matrix.blank(1, 27, Recurrent_Neural_Network.negative);
                    matrix.data[0][alphabet[letter]] = Recurrent_Neural_Network.positive;
                    return matrix;
                })
                .concat(terminator)
        );
    }
    static decodeWord(data) {
        return data.map((x) => betalpha[x.find(x.max())[1]]).join("");
    }
    static bound(data) {
        let matrix = Matrix.blank(1, 27, Recurrent_Neural_Network.negative);
        matrix.data[0][data.find(data.max())[1]] = Recurrent_Neural_Network.positive;
        return matrix;
    }
    generate(letters, limit = 100) {
        let i = 0;
        let output = [this.forward_propagate(Recurrent_Neural_Network.prepareWords([letters])[0])];
        while (i++ < limit && output[output.length - 1].find(output[output.length - 1].max())[1] != 26) {
            output.push(Recurrent_Neural_Network.bound(this.forward_propagate([output[output.length - 1]])));
        }
        return letters + Recurrent_Neural_Network.decodeWord(output);
    }
}
const data = Recurrent_Neural_Network.prepareWords(dinosarus.filter(x => x.length > 0));

let RNNs = eval("(" + fs.readFileSync("results.json").toString() + ")")
/*
for (let i = 0; i < RNNs.length; i++){
    let RNN = Recurrent_Neural_Network.from_string(RNNs[i])
    console.log(RNN.hidden.cols)
    for (let letter in alphabet){
        console.log(RNN.generate(letter,30))
    }
    console.log("\n".repeat(5))
}*/
/*
for (let i = 10; i < 50; i++){
    RNNs.push(new Recurrent_Neural_Network(27,i))
}*/
for (let i = 0; i < RNNs.length; i++){
    RNNs[i] = Recurrent_Neural_Network.from_string(RNNs[i])
}
while (true){
    fs.writeFileSync("results.json",JSON.stringify(RNNs.map(function(r){
        c = r.copy()
        delete c.process
        delete c.weight_deltas
        delete c.bias_deltas
        delete c.hidden
        delete c.activation_function
        return c
    })))
    for (var rnn of RNNs){
        rnn.train(data,5,64)
        console.log(rnn.generate(betalpha[Math.floor(Math.random()*26)]))
    }
}   

string = ""
for (let i = 0; i < RNNs.length; i++){
    let RNN = Recurrent_Neural_Network.from_string(RNNs[i])
    string += RNN.hidden.cols + "\n"
    for (let letter in alphabet){
        string +=  RNN.generate(letter,30) + "\n"
    }
    string += "\n".repeat(5)
}
console.log(string)
fs.writeFileSync("results.txt",string)
module.exports = Recurrent_Neural_Network;
