class Gamers extends Population {
    constructor(number, board_size, hidden_layers, layer_thickness,output = board_size*board_size) {
        //create networks with parameters
        super(number, board_size * board_size, hidden_layers, layer_thickness, output, "tanh")
        //initialise score of 0
        this.apply(gamer => gamer.score = 0);
        //redefine cost function
        this.apply(gamer => gamer.cost = () => gamer.score == 0 ? number : 1 / gamer.score);
    }
    seed(umpire, elitists=1) {
        //reset scores
        this.apply(gamer => gamer.score = 0);
        this.apply(gamer => gamer.cost = () => gamer.score == 0 ? number : 1 / gamer.score);
        this.population = Umpire.shuffle(this.population)
        let blank = new Matrix(7,7)
        blank.reset()
        //play round group stages tournament
        for (let k = 0; k < elitists; k++){
            for (let i = Math.floor(k*this.number/elitists); i < Math.floor((k+1)*this.number/elitists); i++) {
                for (let j = Math.floor(k*this.number/elitists); j < Math.floor((k+1)*this.number/elitists); j++) {
                    if (i != j) {
                        //umpire handles game
                        let result = umpire.play(this.population[i], this.population[j])
                        const table1 = {"0":2,"1":3,"-1":0}
                        const table2 = {"0":2,"1":0,"-1":3}
                        //update scores
                        this.population[i].score += table1[result]
                        this.population[j].score += table2[result]
                    }
                }
            }
        }
    }
    order(blank=null, elitists=1){
        //declare blank generation
        let next_generation = []
        for (let i = 0; i < elitists; i++){
            //sort each sub-group
            this.population.splice.apply(this, [Math.floor(i*this.number/elitists)].concat([Math.floor((i+1)*this.number/elitists)-Math.floor(i*this.number/elitists)].concat(this.population.slice(Math.floor(i*this.number/elitists),  Math.floor((i+1)*this.number/elitists)-Math.floor(i*this.number/elitists)).sort((a,b) => b.score-a.score))))
            next_generation.push(this.population[Math.floor(i*this.number/elitists)])
        }
        //return details
        return [this.apply(x => Math.pow(x.score,2)), next_generation]
    }
    reproduce(umpire, n=1, elitists=1){
        let date = new Date()
        for (let i = 0; i < n; i++){
            this.seed(umpire, elitists)
            super.reproduce(null, 1, elitists)
        }
    }
    static from_string(generation,n=0) {
        //create new population
        let gamers = new Gamers(generation.length, Math.sqrt(generation[0].inputs), generation[0].length, generation[0].width)
        //fill in population
        gamers.population = generation.map(gamer => Genetic_Neural_Network.from_string(gamer))
        gamers.generation = n;

        return gamers
    }
}
