class Umpire {
    constructor(board_size) {
        //create a board
        this.board = new Matrix(board_size, board_size)
        this.size = board_size
    }
    check_state() {
        //"abstract method"
        return 0;
    }
    play(player1, player2) {
        //flatten board
        this.board.flatten()
        //clear board
        this.board.reset()
        //loop through number of points
        for (let i = 0; i < this.size * this.size; i++) {
            //decide which player plays
            if (i % 2 == 0) {
                //forward propagate board to get move
                let move = player1.forward_propagate(this.board)
                //find max output not filled
                let position = move.find(move.max());
                while (this.board.data[position[0]][position[1]] != 0) {
                    move.data[position[0]][position[1]] = -1
                    position = move.find(move.max());
                }
                //add move to board
                this.board.add(move.max_plot())
            } else {
                //forward propagate board to get move
                //find max output not filled
                player2.forward_propagate(Matrix.multiply(this.board, -1))
                let move = player2.forward_propagate(this.board)
                let position = move.find(move.max());
                while (this.board.data[position[0]][position[1]] != 0) {
                    move.data[position[0]][position[1]] = -1
                    position = move.find(move.max());
                }
                //add move to board
                this.board.subtract(move.max_plot())
            }
            //check if someone is winning
            let state = this.check_state()
            //if someone has won, return winner
            if (state != 0) {
                this.board.build
                return state
            }

        }
        //rebuild board
        this.board.build(this.size, this.size)
        return 0
    }
    challenge(computer, starter = Math.random() > 0.5 ? 1 : 0) {
        //flatten board
        this.board.reset()
        //clear board
        this.board.flatten()
        //loop through number of points depending on who starts
        for (let i = -starter; i < this.size * this.size - starter; i++) {
            Matrix.map(Matrix.build(Matrix.multiply(this.board, -1), 3, 3), x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
            //decide which player plays
            if (i % 2 == 0) {
                //forward propagate board to get move
                let move = computer.forward_propagate(this.board)
                //find max output not filled
                let position = move.find(move.max());
                while (this.board.data[position[0]][position[1]] != 0) {
                    move.data[position[0]][position[1]] = -1
                    position = move.find(move.max());
                }
                //add move to board
                this.board.add(move.max_plot())
            } else {
                //display board
                let move = prompt("Your move!")
                this.board.data[0][move] = -1
            }
            let state = this.check_state()
            if (state != 0) {
                this.board.build
                return state
            }
        }
        this.board.build(this.size, this.size)
        return 0
    }
}