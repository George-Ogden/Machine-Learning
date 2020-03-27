class Neural_Network {
    constructor(type, activation_function="identity", learning_rate = 1) {
        //add activation function
        this.type = type
        this.activation_function_name = activation_function;
        this.activation_function = activation_functions[activation_function];
        //add learning rate
        this.learning_rate = learning_rate;
    }
    show() {}
    forward_propagate(inputs) {}
    backward_propagate(training_set) {}
    cost(test_data, n=0) {
        //starte with no cost
        let value = 0;
        if (n == 0){
            for (let i = 0; i < test_data.length; i++) {
                //find errors squared
                value += Matrix.subtract(test_data[i][1], this.forward_propagate(test_data[i][0])).rss();
            }
            //return average
            return value / test_data.length;
        } else {
            for (let i = 0; i < n; i++) {
                let r = Math.floor(Math.random() * test_data.length);
                //find errors squared
                value += Matrix.subtract(test_data[r][1], this.forward_propagate(test_data[r][0])).rss();
            }
            //return average
            return value / n;
        }
    }
    copy() {
        //create network from string of self
        return eval(this.type).from_string(eval(JSON.stringify(this)));
    }
    static prepareInput(input) {
        //convert 1D array to matrix
        return Matrix.fromArray([input])
    }
    static prepareTraining(training_set) {
        //convert training data to matrix pairs
        return training_set.map(x => [Matrix.fromArray([x[0]]), Matrix.fromArray([x[1]])])
    }
    static prepareTrainingImages(training_set) {
        //convert training data to matrix pairs
        return training_set.map(x => [
            x[0].map(x => Matrix.multiply(x,1/255)), Matrix.fromArray([x[1]])
        ])
    }
    static prepareDatasets(training_set, len=1) {
        //convert training data to matrix pairs
        return training_set.map(function (x){
            let result = new Array(len).fill(0);
            result[x[1][0]-1] = 1;
            return [[Matrix.multiply(Matrix.fromArray(x[0]),1/255)], Matrix.fromArray([result])]
        })
    }
}