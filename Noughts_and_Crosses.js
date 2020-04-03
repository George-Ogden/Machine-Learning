class Noughts_and_Crosses extends Umpire {
    constructor(size = 3, win = 3) {
        //create umpire
        super(size)
        //number required to win
        this.win = win
    }
    check_state() {
        //rebuild board
        this.board.build(this.size, this.size)
        //check horizontally
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size - this.win + 1; j++) {
                //ignore empty starting squares
                if (this.board.data[i][j] == 0) {
                    continue
                }
                //advantage goes to person with square
                let advantage = this.board.data[i][j]
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (this.board.data[i][j + k] != advantage) {
                        advantage = 0
                        break
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //flatten board
                    this.board.flatten();
                    //return winner
                    return advantage
                }
            }
        }
        //check vertically
        for (let i = 0; i < this.size - this.win + 1; i++) {
            for (let j = 0; j < this.size; j++) {
                //ignore empty starting squares
                if (this.board.data[i][j] == 0) {
                    continue
                }
                //advantage goes to person with square
                let advantage = this.board.data[i][j]
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (this.board.data[i + k][j] != advantage) {
                        advantage = 0
                        break
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //flatten board
                    this.board.flatten();
                    //return winner
                    return advantage
                }
            }

        }
        //check diagonally (\)
        for (let i = 0; i < this.size - this.win + 1; i++) {
            for (let j = 0; j < this.size - this.win + 1; j++) {
                //ignore empty starting squares
                if (this.board.data[i][j] == 0) {
                    continue
                }
                //advantage goes to person with square
                let advantage = this.board.data[i][j]
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (this.board.data[i + k][j + k] != advantage) {
                        advantage = 0
                        break
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //flatten board
                    this.board.flatten();
                    //return winner
                    return advantage
                }
            }

        }
        //check diagonally (/)
        for (let i = this.win - 1; i < this.size; i++) {
            for (let j = 0; j < this.size - this.win + 1; j++) {
                //ignore empty starting squares
                if (this.board.data[i][j] == 0) {
                    continue
                }
                //advantage goes to person with square
                let advantage = this.board.data[i][j]
                //loop through the rest of the squares
                for (let k = 1; k < this.win; k++) {
                    //if chain is incomplete, remove advantage
                    if (this.board.data[i - k][j + k] != advantage) {
                        advantage = 0
                        break
                    }
                }
                //if someone won, return winner
                if (advantage != 0) {
                    //flatten board
                    this.board.flatten();
                    //return winner
                    return advantage
                }
            }

        }
        //flatten board
        this.board.flatten()
        //if no one is winning, return 0
        return 0
    }
}