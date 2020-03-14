class Fully_Connected_Network extends Neural_Network{
    constructor(
      inputs,
      hidden_layers,
      layer_thickness,
      outputs,
      activation_function,
      learning_rate = 0.1
      ){
          //superclass constructor
        super("Fully_Connected_Network",activation_function, learning_rate)
      //initialise variables
      this.length = hidden_layers + 2;
      this.width = layer_thickness;
      //creates weights and biases matrices
      this.weights = [];
      for (let i = 0; i < this.length; i++){
        this.weights.push(new Matrix(this.width, this.width));
      }
      this.weights[0] = new Matrix(inputs, this.width);
      this.weights[this.length - 1] = new Matrix(this.width, outputs);
      this.biases = [];
      for (let i = 0; i < this.length; i++){
        this.biases.push(new Matrix(1, this.width));
      }
      this.biases[this.length - 1] = new Matrix(1, outputs);
    }
    show(){
      //display weights and biases
      for (let i = 0; i < this.length; i++){
        this.weights[i].show();
        this.biases[i].show();
      }
    }
    feedforward(inputs){
      let output = inputs instanceof Matrix ? inputs : Matrix.fromArray(inputs)
      this.process = [output.copy()];
      //set first output as input
      for (let i = 0; i < this.length; i++){
        //multiply by weights
        output.dot(this.weights[i]);
        //add biases
        output.add(this.biases[i]);
        //activation function
        output.map(this.activation_function.function);
        //add to the current process
        this.process.push(output.copy());
      }
      return output.data[0];
    }
    train(training_data, n = 1){
      let error;
      for (let i = 0; i < n; i++){
        //select random input
        let r = Math.floor(Math.random() * training_data.length);
        //calculate error
        if (n !== true){
          error = Matrix.subtract(
            Matrix.fromArray([training_data[r][1]]),
            Matrix.fromArray([this.feedforward(training_data[r][0])]),
          );
        } else {
          error = training_data
        }
        //loop backwards through rows
        for (let j = this.length - 1; j >= 0; j--){
          //calculate the gradients
          let gradient = Matrix.map(
            this.process[j + 1],
            this.activation_function.derivative,
          );
          gradient.multiply(error);
          gradient.multiply(this.learning_rate);
          //change the error
          error.dot(Matrix.transpose(this.weights[j]));
          //add the deltas
          this.biases[j].add(gradient);
          this.weights[j].add(
            Matrix.dot(Matrix.transpose(this.process[j]), gradient),
          );
        }
      }
      return error

    }
    static from_string(dict){
      //create new network
      let network = new Fully_Connected_Network(
        dict.weights[0].rows,
        dict.length - 2,
        dict.weights[0].cols,
        dict.weights[dict.weights.length - 1].cols,
        dict.activation_function_name,
	  	dict.learning_rate
      );
      //set variables
      network.process = dict.process;
      network.weights = dict.weights;
      network.biases = dict.biases;
      for (let i = 0; i < network.length; i++){
        network.weights[i] = Matrix.fromArray(network.weights[i].data);
        network.biases[i] = Matrix.fromArray(network.biases[i].data);
      }
      return network;
    }
    
    copy(){
      //create neural network from string of self
      return Fully_Connected_Network.from_string(this)
    }
  }
    
    //let network = new Fully_Connected_Network(2,1,3,1,"sigmoid",.001);
    let training_set = [
      [[0,0] , [0]],
      [[0,1] , [1]],
      [[1,0] , [1]],
      [[1,1] , [0]],
  ]/*
  for (let i = 0; i < training_set.length; i++){
      console.log(network.feedforward(training_set[i][0]));
  }
  while (network.cost(training_set) > 0.01){
      network.train(training_set,1000)
  }
  for (let i = 0; i < training_set.length; i++){
      console.log(network.feedforward(training_set[i][0]));
  }*/