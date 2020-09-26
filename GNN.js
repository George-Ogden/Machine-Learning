const fs = require("fs")
const activation_functions = require("./Activation_Functions").activation_functions;
const Matrix = require("./Matrix");
class Genetic_Neural_Network {
    constructor(type,activation_function="tanh") {
        this.type = type
        this.activation_function_name = activation_function;
        this.activation_function = activation_functions[activation_function];
    }
    replicate() {
        //copy
        return this.copy()
    }
    mutate(rate = 0.05) {
        //define result
        let result = this.copy()
        //loop through all weights and biases
        for (let i = 0; i < this.length; i++) {
            //mutate each neuron after coin-toss function
            result.weights[i].map(x => Math.random() < rate ? x + Math.random() * 2 - 1 : x)
            result.biases[i].map(x => Math.random() < rate ? x + Math.random() * 2 - 1 : x)
        }
        //return result
        return result
    }
    static crossover(network1, network2, weight = 0.5) {
        //define results
        network1 = network1.copy()
        network2 = network2.copy()
        //loop through all weights and biases
        for (let i = 0; i < network1.length; i++) {
            //loop through matrix details
            network1.weights[i].set(network1.weights[i].map((x,y) => Math.random() < weight ?x : y,network2.weights[i]))
            network1.biases[i].set(network1.biases[i].map((x,y) => Math.random() < weight ?x : y,network2.biases[i]))
        }
        //return results
        return network1.mutate(0.01)
    }
    static load(type,name=type){
        return eval(type).from_string(eval("(" + fs.readFileSync(name+".json").toString() + ")"))
    }
    save(name = this.type){
        fs.writeFileSync(name+".json",JSON.stringify(this))
    }
    copy() {
        //create network from string of self
        return eval(this.type).from_string(eval("(" + JSON.stringify(this) + ")"));
    }
    show() {
        //default value
        console.log(this)
    }
    forward_propagate(input) {}
    export(){
        let copy = eval("("+JSON.stringify(this)+")")
        delete copy.process
        return JSON.stringify(copy)
    }
}
module.exports = Genetic_Neural_Network