const Matrix = require("./Matrix.js");
const activation_functions = require("./Activation_Functions.js").activation_functions;
const fs = require("fs")
class Neural_Network {
    constructor(type, activation_function="identity", learning_rate = 1) {
        //add activation function
        this.type = type
        this.activation_function_name = activation_function;
        this.activation_function = activation_functions[activation_function];
        //add learning rate
        this.learning_rate = learning_rate;
    }
    show() {
        //default value
        console.log(this)
    }
    forward_propagate(inputs) {}
    backward_propagate(error) {}
    update() {}
    
    cost(test_data, n=test_data.length) {
        //start with no cost
        let loss = 0;
        let r = Math.floor(Math.random() * test_data.length);
        for (let i = r; i < n + r; i++) {
            //find errors squared
            loss += Matrix.subtract(test_data[i%test_data.length][1], this.forward_propagate(test_data[i%test_data.length][0])).rss();
        }
        this.loss = loss/n
        //return average
        return loss / n;
    }
    cross_entropy(test_data, n=test_data.length) {
        //start with no loss
        let loss = 0;
        let r = Math.floor(Math.random() * test_data.length);
        for (let i = r; i < n + r; i++) {
            //find errors squared
            loss -= Math.log(Matrix.multiply(test_data[i%test_data.length][1], this.adjust(this.forward_propagate(test_data[i%test_data.length][0]))).sum())
        }
        this.loss = loss/n
        //return loss
        return loss/n;
    }
    adjust(output = this.process[this.process.length-1]){
        output.map(Math.exp);
        return Matrix.multiply(output,1/output.sum())
    }
    accuracy(test_data, n=test_data.length) {
        //start with no cost
        let value = 0;
        let r = Math.floor(Math.random() * test_data.length);
        for (let i = r; i < n + r; i++) {
            //find accuracy
            value += Matrix.subtract(test_data[i%test_data.length][1].max_plot(),this.forward_propagate(test_data[i%test_data.length][0]).max_plot()).rss() == 0;
        }
        this.value  = value/n
        //return average
        return value / n * 100;
    }
    copy() {
        //create network from string of self
        return eval(this.type).from_string(eval("(" + JSON.stringify(this) + ")"));
    }
    static prepareInput(input) {
        //convert 1D array to matrix
        return Matrix.fromArray([input])
    }
    static prepareTraining(training_set) {
        //convert training data to matrix pairs
        return training_set.map(x => [Matrix.fromArray([x[0]]), Matrix.fromArray([x[1]])])
    }
    static prepareTrainingImagesBW(training_set) {
        //convert training data to matrix pairs
        return training_set.map(x => [
            [Matrix.multiply(Matrix.fromArray(x[0]),1/255)], Matrix.fromArray([x[1]])
        ])
    }
    static prepareDatasets(training_set, len=1) {
        //convert training data to matrix pairs
        return training_set.map(function (x){
            let result = new Array(len).fill(0);
            result[x[1][0]-1] = 1;
            return [[Matrix.multiply(Matrix.fromArray(x[0]),1/255)], Matrix.fromArray([result])]
        })
    }
    static load(type,name=type){
        return eval(type).from_string(eval("(" + fs.readFileSync(name+".json").toString() + ")"))
    }
    export(){
        let copy = this.copy()
        delete copy.process
        delete copy.activation_function
        return JSON.stringify(copy)
    }
    save(name = this.type){
        fs.writeFileSync(name+".json",this.export())
    }
}
module.exports = Neural_Network
