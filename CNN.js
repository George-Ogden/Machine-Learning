const Combined_Network = require("./Combined Network.js")
const Convoluting = require("./Convolutional Layers.js")
const Max_Pooling = require("./Pooling Layers").max
const Flatten = require("./Flatten.js")
const fs = require("fs")
const Fully_Connected_Network = require("./FCNN.js")
class CNN_2 extends Combined_Network {
    //create combined network based on details
    constructor(inputsx, inputsy, convoluting1x, convoluting1y, convoluting1n, pooling1x, pooling1y, convoluting2x, convoluting2y, convoluting2n, pooling2x, pooling2y, connectedl, connectedw, connectedo, softmaxl, softmaxw, outputs, colours = 1){
        super([new Convoluting(convoluting1x,convoluting1y,convoluting1n,colours,"swish"), 
        new Max_Pooling(inputsx-(convoluting1x-1)*convoluting1n,inputsx-(convoluting1y-1)*convoluting1n,pooling1x, pooling1y,colours), 
        new Convoluting(convoluting2x,convoluting2y,convoluting2n,colours,"swish"), 
        new Max_Pooling(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n,Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n,pooling2x,pooling2y,colours), 
        new Flatten(Math.ceil((Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n)/pooling2x),Math.ceil((Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n)/pooling2y),colours), 
        new Fully_Connected_Network(Math.ceil((Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n)/pooling2x)*Math.ceil((Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n)/pooling2y)*colours,connectedl,connectedw,connectedo,"swish"), 
        new Fully_Connected_Network(connectedo,softmaxl,softmaxw,outputs,"sigmoid")],"CNN_2")
    }
    static load(type,name=type){
        return eval(type).from_string(eval("(" + fs.readFileSync(name+".json").toString() + ")"))
    }
    static from_string(dict) {
        //create a copy of self
        return new Combined_Network(dict.networks.map(x => eval(x.type).from_string(x)))
    }
}
class CNN_1 extends Combined_Network {
    //create combined network based on details
    constructor(inputsx, inputsy, convoluting1x, convoluting1y, convoluting1n, pooling1x, pooling1y, convoluting2x, convoluting2y, convoluting2n, pooling2x, pooling2y, connectedl, connectedw, connectedo, softmaxl, softmaxw, outputs, colours = 1){
        super([new Convoluting(convoluting1x,convoluting1y,convoluting1n,colours,"swish"), 
        new Max_Pooling(inputsx-(convoluting1x-1)*convoluting1n,inputsx-(convoluting1y-1)*convoluting1n,pooling1x, pooling1y,colours), 
        new Flatten(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x),Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y),colours), 
        new Fully_Connected_Network(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)*Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)*colours,connectedl,connectedw,connectedo,"swish"), 
        new Fully_Connected_Network(connectedo,softmaxl,softmaxw,outputs,"sigmoid")],"CNN_1")
    }
}
//let CNN = CNN_2.load("CNN_2","CNN")
let CNN = new CNN_2(28,28,3,3,2,2,2,3,3,2,2,2,2,12,10,1,50,2,1)
var data= [[[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,49,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,121,122,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,136,123,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34,200,126,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,96,230,127,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,215,250,127,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,51,222,250,127,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,128,246,249,126,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,244,252,177,34,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,52,251,250,129,5,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,33,164,254,244,113,4,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,4,115,244,252,175,34,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,46,209,254,209,46,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,9,127,246,253,127,9,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,47,209,254,234,34,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,8,207,253,253,202,4,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,34,245,254,221,91,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,9,96,252,246,128,10,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,2,77,219,255,220,50,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,9,140,251,234,96,7,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,47,209,254,204,34,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,20,159,247,254,127,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,37,213,250,230,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,18,108,127,109,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],[[0,1]]],[[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,4,21,37,37,21,3,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,20,50,115,172,215,215,170,78,7,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,35,158,219,241,242,221,217,232,206,47,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,22,159,245,232,145,114,51,41,146,243,164,35,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,8,95,231,222,123,22,4,0,4,127,250,245,158,20,0,0,0,0,0,0,0],[0,0,0,0,0,0,2,77,218,248,139,12,0,0,0,5,129,250,254,215,37,0,0,0,0,0,0,0],[0,0,0,0,0,0,11,139,248,218,77,2,0,0,1,36,177,252,254,215,37,0,0,0,0,0,0,0],[0,0,0,0,0,7,91,220,231,95,8,0,0,3,36,163,246,254,252,172,21,0,0,0,0,0,0,0],[0,0,0,0,0,34,202,246,159,22,0,0,3,67,174,245,254,254,250,130,5,0,0,0,0,0,0,0],[0,0,0,0,3,84,233,220,52,1,0,5,47,168,218,237,254,255,252,172,21,0,0,0,0,0,0,0],[0,0,0,0,22,171,249,172,21,0,0,26,156,151,74,191,253,255,254,215,37,0,0,0,0,0,0,0],[0,0,0,2,82,232,243,115,4,0,0,5,31,23,85,232,254,255,254,217,37,0,0,0,0,0,0,0],[0,0,0,4,115,244,220,77,2,0,0,0,4,12,128,246,254,255,254,217,37,0,0,0,0,0,0,0],[0,0,0,21,172,243,128,10,0,0,0,0,2,77,220,254,253,254,254,217,37,0,0,0,0,0,0,0],[0,0,1,52,220,221,51,0,0,0,0,0,4,125,249,253,221,242,254,203,32,0,0,0,0,0,0,0],[0,0,20,159,246,203,32,0,0,0,0,0,9,140,250,252,211,239,250,140,9,0,0,0,0,0,0,0],[0,0,37,215,250,140,9,0,0,0,0,0,32,202,254,254,243,250,250,127,4,0,0,0,0,0,0,0],[0,0,37,217,250,127,4,0,0,0,0,0,21,172,252,254,254,254,250,127,4,0,0,0,0,0,0,0],[0,0,37,217,250,129,5,0,0,0,0,5,36,147,251,254,253,254,250,127,4,0,0,0,0,0,0,0],[0,0,37,217,252,173,25,4,4,9,32,64,191,235,246,211,204,252,250,129,9,4,9,32,30,4,0,0],[0,0,32,202,253,234,145,127,127,140,204,222,247,232,159,51,120,243,252,191,129,127,140,194,126,14,0,0],[0,0,7,90,218,251,250,250,250,249,251,249,218,95,22,2,33,163,244,251,246,245,228,158,35,1,0,0],[0,0,0,8,79,170,215,217,215,184,160,127,77,8,0,0,1,33,126,190,140,125,81,22,1,0,0,0],[0,0,0,0,3,21,37,37,37,25,16,5,2,0,0,0,0,0,8,27,9,4,2,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],[[1,0]]]]
let training_set = Combined_Network.prepareTrainingImagesBW(data)

console.log(CNN.forward_propagate(training_set[0][0]))
console.log(CNN.forward_propagate(training_set[1][0]))

for (let i = 0; i < 1; i++){
    CNN.train(training_set,1)
    CNN.save("CNN")
    console.log(CNN.forward_propagate(training_set[0][0]))
    console.log(CNN.forward_propagate(training_set[1][0]))
}
//let training_set = [[input.prepare(),[0.5]]]
//CNN.backward_propagate(input.prepare())

module.exports = CNN_2