const Neural_Network = require("./ANN.js")
const Matrix = require("./Matrix.js")
const Convoluting = require("./Convolutional Layers.js")
var e = 0
class Combined_Network extends Neural_Network {
    constructor(networks,type="Combined_Neural_Network") {
        super(type)
        //create an array of networks
        this.networks = []
        this.length = networks.length
        for (let i = 0; i < this.length; i++) {
            this.networks.push(networks[i])
        }
    }
    forward_propagate(input) {
        //add copy of input to process
        this.process = [input.map(x => x.copy())]
        //loop through networks
        for (let i = 0; i < this.length; i++) {
            //pass output of previous network to input of next
            let output = this.networks[i].forward_propagate(this.process[i])
            //add to process
            this.process.push(output)
        }
        return this.process[this.length]
    }
    backward_propagate(error) {
        //loop through layers and backpropagate error
        for (let i = this.length - 1; i >= 0; i--) {
            error = this.networks[i].backward_propagate(error)
            console.log(error[0])
        }
    }
    update(){
        //loop through layers and update them
        for (let i = 0; i < this.length; i++) {
            this.networks[i].update()
        }
    }
    train(training_set, batches = 1, batch_size = training_set.length){
        //start at random position
        let r = Math.floor(Math.random() * training_set.length);
        for (let i = r; i < batches * batch_size + r; i++){
            for (let j = 0; j < batch_size; j++) {
                //backward propagate error
                this.backward_propagate( Matrix.subtract(training_set[(i+j)%batch_size][1], this.forward_propagate(training_set[(i+j)%batch_size][0])))
            }
            //update
            this.update()
        }
    }
    static from_string(dict) {
        //create a copy of self
        return new Combined_Network(dict.networks.map(x => eval(x.type).from_string(x)))
    }
    copy() {
        return Combined_Network.from_string(eval("("+JSON.stringify(this.networks))+ ")")
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
module.exports = Combined_Network