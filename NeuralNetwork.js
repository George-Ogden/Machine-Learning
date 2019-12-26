class Neural_Network{
    constructor(inputs,hidden_layers,layer_thickness, outputs,activation_function){
        //initialise variables
        this.length = hidden_layers + 2;
        this.width = layer_thickness;
        //creates weights and biases matrices
        this.weights =  [];
        for (let i = 0; i < this.length; i++){
            sample.push(new Matrix(this.width,this.width));
        }
        this.weights[0] = new Matrix(inputs,this.width);
        this.weights[this.length-1] = new Matrix(this.width,outputs);
        this.biases = [];
        for (let i = 0; i < this.length; i++){
            sample.push(new Matrix(1,this.width));
        }
        this.biases[this.length-1] = new Matrix(1,outputs);
    }
}