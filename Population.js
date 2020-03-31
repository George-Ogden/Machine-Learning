class Population{
    constructor(number,     inputs,        hidden_layers,        layer_thickness,        outputs,        activation_function){
        //define population
        this.populations = [[]];
        this.generation = 0;
        this.number = number
        for (let i = 0; i < number; i++){
            //add genetic neural network
            this.populations[0].push(new Genetic_Neural_Network( inputs,        hidden_layers,        layer_thickness,        outputs,        activation_function));
        }
        this.population = this.populations[0]
    }
    apply(func){
        return this.population.map(func);
    }
    fitness(data_set){
        this.sort(data_set)
        return this.population.reduce((a,b) => a + 1/b.cost(data_set), 0)/this.number
    }
    fitnesses(data_set){
        let fitness = this.fitness(data_set)*this.number;
        return this.apply(network => (1/network.cost(data_set))/fitness)
    }
    forward_propagate(inputs){
        return this.apply(network => network.forward_propagate(inputs))
    }
    sort(data_set){
        this.population = this.population.sort((a,b) => a.cost(data_set)-b.cost(data_set))   
    }
    reproduce(generations,data_set, elitists=1, mutation_rate=0.4, crossover_rate=0.5){
        for (let n = 0; n < generations; n++){
            this.sort(data_set)
            let fitnesses = this.fitnesses(data_set)
            let next_generation = this.population.slice(0,elitists)
            let parents = [];
            
            for (let i = 0; i < this.number-elitists; i++){
                let r = Math.random();
                for (let j = 0; j < this.number; j ++){
                    if ((r -= fitnesses[j]) <= 0){
                        parents.push(this.population[j].copy())
                        break
                    }
                }
            }
            for (let i = 0; i < parents.length; i++){
                let r = Math.random()
                if ((r-=mutation_rate) <= 0){
                    next_generation.push(this.population[i].mutate())
                } else if (r < crossover_rate){
                    let k = Math.floor(Math.random()*(parents.length-1))
                    k >= i ? k ++ : k;
                    next_generation.push(Genetic_Neural_Network.crossover(this.population[i],this.population[k],fitnesses[i]/(fitnesses[i]+fitnesses[k])).mutate(0.01))
                } else {
                    next_generation.push(this.population[i].replicate())
                }
            }
            
            this.generation ++;
            this.population = next_generation
            this.populations.push(this.population) 
            //console.log(p.populations[p.generation][0].cost(data_set),p.generation)
        }
    }
}