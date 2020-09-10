const Player = require("./Player.js");
const Matrix = require("./Matrix.js");
const Genetic_Fully_Connected_Neural_Network = require("./GFCNN.js");
class Gamer extends Player {
    constructor(network, umpire, max_depth = Infinity) {
        super(umpire,max_depth)
        this.network = network
    }
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
    }
    evaluate(board) {
        return this.network.forward_propagate(board).data[0][0]
    }
}
module.exports = Gamer;
