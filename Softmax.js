const Matrix = require("./Matrix.js");
const Neural_Network = require("./ANN.js")
const Fully_Connected_Network = require("./FCNN.js")
const Activation_Function = require("./Activation_Functions.js")
class Softmax extends Fully_Connected_Network {
    constructor(inputs,outputs,activation_function="sigmoid",learning_rate = 0.1) {
        //superclass constructor
        super(inputs,0,1,outputs,activation_function,learning_rate)
        //change type
        this.type = "Softmax"
    }
    forward_propagate(input) {
        return super.forward_propagate(input)
    }
    adjust(output = this.process[this.process.length-1]){
        output.map(Math.exp);
        return Matrix.multiply(output,1/output.sum())
    }
    backward_propagate(error) {
        //loop backwards through rows
        for (let j = this.length - 1; j >= 0; j--) {
            //calculate the gradients
            let gradient = Matrix.map(
                this.process[j + 1],
                this.activation_function.derivative
            );
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
            this.weights[i].add(Matrix.multiply(this.weight_deltas[i],this.learning_rate),0.25,this.weights[i])
            this.biases[i].add(Matrix.multiply(this.bias_deltas[i],this.learning_rate),0.25,this.biases[i]);
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
                let error = Matrix.subtract(training_set[(i+j)%training_set.length][1], this.forward_propagate(training_set[(i+j)%training_set.length][0]));
                //loop backwards through rows
                this.backward_propagate(error)
            }
            //update
            this.update()
        }
    }
    export(){
        //copy
        let copy = this.copy()
        //remove attributes
        delete copy.process
        delete copy.bias_deltas
        delete copy.weight_deltas
        delete copy.activation_function
        //convert to JSON
        return JSON.stringify(copy)
    }
}/*
let data = [[Matrix.fromArray([[0,1,0]]),new Matrix(1,3)]]
let network = new Softmax(3,3)
for (let i = 0; i < 10; i++){
    network.train(data)
    console.log(network.cross_entropy(data),network.cost(data))
}*/
module.exports = Softmax