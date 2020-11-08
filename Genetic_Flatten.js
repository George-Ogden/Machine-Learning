const Matrix = require("./Matrix");
const Genetic_Neural_Network = require("./GNN");
const fs = require("fs");
class Genetic_Flatten extends Genetic_Neural_Network {
    constructor() {
        super("Genetic_Flatten", "identity")
    }
    forward_propagate(matrix) {
        //create output
        let output = new Matrix(1, matrix.rows, matrix.cols)
        //loop through layers
        for (let x = 0; x < matrix.cols; x++) {
            for (let y = 0; y < matrix.rows; y++) {
                //insert into flat matrix
                output.data[0][ x * matrix.rows + y] = matrix.data[y][x]
            }
        }
        return output
    }
    static crossover(){
        return new Genetic_Flatten()
    }
    static mutate(){
        return new Genetic_Flatten()
    }
    static from_string(){
        return new Genetic_Flatten()
    }
    copy(){
        return new Genetic_Flatten()
    }
    replicate() {
        //copy
        return new Genetic_Flatten()
    }

}
module.exports = Genetic_Flatten