const Umpire = require("./Umpire.js");
const Matrix = require("./Matrix.js");
class Noughts_and_Crosses extends Umpire {
    constructor(size = 3, win = 3) {
        //create umpire
        super(size);
        //number required to win
        this.win = win;
    }
    check_state(board = this.board) {
        //check horizontally
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size - this.win + 1; j++) {
                //ignore empty starting squares
                if (board.data[i][j] == 0) {
                    continue;
                }
                //advantage goes to person with square
                let advantage = board.data[i][j];
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (board.data[i][j + k] != advantage) {
                        advantage = 0;
                        break;
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //return winner
                    return advantage;
                }
            }
        }
        //check vertically
        for (let i = 0; i < this.size - this.win + 1; i++) {
            for (let j = 0; j < this.size; j++) {
                //ignore empty starting squares
                if (board.data[i][j] == 0) {
                    continue;
                }
                //advantage goes to person with square
                let advantage = board.data[i][j];
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (board.data[i + k][j] != advantage) {
                        advantage = 0;
                        break;
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //return winner
                    return advantage;
                }
            }
        }
        //check diagonally (\)
        for (let i = 0; i < this.size - this.win + 1; i++) {
            for (let j = 0; j < this.size - this.win + 1; j++) {
                //ignore empty starting squares
                if (board.data[i][j] == 0) {
                    continue;
                }
                //advantage goes to person with square
                let advantage = board.data[i][j];
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (board.data[i + k][j + k] != advantage) {
                        advantage = 0;
                        break;
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //return winner
                    return advantage;
                }
            }
        }
        //check diagonally (/)
        for (let i = this.win - 1; i < this.size; i++) {
            for (let j = 0; j < this.size - this.win + 1; j++) {
                //ignore empty starting squares
                if (board.data[i][j] == 0) {
                    continue;
                }
                //advantage goes to person with square
                let advantage = board.data[i][j];
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (board.data[i - k][j + k] != advantage) {
                        advantage = 0;
                        break;
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //return winner
                    return advantage;
                }
            }
        }
        //if no one is winning, return 0
        return 0;
    }
}
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
// let umpire = new Noughts_and_Crosses(7, 4);
// let player1 = new Player(umpire,5);
// let player2 = new Player(umpire,5 );
// player1.mirror = connect4_mirroring
// player2.mirror = connect4_mirroring
// console.log(umpire.play(player1, player2))
module.exports = Noughts_and_Crosses;

