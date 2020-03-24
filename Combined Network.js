class Combined_Network {
    constructor(networks) {
        //create an array of networks
        this.networks = []
        this.length = networks.length
        for (let i = 0; i < this.length; i++) {
            this.networks.push(networks[i])
        }
    }
    forward_propagate(input) {
        //add copy of input to process
        this.process = [input.map(x => x)]
        //loop through networks
        for (let i = 0; i < this.length; i++) {
            //pass output of previous network to input of next
            let output = this.networks[i].forward_propagate(this.process[i])
            //add to process
            this.process.push(output)
        }
        return this.process[this.length]
    }
    backward_propagate(training_set, n = 1) {
        let error;
        for (let i = 0; i < n; i++) {
            //select random input
            let r = Math.floor(Math.random() * training_set.length);
            //calculate error
            if (n !== true) {
                error = Matrix.subtract(training_set[r][1], this.forward_propagate(training_set[r][0]));
            } else {
                error = training_set
            }
            //loop through layers and backpropagate error
            for (let j = this.length - 1; j >= 0; j--) {
                error = this.networks[j].backward_propagate(error, true)
            }
        }
    }
    static from_string(dict) {
        //create a copy of self
        return new Combined_Network(dict.networks)
    }
    copy() {
        return Combined_Network.from_string(eval(JSON.stringify(this.networks)))
    }
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
    show() {
        for (let i = 0; i < this.length; i++) {
            console.log(this.networks[i])
        }
    }
}