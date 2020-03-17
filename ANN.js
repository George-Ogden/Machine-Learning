class Neural_Network {
  constructor(type,activation_function,learning_rate=0.1
  ){
    //add activation function
	this.type = type
    this.activation_function_name = activation_function;
    this.activation_function = activation_functions[activation_function];
    //add learning rate
    this.learning_rate = learning_rate;
  }
  show(){
  }
  forward_propagate(){
  }
  backward_propagate(){
  }
  cost(test_data){
    //starte with no cost
    let value = 0;
    for (let i = 0; i < test_data.length; i++){
      //find errors squared
      value += Matrix.subtract(
        Matrix.fromArray([test_data[i][1]]),
        Matrix.fromArray([this.forward_propagate(test_data[i][0])]),
      ).rss();
    }
    //return average
    return value / test_data.length;
  }
}