const fs = require("fs");
const Matrix = require("./Matrix");
const Neural_Network = require("./ANN");
const activation_functions = require("./Activation_Functions").activation_functions;
class Long_Short_Term_Memory extends Neural_Network {
    constructor(size, learning_rate = 0.1) {
        //superclass constructor
        super("Long_Short_Term_Memory", "identity", learning_rate);
        //create weights
        this.W = {
            i: Matrix.multiply(new Matrix(size, size), 1/size),
            f: Matrix.multiply(new Matrix(size, size), 1/size),
            o: Matrix.multiply(new Matrix(size, size), 1/size),
            c: Matrix.multiply(new Matrix(size, size), 1/size),
        };
        this.U = {
            i: Matrix.multiply(new Matrix(size, size), 1/size),
            f: Matrix.multiply(new Matrix(size, size), 1/size),
            o: Matrix.multiply(new Matrix(size, size), 1/size),
            c: Matrix.multiply(new Matrix(size, size), 1/size),
        };
        //create hidden
        this.hidden = Matrix.blank(1, size);
        //initialise biases
        this.biases = {
            i: Matrix.multiply(new Matrix(1, size), Math.sqrt(1 / size)),
            f: Matrix.multiply(new Matrix(1, size), Math.sqrt(1 / size)),
            o: Matrix.multiply(new Matrix(1, size), Math.sqrt(1 / size)),
            c: Matrix.multiply(new Matrix(1, size), Math.sqrt(1 / size)),
        };
        //initialise deltas
        this.W_deltas = {
            i: Matrix.blank(size, size),
            f: Matrix.blank(size, size),
            o: Matrix.blank(size, size),
            c: Matrix.blank(size, size),
        };
        this.U_deltas = {
            i: Matrix.blank(size, size),
            f: Matrix.blank(size, size),
            o: Matrix.blank(size, size),
            c: Matrix.blank(size, size),
        };
        this.bias_deltas = {
            i: Matrix.blank(1, size),
            f: Matrix.blank(1, size),
            o: Matrix.blank(1, size),
            c: Matrix.blank(1, size),
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
    static types = ["o", "i", "f"];
    step(input) {
        //update process
        this.process.input.push(input);
        //calculate hidden state
        for (let i of Long_Short_Term_Memory.types) {
            this.process[i].push(Matrix.map(Matrix.add(Matrix.add(Matrix.dot(input, this.U[i]), Matrix.dot(this.hidden, this.W[i])), this.biases[i]), activation_functions.sigmoid.function));
        }
        let len = this.process.i.length - 1;
        let c = Matrix.map(Matrix.add(Matrix.add(Matrix.dot(input, this.U.c), Matrix.dot(this.hidden, this.W.c)), this.biases.c), activation_functions.tanh.function);
        this.process.c.push(c)
        this.hidden = Matrix.map(Matrix.add(Matrix.multiply(this.process.f[len], this.hidden), Matrix.multiply(this.process.i[len], c)), activation_functions.sigmoid.function);
        this.process.hidden.push(this.hidden.copy())
        let output = Matrix.multiply(Matrix.map(this.hidden, activation_functions.sigmoid.function), this.process.o[len]);
        this.process.output.push(output)
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
            c: [],
            i: [],
            f: [],
            o: [],
            output: [],
        };
        let outputs = [];
        for (let input of inputs) {
            outputs.push(this.step(input));
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
                loss -= Math.log(Matrix.multiply(test_data[i % test_data.length][j + 1].max_plot(), this.adjust(this.step(test_data[i % test_data.length][j]))).sum());
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
                value += Matrix.subtract(test_data[i % test_data.length][j + 1].max_plot(), this.step(test_data[i % test_data.length][j]).max_plot()).rss() == 0;
            }
        }
        this.value = value / n;
        //return average
        return (value / n) * 100;
    }
    backward_propagate(sequence) {
        let gradient = { hidden: Matrix.blank(1, this.hidden.cols),U:{},W:{},biases:{} };
        //loop backwards through rows
        for (let j = sequence.length - 2; j >= 0; j--) {
            //calculate the output gradient
            gradient.output = Matrix.subtract(sequence[j + 1], this.process.output[j+1].copy());
            //add output deltas
            gradient.hidden.add(Matrix.multiply(Matrix.map(Matrix.map(this.process.hidden[j+2],activation_functions.tanh.function),activation_functions.tanh.derivative),gradient.output))
            gradient.o = Matrix.multiply(Matrix.multiply(Matrix.map(this.process.hidden[j+2],activation_functions.tanh.function),this.process.o[j+1]),gradient.output)
            gradient.f = Matrix.multiply(Matrix.multiply(Matrix.map(this.process.hidden[j+2],activation_functions.sigmoid.derivative),this.process.hidden[j+1]),gradient.hidden)
            gradient.c = Matrix.multiply(Matrix.multiply(Matrix.map(this.process.hidden[j+2],activation_functions.sigmoid.derivative),this.process.i[j+1]),gradient.hidden)
            gradient.i = Matrix.multiply(Matrix.multiply(Matrix.map(this.process.hidden[j+2],activation_functions.sigmoid.derivative),this.process.c[j+1]),gradient.hidden)
            gradient.c = Matrix.multiply(Matrix.map(this.process.c[j+1],activation_functions.tanh.derivative),gradient.hidden)
            this.bias_deltas.c.add(gradient.c)
            this.U_deltas.c.add(Matrix.dot(Matrix.transpose(this.process.input[j+1]),gradient.c))
            this.W_deltas.c.add(Matrix.dot(Matrix.transpose(this.process.hidden[j+1]),gradient.c))
            gradient.output = Matrix.dot(Matrix.multiply(Matrix.map(this.process.c[j+1],activation_functions.tanh.derivative),gradient.hidden),Matrix.transpose(this.W.c))
            gradient.hidden = Matrix.multiply(Matrix.multiply(Matrix.map(this.process.hidden[j+2],activation_functions.sigmoid.derivative),this.process.f[j+1]),gradient.hidden)
            for (let i of Long_Short_Term_Memory.types) {
                gradient[i] = Matrix.multiply(Matrix.map(this.process[i][j+1],activation_functions.sigmoid.derivative),gradient[i])
                this.U_deltas[i] = Matrix.dot(Matrix.transpose(this.process.input[j+1]),gradient[i])
                this.W_deltas[i] = Matrix.dot(Matrix.transpose(this.process.hidden[j+1]),gradient[i])
                gradient.output.add(Matrix.dot(gradient[i],Matrix.transpose(this.W[i])))
                this.bias_deltas[i].add(gradient[i])
            }
        }
        return gradient.output;
    }
    update() {
        for (let i of Object.keys(this.U)) {
            //add deltas to weights and biases
            this.U[i].add(Matrix.clip(Matrix.multiply(this.U_deltas[i], this.learning_rate), 0.25, this.U[i]));
            this.W[i].add(Matrix.clip(Matrix.multiply(this.W_deltas[i], this.learning_rate), 0.25, this.W[i]));
            this.biases[i].add(Matrix.clip(Matrix.multiply(this.bias_deltas[i], this.learning_rate), 0.25, this.biases[i]));
            //reset deltas
            this.U_deltas[i].reset();
            this.W_deltas[i].reset();
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
        let copy = eval("(" + JSON.stringify(this) + ")");
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
        let network = new Long_Short_Term_Memory(dict.U.i.rows, dict.W.i.rows, dict.W.c.cols, dict.W.i.cols, dict.W.f.cols, dict.W.o.cols, dict.learning_rate);
        //set variables
        for (let i of Object.keys(network.U)) {
            network.U[i] = Matrix.fromArray(dict.U[i].data);
            network.V[i] = Matrix.fromArray(dict.V[i].data);
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
let L = new Long_Short_Term_Memory(2, 3);
L.train([[Matrix.fromArray([[0.5,0.5]]), Matrix.fromArray([[0.5,0.5]])],[Matrix.fromArray([[0.5,0.5]])],[Matrix.fromArray([[0.5,0.5]]), Matrix.fromArray([[0.5,0.5]])],[Matrix.fromArray([[0.5,0.5]])]],10)
console.log(L.forward_propagate([Matrix.fromArray([[0.5,0.5]]), Matrix.fromArray([[0.5,0.5]])]))
module.exports = Long_Short_Term_Memory;
