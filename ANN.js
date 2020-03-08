class Neural_Network {
  constructor(activation_function,learning_rate=0.1
  ){
    //add activation function
    this.activation_function_name = activation_function;
    this.activation_function = activation_functions[activation_function];
    //add learning rate
    this.learning_rate = learning_rate;
  }
  show(){
  }
  feedforward(){
  }
  train(){
  }
  cost(training_data){
    //starte with no cost
    let value = 0;
    for (let i = 0; i < training_data.length; i++){
      //find errors squared
      value += Matrix.subtract(
        Matrix.fromArray([training_data[i][1]]),
        Matrix.fromArray([this.feedforward(training_data[i][0])]),
      ).rss();
    }
    //return average
    return value / training_data.length;
  }
}