class Connect_4 extends Umpire {
    constructor(size = 7, win = 4) {
        //create umpire
        super(size)
        //number required to win
        this.win = win
    }
    play(player1, player2) {
        //clear board
        this.board.reset()
        //loop through number of points
        for (let i = 0; i < this.size * this.size; i++) {
            //decide which player plays
            if (i % 2 == 0) {
                //forward propagate board to get move or play a random move to increase diversity
                let move = Math.random() < 0.01 ? new Matrix(1, this.size) : player1.forward_propagate(Matrix.flatten(this.board))
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.data[this.board.subsection(position,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][position] ++
            } else {
                //forward propagate board to get move or play a random move to increase diversity
                let move = Math.random() < 0.01 ? new Matrix(1, this.size) : player2.forward_propagate(Matrix.flatten(this.board))
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.data[this.board.subsection(position,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][position] --
            }
            //check if someone is winning
            let state = this.check_state()
            //if someone has won, return winner
            if (state != 0) {
                return state
            }
        }
        return 0
    }
    challenge(computer, starter = Math.random() > 0.5 ? 1 : 0) {
        //clear board
        this.board.reset()
        //loop through number of points depending on who starts
        Matrix.map(this.board, x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
        for (let i = -starter; i < this.size * this.size - starter; i++) {
            //decide which player plays
            if (i % 2 == 0) {
                //forward propagate board to get move or play a random move to increase diversity
                let move = computer.forward_propagate(Matrix.flatten(this.board))
                
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.data[this.board.subsection(position,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][position] ++
            } else {
                //display board
                let move = parseInt(prompt("Your move!"))
                this.board.data[this.board.subsection(move,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][move] --
            }
            let state = this.check_state()
            Matrix.map(this.board, x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
            if (state != 0) {
                return state
            }
        }
        return 0
    }
    exhibit(player1, player2) {
        //clear board
        this.board.reset()
        //loop through number of points
        Matrix.map(this.board, x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
        for (let i = 0; i < this.size * this.size; i++) {
            confirm()
            //decide which player plays
            if (i % 2 == 0) {
                //forward propagate board to get move or play a random move to increase diversity
                let move = player1.forward_propagate(Matrix.flatten(this.board))
            
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.data[this.board.subsection(position,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][position] ++
            } else {
                //forward propagate board to get move or play a random move to increase diversity
                let move = player2.forward_propagate(Matrix.flatten(this.board))
                
                //find max output not filled
                let position = move.find(move.max())[1];
                while (this.board.data[0][position] != 0) {
                    move.data[0][position] = -2
                    position = move.find(move.max())[1];
                }
                //add move to board
                this.board.data[this.board.subsection(position,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][position] --
            }
            //check if someone is winning
            Matrix.map(this.board, x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
            let state = this.check_state()
            //if someone has won, return winner
            if (state != 0) {
                return state
            }
        }
        return 0
    }
    humans(){
        //clear board
        this.board.reset()
        //loop through number of points depending on who starts
        Matrix.map(this.board, x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
        for (let i = 0; i < this.size * this.size; i++) {
            //decide which player plays
            if (i % 2 == 0) {
                let move = parseInt(prompt("Player 1's move!"))
                this.board.data[this.board.subsection(move,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][move] ++
            } else {
                //display board
                let move = parseInt(prompt("Player 2's move!"))
                this.board.data[this.board.subsection(move,0,1,this.size).data.reduce((a,b,i) => b == 0 ? i : a)][move] --
            }
            let state = this.check_state()
            Matrix.map(this.board, x => x > 0 ? "X" : x < 0 ? "O" : " ").show();
            if (state != 0) {
                return state
            }
        }
        return 0
    }
    check_state() {
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
                    //return winner
                    return advantage
                }
            }

        }
        //if no one is winning, return 0
        return 0
    }
}