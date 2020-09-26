const Matrix = require("./Matrix");
const Neural_Network = require("./ANN");
class Flatten extends Neural_Network {
    constructor(x, y, colours = 3) {
        super("Flatten", "identity")
        this.x = x;
        this.y = y;
        this.colours = colours
    }
    forward_propagate(pixel_data) {
        //create output
        let output = new Matrix(1, this.x * this.y * this.colours)
        //loop through layers
        for (let i = 0; i < this.colours; i++) {
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    //insert into flat matrix
                    output.data[0][i * this.x * this.y + x * this.y + y] = pixel_data[i].data[y][x]
                }
            }
        }
        return output
    }
    backward_propagate(error) {
        //define gradient
        let gradient = []
        //loop through colours
        for (let i = 0; i < this.colours; i++) {
            //add to gradient
            gradient.push(new Matrix(this.y, this.x))
            //loop through data
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    //insert into non-flat matrix
                    gradient[i].data[y][x] = error.data[0][i * this.x * this.y + x * this.y + y]
                }
            }
        }
        return gradient
    }
    static from_string(dict) {
        //create new network
        return new Flatten(dict.x, dict.y, dict.colours)
    }
}
module.exports = Flatten