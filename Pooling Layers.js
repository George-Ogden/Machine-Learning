const Matrix = require("./Matrix");
const Neural_Network = require("./ANN");
class Max_Pooling extends Neural_Network {
    constructor(x, y, dx, dy, colours = 3) {
        super("Max_Pooling", "identity", 1)
        this.x = x;
        this.y = y;
        this.dx = dx
        this.dy = dy
        this.colours = colours
    }
    forward_propagate(pixel_data) {
        //create output
        let output = []
        //define process
        this.process = []
        //loop through layers
        for (let i = 0; i < this.colours; i++) {
            //define output
            output.push(new Matrix(Math.ceil(this.y / this.dx), Math.ceil(this.x / this.dx)))
            //add to process
            this.process.push(pixel_data[i].copy())
            //loop through x and y
            for (let x = 0; x < this.x; x += this.dx) {
                for (let y = 0; y < this.y; y += this.dy) {
                    //check if overflowing
                    let dx = (x + this.dx >= this.x) ? this.x - x : this.dx
                    let dy = (y + this.dy >= this.y) ? this.y - y : this.dy
                    //add the max value
                    output[i].data[y / this.dy][x / this.dx] =
                        pixel_data[i].subsection(x, y, dx, dy).max()
                }
            }
        }
        return output
    }
    backward_propagate(error) {
        //loop through colours
        for (let i = 0; i < this.colours; i++) {
            //define gradient
            let gradient = new Matrix(this.y, this.x)
            //loop through process
            for (let x = 0; x < this.x; x += this.dx) {
                for (let y = 0; y < this.y; y += this.dy) {
                    //check if overflowing
                    let dx = (x + this.dx >= this.x) ? this.x - x : this.dx
                    let dy = (y + this.dy >= this.y) ? this.y - y : this.dy
                    //find max plot and multiply by error
                    gradient.insert(Matrix.multiply(this.process[i].subsection(x, y, dx, dy).max_plot(), error[i].data[y / this.dy][x / this.dx]), x, y);
                }
            }
            //reset error
            error[i].set(gradient)
        }
        return error
    }
    static from_string(dict) {
        //create new network
        return new Max_Pooling(dict.x, dict.y, dict.dx, dict.dy,dict.colours)
    }
    export(){
        let copy = this.copy()
        delete copy.process
        delete copy.activation_function
        delete copy.activation_function_name
        return JSON.stringify(copy)
    }
}
class Average_Pooling extends Neural_Network {
    constructor(x, y, dx, dy, colours = 3) {
        super("Average_Pooling", "identity", 1)
        //define sizes
        this.x = x;
        this.y = y;
        this.dx = dx
        this.dy = dy
        this.colours = colours
    }
    forward_propagate(pixel_data) {
        //create output
        let output = []
        //loop through layers
        for (let i = 0; i < this.colours; i++) {
            //define output
            output.push(new Matrix(Math.ceil(this.y / this.dx), Math.ceil(this.x / this.dx)))
            //loop through x and y
            for (let x = 0; x < this.x; x += this.dx) {
                for (let y = 0; y < this.y; y += this.dy) {
                    //check if overflowing
                    let dx = (x + this.dx >= this.x) ? this.x - x : this.dx
                    let dy = (y + this.dy >= this.y) ? this.y - y : this.dy
                    //add the average value
                    output[i].data[y / this.dy][x / this.dx] =
                        pixel_data[i].subsection(x, y, dx, dy).sum() / (dx * dy)
                }
            }
        }
        return output
    }
    backward_propagate(error) {
        //loop through colours
        for (let i = 0; i < this.colours; i++) {
            //define gradient
            let gradient = new Matrix(this.y, this.x)

            //loop through process
            for (let x = 0; x < this.x; x += this.dx) {
                for (let y = 0; y < this.y; y += this.dy) {
                    //check if overflowing
                    let dx = (x + this.dx >= this.x) ? this.x - x : this.dx
                    let dy = (y + this.dy >= this.y) ? this.y - y : this.dy
                    //create matrix of size
                    let blank = new Matrix(dy, dx)
                    blank.reset(1)
                    //find max plot and multiply by error
                    gradient.insert(Matrix.multiply(blank, error[i].data[y / this.dy][x / this.dx] / (dx * dy)), x, y);
                }
            }
            //multiply by learning rate
            gradient.multiply(this.learning_rate)
            //reset error
            error[i].set(gradient)
        }
        return error
    }
    static from_string(dict) {
        //create new network
        return new Average_Pooling(dict.x, dict.y, dict.dx, dict.dy,dict.colours)
    }
    export(){
        let copy = this.copy()
        delete copy.process
        delete copy.activation_function
        delete copy.activation_function_name
        return JSON.stringify(copy)
    }
}
module.exports = {
    "max":Max_Pooling,
    "avg":Average_Pooling
}