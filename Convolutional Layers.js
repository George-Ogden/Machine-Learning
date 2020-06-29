const Matrix = require("./Matrix.js");
const Neural_Network = require("./ANN.js");
class Convoluting extends Neural_Network {
    constructor(kernel_width, kernel_height, kernels, colours = 3, activation_function = "swish") {
        super("Convoluting", activation_function, .01)
        //sizes
        this.length = kernels
        this.width = kernel_width
        this.height = kernel_height
        this.colours = colours
        //create kernels
        this.kernels = []
        //initialise deltas
        this.kernel_deltas = []
        //loop through kernels
        for (let i = 0; i < this.colours; i++) {
            this.kernels.push([])
            this.kernel_deltas.push([])
            for (let j = 0; j < kernels; j++) {
                //insert kernel into array
                this.kernels[i].push(new Matrix(kernel_height, kernel_width))
                this.kernel_deltas[i].push(Matrix.blank(kernel_height, kernel_width))
            }
        }
    }
    static convolution(layer, kernel) {
        //define output
        let output = new Matrix(layer.rows - kernel.rows + 1, layer.cols - kernel.cols + 1)
        //loop through rows and columns
        for (let i = 0; i < output.rows; i++) {
            for (let j = 0; j < output.cols; j++) {
                //complete cross correlation
                output.data[i][j] = Matrix.multiply(layer.subsection(j, i, kernel.cols, kernel.rows), kernel).sum()
            }
        }
        return output;
    }

    static full_convolution(layer, kernel) {
        //pad and flip before convoluting
        layer.pad(kernel.rows - 1, kernel.cols - 1)
        kernel.flip()
        //convolute
        return Convoluting.convolution(layer, kernel)
    }

    forward_propagate(pixel_data) {
        //create output
        let output = []
        //initialise process
        this.process = []
        //loop through kernels
        for (let i = 0; i < this.colours; i++) {
            output.push(pixel_data[i].copy())
            //add to process
            this.process.push([])
            for (let j = 0; j < this.length; j++) {
                //add to process
                this.process[i].push(output[i].copy())
                //add to next layer
                output[i].set(Matrix.map(Convoluting.convolution(output[i], this.kernels[i][j]),this.activation_function.function))
            }
        }
        return output
    }
    backward_propagate(error) {
        //loop through layers
        for (let j = this.length - 1; j >= 0; j--) {
            //loop through colours
            for (let i = 0; i < this.colours; i++) {
                //calculate the gradients
                let gradient = Matrix.map(
                    this.process[i][j],
                    this.activation_function.derivative
                )
                gradient = Convoluting.convolution(gradient,error[i])
                gradient.multiply(this.process[i][j-1])
                //find gradient using convolution
                //  error[i] = Convoluting.convolution(error)???
                //add gradient
                this.kernel_deltas[i][j].add(gradient)
            }
        }
        return error
    }

    update(){
        //console.log(Matrix.multiply(this.kernel_deltas[0][0],this.learning_rate))
        for (let i = 0; i < this.colours; i++) {
            for (let j = 0; j < this.length; j++) {
            //add deltas to kernels
            this.kernels[i][j].add(Matrix.multiply(this.kernel_deltas[i][j],this.learning_rate))

            //reset deltas
            this.kernel_deltas[i][j].reset()
            }
        }
    }

    show() {
        for (let i = 0; i < this.colours; i++) {
            for (let j = 0; j < this.length; j++) {
                //insert kernel into array
                this.kernels[i][j].show()
            }
        }
    }

    static from_string(dict) {
        //create new network
        let network = new Convoluting(dict.width,
            dict.height,
            dict.length,
            dict.colours,
            dict.activation_function_name
            )
        //set variables
        network.learning_rate = dict.learning_rate
        //add kernels
        for (let i = 0; i < network.colours; i++) {
            for (let j = 0; j < network.length; j++) {
                network.kernels[i][j] = Matrix.fromArray(dict.kernels[i][j].data);
            }
        }
        return network;
    }
}
module.exports = Convoluting
let c = new Convoluting(3,3,2,1,"sigmoid")
k = new Matrix(28,28)
console.log(c.forward_propagate([k])[0].sum())
for (let i = 0; i < 1; i++){
    c.backward_propagate([Matrix.subtract(Matrix.blank(24,24,4),c.forward_propagate([k])[0])])
    c.backward_propagate([Matrix.subtract(c.forward_propagate([k])[0],Matrix.blank(24,24,4))])
    c.update()
    console.log(c.forward_propagate([k])[0].sum())
}
console.log(c.forward_propagate([k])[0].sum())