class CNN_2 extends Combined_Network {
    constructor(inputsx, inputsy, convoluting1x, convoluting1y, convolting1n, pooling1x, pooling1y, convoluting2x, convoluting2y, convoluting2n, pooling2x, pooling2y, connectedl, connectedw, connectedo, softmaxl, softmaxw, outputs, colours = 1){
        super([new Convoluting(convoluting1x,convoluting1y,convoluting1n,"swish"), new Max_Pooling(inputsx-(convoluting1x-1)*convoluting1n,inputsx-(convoluting1y-1)*convoluting1n,pooling1x, pooling1y), new Convoluting(convoluting2x,convoluting2y,convoluting2n,"swish"), new Max_Pooling(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n/pooling1x)-(convoluting2x-1)*convoluting2n,(inputsy-(convoluting1y-1)*convoluting1n/pooling1y)-(convoluting2y-1)*convoluting2n,pooling2x,pooling2y)), new Flatten(Math.ceil(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n/pooling1x)-(convoluting2x-1)*convoluting2n/pooling2x)),Math.ceil((inputsy-(convoluting1y-1)*convoluting1n/pooling1y)-(convoluting2y-1)*convoluting2n/pooling2y)), new Fully_Connected_Network(Math.ceil(Math.ceil((inputsx-(convoluting1x-1)*convoluting1n/pooling1x)-(convoluting2x-1)*convoluting2n/pooling2x))*Math.ceil((inputsy-(convoluting1y-1)*convoluting1n/pooling1y)-(convoluting2y-1)*convoluting2n/pooling2y),connectedl,connectedw,connectedo,"swish"), new Fully_Connected_Network(connectedo,softmaxl,softmaxw,outputs,sigmoid)])
        for (let i = 0; i < this.length; i ++){
            this.networks[i].colours = colours
        }
    }
}
/*let CNN = new Combined_Network([new Convoluting(5,5,4,"swish"), new Max_Pooling(240,240,4,4), new Convoluting(5,5,3,"swish"), new Max_Pooling(48,48,8,8), new Flatten(6,6), new Fully_Connected_Network()])
CNN.show();
console.log(CNN.forward_propagate(image.prepare()))
*/