class Convoluting extends Neural_Network {
    constructor(kernel_width,kernel_height,kernels,activation_function="swish"){
        super("Convoluting",activation_function,0.001)
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

    forward_propagate(pixel_data){
        //create output
        let output = []
        //initialise process
        this.process = []
        //loop through kernels
        for (let i = 0; i < this.colours; i++){
            output.push(pixel_data[i] instanceof Matrix ? pixel_data[i] : Matrix.fromArray(pixel_data[i]))
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
    backward_propagate(error){
        //loop through colours
        for (let i = 0; i < this.colours; i++){
			//find derivative
            error[i].map(this.activation_function.derivative)
			//loop through layers
            for (let j = this.length - 1; j >= 0; j--){
				//find gradient using convolution
                let gradient = Convoluting.convolution(this.process[i][j],error[i])
				//multiply by learning rate
                gradient.multiply(this.learning_rate)
				//find the previous error through full convolution
                error[i] = Convoluting.full_convolution(error[i],this.kernels[i][j])
				//add gradient
                this.kernels[i][j].add(gradient)
            }
        }
        return error
    }

	show(){
		for (let i = 0; i < this.colours; i++){
            for (let j = 0; j < this.length; j++){
                //insert kernel into array
                this.kernels[i][j].show()
            }
        } 
	}

    static from_string(dict){
      //create new network
      let network = new Convoluting(dict.width, 
	  dict.height, 
	  dict.length,
	  dict.activation_function_name)
      //set variables
	  network.colours = dict.colours
	  network.learning_rate = dict.learning_rate
	  //add kernels
	  for (let i = 0; i < this.colours; i++){
            for (let j = 0; j < this.length; j++){
       			network.kernels[i][j] = Matrix.fromArray(network.kernels[i][j].data);
			}
      }
      return network;
    }
    
    copy(){
      //create neural network from string of self
      return Convoluting.from_string(this)
    }
}