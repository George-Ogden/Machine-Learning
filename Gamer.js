const Player = require("./Player.js");
const Matrix = require("./Matrix.js");
const Genetic_Fully_Connected_Neural_Network = require("./GFCNN.js");
const connect4_mirroring = function(boards) {
    for (let i in boards) {
        for (let y = 0; boards[i] && y < boards[i].rows-1; y++) {
            for (let x = 0;boards[i] && x < boards[i].cols; x++) {
                //apply a function based on the matrix's data
                if (boards[i].data[y][x] != 0 && boards[i].data[y+1][x] == 0){
                    delete boards[i]
                } 
            }
        }
        
        for (let j in boards) {
            if (
                boards[i] != undefined &&
                boards[j] != undefined &&
                boards[i].equals(Matrix.flip(boards[j], 1,0))
            ) {
                delete boards[Math.random() > 0.5 ? i : j];
            }
        }
    }
}
class Gamer extends Player {
    constructor(network, umpire, max_depth = Infinity) {
        super(umpire,max_depth)
        this.network = network
        this.mirror = connect4_mirroring
    }/*
    mirror(boards) {
        for (let i in boards) {
            for (let j in boards) {
                if (
                    boards[i] != undefined &&
                    boards[j] != undefined &&
                    i != j &&
                    (boards[i].equals(Matrix.flip(boards[j], 1, 0)) ||
                        boards[i].equals(Matrix.flip(boards[j], 0)) ||
                        boards[i].equals(Matrix.flip(boards[j])) ||
                        Matrix.transpose(boards[i]).equals(boards[j]) ||
                        Matrix.transpose(boards[i]).equals(Matrix.flip(boards[j], 1, 0)) ||
                        Matrix.transpose(boards[i]).equals(Matrix.flip(boards[j], 0)) ||
                        Matrix.transpose(boards[i]).equals(Matrix.flip(boards[j])))
                ) {
                    delete boards[Math.random() > 0.5 ? i : j];
                }
            }
        }
    }*/
    evaluate(board) {
        return this.network.forward_propagate(board).data[0][0]
    }
}
module.exports = Gamer;
