const Matrix = require("./Matrix.js");
const Neural_Network = require("./ANN.js");
class Dropout extends Neural_Network {
    constructor(rate) {
        super("Dropout", "identity", 1)
        this.rate = rate
    }
    forward_propagate(matrix) {
        //define process
        this.process = new Matrix(matrix.rows, matrix.cols)
        this.process.map(x => Math.random() < this.rate ? 0 : 1/(1-this.rate))
        //loop through layers
        return Matrix.multiply(this.process,matrix)
    }
    backward_propagate(error) {
        //loop through colours
        return Matrix.multiply(error,this.process)
    }
    static from_string(dict) {
        //create new network
        return new Dropout(dict.rate)
    }
    export(){
        let copy = this.copy()
        delete copy.process
        delete copy.activation_function
        delete copy.activation_function_name
        return JSON.stringify(copy)
    }
}
module.exports = Dropout