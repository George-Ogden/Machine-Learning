const Matrix = require("./Matrix.js");
const fs = require("fs")
const Neural_Network = require("./ANN.js")
const Fully_Connected_Network = require("./FCNN.js");
const { numerify } = require("./dinosaurs.js");
const data_set = require("./dinosaurs.js").data_set
const textify = require("./dinosaurs.js").textify
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
  train_discriminator(data_set, size=data_set.length, n=1) { 
    var training_set = [...data_set.map((data) => [
        this.generator.forward_propagate(data),
        Generative_Adverserial_Network.negative,
      ]),...data_set.map((data) => [
          data, 
          Generative_Adverserial_Network.positive,
        ])]
    this.discriminator.train(training_set,n,size);
  }
  train_generator(data_set, size=data_set.length, n=1) {
    for (let x = 0; x < n; x++){
    let r = Math.floor(Math.random() * data_set.length);
    var discriminator_copy = this.discriminator.copy();
    for (let i = r; i < size + r; i++) {
      var fake = this.generator.forward_propagate(
          Generative_Adverserial_Network.noise(data_set[i%data_set.length])
        )
     this.generator.backward_propagate(Math.max(...fake.data[0]) >= 26 ?
     Matrix.subtract(Matrix.map(fake,x => x >= 26?Math.random()*26: x),fake):
      discriminator_copy.backward_propagate(
        Matrix.subtract(
          Generative_Adverserial_Network.positive,
          discriminator_copy.forward_propagate(Matrix.map(fake,x => Math.floor(x)))
        )
      )
    );
    }
    this.generator.update();
    }
  }
  static prepareTraining(data) {
    return data.map((x) => Matrix.fromArray([x]));
  }
  static noise(data) {
    return Matrix.add(data, Matrix.multiply(new Matrix(1, data.cols),10));
  }
  train(data_set, n = 1, discriminator_batch = data_set.length, generator_batch = data_set.length, discriminator_n = 1, generator_n = 1) {
    for (let i = 0; i < n; i++) {
      this.train_discriminator(data_set, discriminator_batch,discriminator_n);
      this.train_generator(data_set, generator_batch,generator_n);
    }
  }
  generate(data) {
    let fake = this.generator.forward_propagate(
      Generative_Adverserial_Network.noise(data[Math.floor(Math.random() * data.length)])
    )
    return [fake.data[0],this.discriminator.forward_propagate(fake).data[0][0]]
  }
  export(){
    return JSON.stringify({"discriminator":eval("("+this.discriminator.export()+")"),"generator":eval("("+this.generator.export()+")")})
  }
  static load(type,name=type){
      return eval(type).from_string(eval("(" + fs.readFileSync(name+".json").toString() + ")"))
  }
}
const data = Generative_Adverserial_Network.prepareTraining(data_set)

var GAN = Generative_Adverserial_Network.load("Generative_Adverserial_Network","dinosaurs")//new Generative_Adverserial_Network(new Fully_Connected_Network(13, 2, 7, 1, "tanh", 0.5),new Fully_Connected_Network(13, 1, 13, 13, "softplus", 0.5));

for (let x = 234780;; x++){
  GAN.train(data,10,100,200,1,3)
  GAN.save("dinosaurs")
  console.log(10*(x+1))
}

/*
let t = 1
for (let i = 0; i < 10; i++){
  var x = [27]
  while (Math.max(...x) >= 26){
    
    [x,y] = GAN.generate(data)
    t++
  }
  console.log(textify(x),y)
}
console.log(t)
*/
//module.exports = Generative_Adverserial_Network
