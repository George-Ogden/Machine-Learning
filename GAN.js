const Matrix = require("./Matrix.js");
const fs = require("fs")
const Neural_Network = require("./ANN.js")
const Fully_Connected_Network = require("./FCNN.js")
const data_set = require("./dinosaurs.js").data_set
class Generative_Adverserial_Network extends Neural_Network {
  constructor(discriminator, generator) {
    super("Generative_Adverserial_Network")
    this.discriminator = discriminator;
    this.generator = generator;
  }
  static from_string(dict) {
    return new Generative_Adverserial_Network(
      Fully_Connected_Network.from_string(dict.discriminator),
      Fully_Connected_Network.from_string(dict.generator)
    );
  }
  static positive = Matrix.fromArray([[1]]);
  static negative = Matrix.fromArray([[0]]);
  train_discriminator(data_set) { 
    var training_set = [...data_set.map((data) => [
        this.generator.forward_propagate(data),
        Generative_Adverserial_Network.negative,
      ]),...data_set.map((data) => [
          data, 
          Generative_Adverserial_Network.positive,
        ])]
    this.discriminator.train(training_set);
  }
  train_generator(data_set) {
    var discriminator_copy = this.discriminator.copy();
    for (let i = 0; i < data_set.length; i++) {
      var fake = discriminator_copy.forward_propagate(
        this.generator.forward_propagate(
          Generative_Adverserial_Network.noise(data_set[i])
        )
      )
       this.generator.backward_propagate(
        discriminator_copy.backward_propagate(Math.max(...fake.data[0]) >= 26 ? 
        Matrix.multiply(fake,26/Math.max(...fake.data[0])):
          Matrix.subtract(
            Generative_Adverserial_Network.positive,
            fake
          )
        )
      );
    }
    this.generator.update();
  }
  static prepareTraining(data) {
    return data.map((x) => Matrix.fromArray([x]));
  }
  static noise(data) {
    return Matrix.add(data, Matrix.multiply(new Matrix(1, data.cols),10));
  }
  train(data_set, n = 1) {
    for (let i = 0; i < n; i++) {
      this.train_discriminator(data_set);
      this.train_generator(data_set);
    }
  }
  generate(data) {
    return this.generator.forward_propagate(
      data[Math.floor(Math.random() * data.length)]
    );
  }
  static load(type,name=type){
      return eval(type).from_string(eval("(" + fs.readFileSync(name+".txt").toString() + ")"))
  }
}
const data = Generative_Adverserial_Network.prepareTraining(data_set)

var GAN = /*Generative_Adverserial_Network.load("Generative_Adverserial_Network","dinosaurs")*/new Generative_Adverserial_Network(new Fully_Connected_Network(13, 2, 7, 1, "tanh", 0.5),new Fully_Connected_Network(13, 2, 13, 13, "softplus", 0.5));

for (let x = 1;; x++){
  GAN.train(data)
  GAN.save("dinosaurs")
  console.log(x)
}

/*
var x = [-1]
let t = 1
while (Math.max(...x) >= 26){
  x = GAN.generate(data).data[0]
  console.log(t++,Math.min(...x),Math.max(...x))
}
console.log(x)
*/
//module.exports = Generative_Adverserial_Network