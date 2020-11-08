const Noughts_and_Crosses = require("./Noughts_and_Crosses");
const Matrix = require("./Matrix");
const Umpire = require("./Umpire");
const Player = require("./Player");
const Genetic_Fully_Connected_Neural_Network = require("./GFCNN");
const Convoluting = require("./Convolutional Layers");
const Genetic_Convolutional_Neural_Network = require("./GCNN");
const Genetic_Neural_Network = require("./GNN");
Genetic_Combined_Neural_Network = require("./Genetic Combined Network")
const Genetic_Flatten = require("./Genetic_Flatten")
class Population {
    constructor(number, inputs, umpire, hidden_layers, layer_thickness, activation_function="tanh") {
        inputs = Math.sqrt(inputs)
        this.population = [];
        this.generation = 0;
        this.number = number;
        this.umpire = umpire
        for (let i = 0; i < number; i++) {
            //add genetic neural network
            this.population.push( new Genetic_Combined_Neural_Network([new Genetic_Convolutional_Neural_Network(umpire.win,umpire.win,1,"swish"),new Genetic_Flatten(),new Genetic_Fully_Connected_Neural_Network((inputs-umpire.win+1)*(inputs-umpire.win+1),hidden_layers,layer_thickness,1,activation_function)]))
        }
    }
    apply(func) {
        //apply function to every network
        return this.population.map(func);
    }
    fitness() {
        //return the average fitness
        return this.population.reduce((a, b) => a + 1 / b.fitness, 0) / this.number;
    }
    fitnesses() {
        //return list of probabilities of being chosen
        return this.apply((network) => Math.pow(1 / network.fitness, 2));
    }
    sort() {
        for (let player1 of this.population) {
            for (let player2 of this.population) {
                let result = this.umpire.play(player1,player2)
                player1.fitness -= result
                player2.fitness += result
            }
        }
        //sort population from fittest to fattest
        this.population = this.population.sort((a, b) => a.fitness - b.fitness);
    }
    order(elitists) {
        //sort population
        this.sort();
        //get probabilities
        return [this.fitnesses(), this.population.slice(0, elitists)];
    }
    reproduce( generations = 1, elitists = 1, diversity = Math.floor(this.number / 5), mutation_rate = 0.2, crossover_rate = 0.75) {
        //repeat n times
        for (let n = 0; n < generations; n++) {
            let [fitnesses, next_generation] = this.order(elitists);
            let value = fitnesses.reduce((a, b) => a + b);
            //next generation parents
            let parents = [];
            let ranks = [];
            let count = 0;
            //add to parents based on probability
            for (let i = 0; i < this.number; i++) {
                //add only the fittest
                if (Math.random() < ((diversity - count) * fitnesses[i]) / value || value == 0) {
                    parents.push(this.population[i].copy());
                    ranks.push(fitnesses[i]);
                    if (count == diversity - 1) {
                        break;
                    }
                    count++;
                }
                value -= fitnesses[i];
            }
            //loop through parents
            for (let i = 0; i < this.number - elitists; i++) {
                //generate random number
                let r = Math.random();
                //find where number "fits"
                if ((r -= mutation_rate) <= 0) {
                    //add mutated child
                    next_generation.push(parents[i % parents.length].mutate(0.2));
                } else if (r < crossover_rate) {
                    //add crossed-over child
                    let k = Math.floor(Math.random() * (parents.length - 1));
                    k >= i ? k++ : k;
                    next_generation.push(Genetic_Combined_Neural_Network.crossover(parents[i % parents.length], parents[k], ranks[i % parents.length] / (ranks[i % parents.length] + ranks[k])).mutate(0.01));
                } else {
                    //add copy
                    next_generation.push(parents[i % parents.length].replicate());
                }
            }
            //move onto next generation
            this.generation++;
            this.population = next_generation;
        }
    }
    static from_string(generation, n = 0) {
        //create new population
        let population = new Population(generation.length, generation[0].inputs, generation[0].length, generation[0].width, generation.outputs, generation.activation_function_name);
        //fill in population
        population.population = generation.map((x) => Genetic_Combined_Neural_Network.from_string(x));
        population.generation = n;
        return population;
    }
}
module.exports = Population