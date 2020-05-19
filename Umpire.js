class Umpire {
    constructor(board_size) {
        //create a board
        this.board = new Matrix(board_size, board_size)
        this.size = board_size
    }
    static shuffle(a){
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            a[i], a[j] = a[j], a[i]
        }
        return a;
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
                //forward propagate board to get move or play a random move to increase diversity
                let move = Math.random() < 0.01 ? new Matrix(1, this.size * this.size) : player1.forward_propagate(this.board)
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.add(move.max_plot())
            } else {
                //forward propagate board to get move or play a random move to increase diversity
                let move = Math.random() < 0.01? new Matrix(1, this.size * this.size) : player2.forward_propagate(Matrix.multiply(this.board,-1))
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.subtract(move.max_plot())
            }
            //check if someone is winning
            let state = this.check_state()
            //if someone has won, return winner
            if (state != 0) {
                this.board.build(this.size, this.size)
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
            Matrix.map(Matrix.build(this.board, this.size, this.size), x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
            //decide which player plays
            if (i % 2 == 0) {
                //forward propagate board to get move
                let move = computer.forward_propagate(this.board)
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
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
                this.board.build(this.size, this.size)
                return state
            }
        }
        this.board.build(this.size, this.size)
        return 0
    }
    exhibit(player1, player2) {
        //flatten board
        this.board.flatten()
        //clear board
        this.board.reset()
        //loop through number of points
        for (let i = 0; i < this.size * this.size; i++) {
            Matrix.map(Matrix.build(this.board, this.size, this.size), x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
            confirm()
            //decide which player plays
            if (i % 2 == 0) {
                //forward propagate board to get move
                let move = player1.forward_propagate(this.board)
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.add(move.max_plot())
            } else {
                //forward propagate board to get move
                //find max output not filled
                let move = player2.forward_propagate(Matrix.multiply(this.board,-1))
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.subtract(move.max_plot())
            }
            //check if someone is winning
            let state = this.check_state()
            //if someone has won, return winner
            if (state != 0) {
                Matrix.map(Matrix.build(this.board, this.size, this.size), x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
                this.board.build(this.size, this.size)
                return state
            }
        }
        //rebuild board
        Matrix.map(Matrix.build(this.board, this.size, this.size), x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
        this.board.build(this.size, this.size)
        return 0
    }
}