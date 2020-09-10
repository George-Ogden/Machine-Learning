class Hex extends Umpire {
    constructor(size = 11) {
        //create umpire
        super(size)
    }
    check_state(board = this.board) {
        //graph search for path across board

        //rebuild board
        board.build(this.size, this.size)
        //check horizontally
        //create empty board
        let board = board.copy()
        board.reset()
        //initialise stack
        let stack = []
        //find possible starting nodes
        for (let i = 0; i < this.size; i++) {
            if (board.data[i][0] == -1 && board.data[i][0] == 0) {
                stack.push([0, i])
                //colour in nodes
                board.data[i][0] = 1
            }
        }
        //loop through the stack
        while (stack.length > 0) {
            //search for nodes from last value
            let result = this.search(stack.pop(), board)
            //check if end has been reached
            if (result.reduce((done, position) => position[0] == this.size - 1 ? 1 : done, 0) > 0) {
                //flatten board
                board.flatten();
                //return winner
                return -1
            }
            //add search results to stack
            stack = stack.concat(result)
            //colour in nodes
            result.map(position => board.data[position[1]][position[0]] = 1)
        }
        //check vertically
        //create empty board
        board.reset()
        //reinitialise stack
        stack = []
        //find possible starting nodes
        for (let i = 0; i < this.size; i++) {
            if (board.data[0][i] == 1 && board.data[0][i] == 0) {
                stack.push([i, 0])
                //colour in nodes
                board.data[0][i] = 1
            }
        }
        //loop through the stack
        while (stack.length > 0) {
            //search for nodes from last value
            let result = this.search(stack.pop(), board)
            //check if end has been reached
            if (result.reduce((done, position) => position[1] == this.size - 1 ? 1 : done, 0) > 0) {
                //flatten board
                board.flatten();
                //return winner
                return 1
            }
            //add search results to stack
            stack = stack.concat(result)
            //colour in nodes
            result.map(position => board.data[position[1]][position[0]] = 1)
        }
        //flatten board
        board.flatten()
        //if no one is winning, return 0
        return 0
    }
    search(position, board) {
        //initialise available nodes
        let positions = []
        //convert matrix to hexagonal grid
        const searches = [
            [-1, 0],
            [0, -1],
            [1, -1],
            [1, 0],
            [0, 1],
            [-1, 1]
        ]
        //loop though search positions
        for (let i = 0; i < searches.length; i++) {
            //check validity of position and whether it extends the graph
            if (position[1] + searches[i][1] >= 0 && position[1] + searches[i][1] < this.size && position[0] + searches[i][0] >= 0 && position[0] + searches[i][0] < this.size && board.data[position[1] + searches[i][1]][position[0] + searches[i][0]] == board.data[position[1]][position[0]] && board.data[position[1] + searches[i][1]][position[0] + searches[i][0]] == 0) {
                //add available nodes
                positions.push([position[0] + searches[i][0], position[1] + searches[i][1]])
            }
        }
        //return found nodes
        return positions
    }
}