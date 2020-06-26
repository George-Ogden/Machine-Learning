const Combined_Network = require("./Combined Network.js")
const Convoluting = require("./Convolutional Layers.js")
const Max_Pooling = require("./Pooling Layers").max
const Flatten = require("./Combined Network.js")
const Fully_Connected_Network = require("./Combined Network.js")
const BW_Image_from_data = require("./Image.js").bw_data
const image = require("./Image.js").eco
class CNN_2 extends Combined_Network {
    //create combined network based on details
    constructor(inputsx, inputsy, convoluting1x, convoluting1y, convoluting1n, pooling1x, pooling1y, convoluting2x, convoluting2y, convoluting2n, pooling2x, pooling2y, connectedl, connectedw, connectedo, softmaxl, softmaxw, outputs, colours = 1){
        super([new Convoluting(convoluting1x,convoluting1y,convoluting1n,colours,"swish"), 
        new Max_Pooling(inputsx-(convoluting1x-1)*convoluting1n,inputsx-(convoluting1y-1)*convoluting1n,pooling1x, pooling1y,colours), 
        new Convoluting(convoluting2x,convoluting2y,convoluting2n,colours,"swish"), 
        new Max_Pooling(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n,Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n,pooling2x,pooling2y,colours), 
        new Flatten(Math.ceil((Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n)/pooling2x),Math.ceil((Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n)/pooling2y),colours), 
        new Fully_Connected_Network(Math.ceil((Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)-(convoluting2x-1)*convoluting2n)/pooling2x)*Math.ceil((Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)-(convoluting2y-1)*convoluting2n)/pooling2y)*colours,connectedl,connectedw,connectedo,"swish"), 
        new Fully_Connected_Network(connectedo,softmaxl,softmaxw,outputs,"sigmoid")])
    }
}
class CNN_1 extends Combined_Network {
    //create combined network based on details
    constructor(inputsx, inputsy, convoluting1x, convoluting1y, convoluting1n, pooling1x, pooling1y, convoluting2x, convoluting2y, convoluting2n, pooling2x, pooling2y, connectedl, connectedw, connectedo, softmaxl, softmaxw, outputs, colours = 1){
        super([new Convoluting(convoluting1x,convoluting1y,convoluting1n,colours,"swish"), 
        new Max_Pooling(inputsx-(convoluting1x-1)*convoluting1n,inputsx-(convoluting1y-1)*convoluting1n,pooling1x, pooling1y,colours), 
        new Flatten(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x),Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y),colours), 
        new Fully_Connected_Network(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n)/pooling1x)*Math.ceil((inputsy-(convoluting1y-1)*convoluting1n)/pooling1y)*colours,connectedl,connectedw,connectedo,"swish"), 
        new Fully_Connected_Network(connectedo,softmaxl,softmaxw,outputs,"sigmoid")])
    }
}
let CNN = new CNN_2(28,28,3,3,2,2,2,3,3,2,2,2,2,12,10,1,5,1,1)
CNN.show();

let input = new BW_Image_from_data(image.prepare_bw())
input.shrink(28,28)
//let training_set = [[input.prepare(),[0.5]]]
console.log(CNN.forward_propagate(input.prepare()))
//CNN.backward_propagate(input.prepare())
    