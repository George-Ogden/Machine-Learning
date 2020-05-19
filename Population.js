class Population {
    constructor(number, inputs, hidden_layers, layer_thickness, outputs, activation_function) {
        //define population
        //this.populations = [ [] ];
        this.population = [];
        this.generation = 0;
        this.number = number
        for (let i = 0; i < number; i++) {
            //add genetic neural network
            this.population.push(new Genetic_Neural_Network(inputs, hidden_layers, layer_thickness, outputs, activation_function));
        }
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
        //return list of probabilities of being chosen
        return this.apply(network => (Math.pow(1 / network.cost(data_set), 2)))
    }
    sort(data_set) {
        //sort population from fittest to fattest
        this.population = this.population.sort((a, b) => a.cost(data_set) - b.cost(data_set))
    }
    order(data_set, elitists){
              //sort population
            this.sort(data_set)
            //get probabilities
            return [this.fitnesses(data_set), this.population.slice(0, elitists)]
    }
    reproduce(data_set, generations = 1, elitists = 1, diversity = Math.floor(this.number/10), mutation_rate = 0.2, crossover_rate = 0.75) {
        //repeat n times
        for (let n = 0; n < generations; n++) {
            let [fitnesses, next_generation] = this.order(data_set,elitists)
            let value = fitnesses.reduce((a,b) => a+b)
            //next generation parents
            let parents = [];
            let ranks = [];
            let count = 0;
            //add to parents based on probability
            for (let i = 0; i < this.number; i++) {
                //add only the fittest
                if (Math.random() < (diversity-count)*fitnesses[i]/value){
                    parents.push(this.population[i].copy())
                    ranks.push(fitnesses[i])
                    if (count == diversity-1){
                        break;
                    }
                    count ++;
                }
                value -= fitnesses[i];
            }
            //loop through parents
            for (let i = 0; i < this.number-elitists; i++) {
                //generate random number
                let r = Math.random()
                //find where number "fits"
                if ((r -= mutation_rate) <= 0) {
                    //add mutated child
                    next_generation.push(parents[i%parents.length].mutate(0.2))
                } else if (r < crossover_rate) {
                    //add crossed-over child
                    let k = Math.floor(Math.random() * (parents.length - 1))
                    k >= i ? k++ : k;
                    next_generation.push(Genetic_Neural_Network.crossover(parents[i%parents.length], parents[k], ranks[i%parents.length] / (ranks[i%parents.length] + ranks[k])).mutate(0.01))
                } else {
                    //add copy
                    next_generation.push(parents[i%parents.length].replicate())
                }
            }
            //move onto next generation
            this.generation++;
            this.population = next_generation
        }
    }
    static from_string(generation,n=0) {
        //create new population
        let population = new Population(generation.length, generation[0].inputs, generation[0].length, generation[0].width, generation.outputs, generation.activation_function_name)
        //fill in population
        population.population = generation.map(x => Genetic_Neural_Network.from_string(x))
        population.generation = n
        return population
    }
}
