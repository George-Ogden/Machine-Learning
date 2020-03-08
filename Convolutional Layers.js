class Convoluting extends Neural_Network {
    constructor(kernel_width,kernel_height,kernels){
        super("swish",0.01)
        //sizes
        this.length = kernels
        this.width = kernel_width
        this.height = kernel_height
        this.colours = 3
        //create kernels
        this.kernels = []
        //loop through kernels
        for (let i = 0; i < this.colours; i++){
            this.kernels.push([])
            for (let j = 0; j < kernels; j++){
                //insert kernel into array
                this.kernels[i].push(new Matrix(kernel_height,kernel_width))
            }
        }    
    }
    static convolution(layer,kernel){
        //define output
        let output = new Matrix(layer.rows-kernel.rows+1,layer.cols-kernel.cols+1)
        //loop through rows and columns
        for (let i = 0; i < output.rows; i++){
            for (let j = 0; j < output.cols; j++){
                //complete cross correlation
                output.data[i][j] = Matrix.multiply(layer.subsection(j,i,kernel.cols,kernel.rows),kernel).sum()
            }
        }
        return output;
    }

    static full_convolution(layer,kernel){
        //pad and flip before convoluting
        layer.pad(kernel.rows-1,kernel.cols-1)
        kernel.flip()
        //convolute
        return Convoluting.convolution(layer,kernel)
    }

    feedForward(pixel_data){
        //create output
        let output = []
        //initialise process
        this.process = []
        //loop through kernels
        for (let i = 0; i < this.colours; i++){
            output.push(Matrix.fromArray(pixel_data[i]))
            //add to process
            this.process.push([])
            for (let j = 0; j < this.length; j++){
                //add to process
                this.process[i].push(output[i].copy())
                //add to next layer
                output[i].set(Convoluting.convolution(output[i],this.kernels[i][j]))
            }
            output[i].map(this.activation_function.function);
        }
        return output
    }
    train(error){
        //find activation function derivative
        for (let i = 0; i < error.length; i++){
            error[i].map(this.activation_function.derivative)
        }
        for (let i = 0; i < this.colours; i++){
            for (let j = this.length - 1; j >= 0; j--){
                let gradient = Convoluting.convolution(this.process[i][j],error[i])
                gradient.multiply(this.learning_rate)
                error[i] = Convoluting.full_convolution(error[i],this.kernels[i][j])
                this.kernels[i][j].add(gradient)
            }
        }
        return error
    }
}

let network = new Convoluting(3,5,2)
let inputs = [new Matrix(20,20).data,new Matrix(20,20).data,new Matrix(20,20).data]
let target = [new Matrix(12,16),new Matrix(12,16),new Matrix(12,16)]
for (let i = 0; i < 3; i++){
    target[i].reset(0.5);
}
console.log(network.feedforward(inputs))
/*
for (let i = 0; i < 100; i ++){
    let output = network.feedForward(inputs)
    let error = []
    for (let j = 0; j < 3; j ++){
        //console.log(target[j],output[j],i)
        error[j] = Matrix.subtract(target[j],output[j])
    }
    console.log(output)
    network.train(error)
}*/