class Discriminator extends Fully_Connected_Network {
    constructor(    inputs,        hidden_layers,        layer_thickness,        outputs,        activation_function,        learning_rate = 0.1   ){
        super(inputs,        hidden_layers,        layer_thickness,        outputs,        activation_function,        learning_rate )
        this.type = Discriminator
    }
    freeze(item, target){
        let error = Matrix.subtract(target, this.forward_propagate(item));
        //loop backwards through rows
        for (let j = this.length - 1; j >= 0; j--) {
            //calculate the gradients
            let gradient = Matrix.map(
                this.process[j + 1],
                this.activation_function.derivative,
            );
            gradient.multiply(this.learning_rate)
            gradient.multiply(error);
            //change the error
            error.dot(Matrix.transpose(this.weights[j]));
        }
        return error
    }
}