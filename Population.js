class Population {
    constructor(number, inputs, hidden_layers, layer_thickness, outputs, activation_function) {
        //define population
        this.populations = [
            []
        ];
        this.generation = 0;
        this.number = number
        for (let i = 0; i < number; i++) {
            //add genetic neural network
            this.populations[0].push(new Genetic_Neural_Network(inputs, hidden_layers, layer_thickness, outputs, activation_function));
        }
        this.population = this.populations[0]
    }
    apply(func) {
        //apply function to every network
        return this.population.map(func);
    }
    fitness(data_set) {
        //return the average fitness
        return this.population.reduce((a, b) => a + 1 / b.cost(data_set), 0) / this.number
    }
    fitnesses(data_set) {
        //calculate fitness
        let fitness = this.population.reduce((a, b) => a + Math.pow(1 / b.cost(data_set), 2), 0)
        //return list of probabilities of being chosen
        return this.apply(network => (Math.pow(1 / network.cost(data_set), 2) / fitness))
    }
    sort(data_set) {
        //sort population from fittest to fattest
        this.population = this.population.sort((a, b) => a.cost(data_set) - b.cost(data_set))
    }
    reproduce(data_set, generations = 1, elitists = 1, mutation_rate = 0.4, crossover_rate = 0.5) {
        //repeat n times
        for (let n = 0; n < generations; n++) {
            //sort population
            this.sort(data_set)
            //get probabilities
            const fitnesses = this.fitnesses(data_set)
            //transfer elititists
            let next_generation = this.population.slice(0, elitists)

            //next generation parents
            let parents = [];
            //add to parents based on probability
            for (let i = 0; i < this.number - elitists; i++) {
                //generate random number
                let r = Math.random();
                for (let j = 0; j < this.number; j++) {
                    //find where number "fits"
                    if ((r -= fitnesses[j]) <= 0) {
                        //add to parents
                        parents.push(this.population[j].copy())
                        break
                    }
                }
            }

            //loop through parents
            for (let i = 0; i < parents.length; i++) {
                //generate random number
                let r = Math.random()
                //find where number "fits"
                if ((r -= mutation_rate) <= 0) {
                    //add mutated child
                    next_generation.push(this.population[i].mutate())
                } else if (r < crossover_rate) {
                    //add crossed-over child
                    let k = Math.floor(Math.random() * (parents.length - 1))
                    k >= i ? k++ : k;
                    next_generation.push(Genetic_Neural_Network.crossover(this.population[i], this.population[k], fitnesses[i] / (fitnesses[i] + fitnesses[k])).mutate(0.01))
                } else {
                    //add copy
                    next_generation.push(this.population[i].replicate())
                }
            }

            this.generation++;
            this.population = next_generation
            this.populations.push(this.population)
            //console.log(p.populations[p.generation][0].cost(data_set),p.generation)
        }
    }
    static from_string(generation) {
        //create new population
        let population = new Population(generation.length, generation[0].inputs, generation[0].length, generation[0].width, generation.outputs, generation.activation_function_name)
        //reset population
        population.population = generation.map(x => Genetic_Neural_Network.from_string(x))

        return population
    }
}