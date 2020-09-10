const Noughts_and_Crosses = require("./Noughts_and_Crosses.js");
const Matrix = require("./Matrix.js");
const fs = require("fs");
class Player {
    constructor(umpire, max_depth = Infinity) {
        this.umpire = umpire;
        this.max_depth = max_depth;
    }
    move(board, aim) {
        let best = this.check(Matrix.multiply(board,aim), 1, 1);
        best = shuffle(Object.keys(best)).reduce((max, move) => (best[max] > best[move] ? max : move), 0);
        let move = Matrix.blank(board.rows, board.cols);
        move.data[best % board.rows][Math.floor(best / board.rows)] = aim;
        return move;
    }
    check(board, player, depth) {
        let state;
        if ((state = this.umpire.check_state(board)) != 0) {
            return state;
        } 
        if (depth > this.max_depth) {
            return this.evaluate(board);
        }
        if (board.rss() == board.rows * board.cols) {
            return 0;
        }
        if (player == 1) {
            let moves = {};
            for (let i = 0; i < board.rows * board.cols; i++) {
                let move = board.copy();
                if (move.data[i % board.rows][Math.floor(i / board.rows)] == 0) {
                    move.data[i % board.rows][Math.floor(i / board.rows)] = 1;
                    moves[i] = move;
                }
            }
            this.mirror(moves);
            let choice = {};
            let best = -1;
            for (let i in moves) {
                choice[i] = this.check(moves[i], -1, depth + 1);
                best = Math.max(best, choice[i]);

                if (best == 1) {
                    break;
                }
            }
            return depth == 1 ? choice : best;
        } else {
            let moves = {};
            for (let i = 0; i < board.rows * board.cols; i++) {
                let move = board.copy();
                if (move.data[i % board.rows][Math.floor(i / board.rows)] == 0) {
                    move.data[i % board.rows][Math.floor(i / board.rows)] = -1;
                    moves[i] = move;
                }
            }
            this.mirror(moves);
            let choice = {};
            let best = 1;
            for (let i in moves) {
                choice[i] = this.check(moves[i], 1, depth + 1);
                best = Math.min(best, choice[i]);
                if (best == -1) {
                    break;
                }
            }
            return depth == 1 ? choice : best;
        }
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
    evaluate() {
        return Math.random();
    }
}
function shuffle(array) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}
module.exports = Player;
