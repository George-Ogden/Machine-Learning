class Combined_Network {
	constructor(networks){
		this.networks = []
		this.length = networks.length
		for (let i = 0; i < this.length; i++){
			this.networks.push(networks[i])
		}
	}
	forward_propagate(input){
		this.process = [input]
		for (let i = 0; i < this.length; i++){
			let output = this.networks[i].forward_propagate(this.process[i])
			this.process.push(output instanceof Matrix ? output : output[0] instanceof Matrix ? output.map(x => x.copy()) : Matrix.fromArray([output]))
		}
		return this.process[this.length]
	  }
	backward_propagate(training_data, n=1){
		let error;
      for (let i = 0; i < n; i++){
        //select random input
        let r = Math.floor(Math.random() * training_data.length);
        //calculate error
        if (n !== true){
          error = Matrix.subtract(
            Matrix.fromArray([training_data[r][1]]),
            Matrix.fromArray([this.forward_propagate(training_data[r][0])]),
            );
        } else {
          error = training_data
        }
		for (let j = this.length-1; j >= 0; j--){
      error = this.networks[j].backward_propagate(error,true)
		}
	}
	}
	static from_string(dict){
		let networks = []
		for (let i = 0; i < dict.length; i++){
			networks.push(dict[i].type.from_string(dict[i]))
		}
		return new Combined_Network(networks)
	}
	copy(){
		return Combined_Network.from_string(eval(JSON.stringify(this.networks)))
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
  show(){
    for (let i = 0; i < this.length; i++){
			console.log(this.networks[i])
		}
  }
}