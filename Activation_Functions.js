const lambert_W = require("./lambertw.js").lambert_W0
class Activation_Function {
    constructor(func, derivative) {
        this.function = func;
        this.derivative = derivative;
    }
}
//identity
const identity = new Activation_Function(x => x, x => 1);
//sigmoid
const sigmoid = new Activation_Function(x => 1 / (1 + Math.exp(-x)), x => x * (1 - x));
//tanh
const tanh = new Activation_Function(x => Math.tanh(x), x => 1 - x * x);
//ReLU
const ReLU = new Activation_Function(x => (x > 0) ? x : 0, x => (x > 0) ? 1 : 0);
//leaky ReLU
const lReLU = new Activation_Function(x => (x > 0) ? x : 0.1 * x, x => (x > 0) ? 1 : 0.1);
//SoftPlus
const SoftPlus = new Activation_Function(x => Math.log(1 + Math.exp(x)), x => 1 - 1 / Math.exp(x));
//swish
const swish = new Activation_Function(x => x / (1 + Math.exp(-x)), x => x == 0 ? 0.5 : x + x * (1 - x) / (lambert_W(x * Math.exp(-x)) + x));
//softplus
const softplus = new Activation_Function(x => x > 100 ? x : Math.log(1+Math.exp(x)),x => 1-Math.exp(-x));

activation_functions = {
    "sigmoid": sigmoid,
    "tanh": tanh,
    "ReLU": ReLU,
    "lReLU": lReLU,
    "SoftPlus": SoftPlus,
    "swish": swish,
    "identity": identity,
    "softplus": softplus
};
exports.activation_functions = activation_functions