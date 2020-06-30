const Combined_Network = require("./Combined Network.js")
const Convoluting = require("./Convolutional Layers.js")
const Max_Pooling = require("./Pooling Layers").max
const Flatten = require("./Flatten.js")
const fs = require("fs")
const Fully_Connected_Network = require("./FCNN.js")
class CNN_2 extends Combined_Network {
    //create combined network based on details
    constructor(inputsx, inputsy, convoluting1x, convoluting1y, convoluting1n, pooling1x, pooling1y, convoluting2x, convoluting2y, convoluting2n, pooling2x, pooling2y, connectedl, connectedw, connectedo, softmaxl, softmaxw, outputs, colours = 1){
        super([new Convoluting(convoluting1x,convoluting1y,convoluting1n,colours,"swish",0.00001), 
        new Max_Pooling(inputsx-(convoluting1x-1)*convoluting1n,inputsx-(convoluting1y-1)*convoluting1n,pooling1x, pooling1y,colours), 
        new Convoluting(convoluting2x,convoluting2y,convoluting2n,colours,"swish",0.0001), 
        new Max_Pooling(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n,Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n,pooling2x,pooling2y,colours), 
        new Flatten(Math.ceil((Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n)/pooling2x),Math.ceil((Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n)/pooling2y),colours), 
        new Fully_Connected_Network(Math.ceil((Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n)/pooling2x)*Math.ceil((Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n)/pooling2y)*colours,connectedl,connectedw,connectedo,"swish",0.01), 
        new Fully_Connected_Network(connectedo,softmaxl,softmaxw,outputs,"sigmoid",0.1)],"CNN_2")
    }
    static load(type,name=type){
        return eval(type).from_string(eval("(" + fs.readFileSync(name+".json").toString() + ")"))
    }
    static from_string(dict) {
        //create a copy of self
        return new Combined_Network(dict.networks.map(x => eval(x.type).from_string(x)),"CNN_2")
    }
}
class CNN_1 extends Combined_Network {
    //create combined network based on details
    constructor(inputsx, inputsy, convoluting1x, convoluting1y, convoluting1n, pooling1x, pooling1y, connectedl, connectedw, connectedo, softmaxl, softmaxw, outputs, colours = 1){
        super([new Convoluting(convoluting1x,convoluting1y,convoluting1n,colours,"swish"), 
        new Max_Pooling(inputsx-(convoluting1x-1)*convoluting1n,inputsx-(convoluting1y-1)*convoluting1n,pooling1x, pooling1y,colours), 
        new Flatten(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x),Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y),colours), 
        new Fully_Connected_Network(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)*Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)*colours,connectedl,connectedw,connectedo,"swish"), 
        new Fully_Connected_Network(connectedo,softmaxl,softmaxw,outputs,"sigmoid")],"CNN_1")
    }
}
//let CNN = CNN_2.load("CNN_2","CNN")
let CNN = new CNN_2(28,28,3,3,2,2,2,3,3,2,2,2,2,12,10,1,50,62,1)
var data = eval("(" + fs.readFileSync("EMNIST.json") + ")")
let training_set = Combined_Network.prepareTrainingImagesBW(data)
console.log(CNN.forward_propagate(training_set[0][0]))
console.log(CNN.forward_propagate(training_set[1][0]))
while (true){
    CNN.train(training_set,1)
    console.log(CNN.cost(training_set,10))
    CNN.save("CNN")
}


module.exports = CNN_2