class activation_function{
    constructor(func,derivative){
        this.function = func;
        this.derivative = derivative;
    }
}
//sigmoid
let sigmoid = new activation_function(x => 1/(1+Math.exp(-x)), x => x*(1-x));
//tanh
let tanh = new activation_function(x => Math.tanh(x), x => 1-x*x);
//ReLU
let ReLU = new activation_function(x => (x > 0) ? x:0, x => (x > 0) ? 1:0);
//leaky ReLU
let lReLU = new activation_function(x => (x > 0) ? x:0.1*x, x => (x > 0) ? 1:0.1);
//SoftPlus
let SoftPlus = new activation_function(x => Math.log(1+Math.exp(x)), x => 1-1/Math.exp(x));
//swish
let swish = new activation_function(x => x/(1+Math.exp(-x)), x => x+x*(1-x)/(lambert_W0(x*Math.exp(-x))+x));

activation_functions = {"sigmoid":sigmoid,"tanh":tanh,"ReLU":ReLU,"lReLU":lReLU,"SoftPlus":SoftPlus,"swish":swish}