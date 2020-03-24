class Neural_Network {
  constructor(type, activation_function, learning_rate = 0.1) {
      //add activation function
      this.type = type
      this.activation_function_name = activation_function;
      this.activation_function = activation_functions[activation_function];
      //add learning rate
      this.learning_rate = learning_rate;
  }
  show() {}
  forward_propagate(inputs) {}
  backward_propagate(training_set) {}
  cost(test_data) {
      //starte with no cost
      let value = 0;
      for (let i = 0; i < test_data.length; i++) {
          //find errors squared
          value += Matrix.subtract(test_data[i][1], this.forward_propagate(test_data[i][0])).rss();
      }
      //return average
      return value / test_data.length;
  }
  copy() {
      //create network from string of self
      return eval(this.type).from_string(eval(JSON.stringify(this)));
  }
  static prepareInput(input) {
      //convert 1D array to matrix
      return Matrix.fromArray([input])
  }
  static prepareTraining(training_set) {
      //convert training data to matrix pairs
      return training_set.map(x => [Matrix.fromArray([x[0]]), Matrix.fromArray([x[1]])])
  }
}