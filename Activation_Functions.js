//sigmoid
sigmoid = x => 1/(1+Math.exp(-x));
dsigmoid = x => x*(1-x);
//tanh
tanh = x => Math.tanh(x);
dtanh = x => 1-x*x;
//ReLU
ReLU = x => (x > 0) ? x:0;
dReLU = x => (x > 0) ? 1:0;
//leaky ReLU
lReLU = x => (x > 0) ? x:0.1*x;
dlReLU = x => (x > 0) ? 1:0.1;
//SoftPlus
SoftPlus = x => Math.log(1+Math.exp(x));
dSoftPlus = x => 1-1/Math.exp(x);
//swish
swish = x => x/(1+Math.exp(-x));
dswish = x => x+x*(1-x)/(gsl_sf_lambert_W0(x*Math.exp(-x))+x);

console.log(sigmoid(7));
console.log(dsigmoid(sigmoid(7)));
console.log(tanh(7));
console.log(dtanh(0.8));
console.log(ReLU(7));
console.log(dReLU(0.8));
console.log(SoftPlus(7));
console.log(dSoftPlus(0.8));
console.log(swish(7));
console.log(dswish(0.8));