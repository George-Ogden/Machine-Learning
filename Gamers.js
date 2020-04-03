class Gamers extends Population {
    constructor(number, board_size, hidden_layers, layer_thickness) {
        //create networks with parameters
        super(number, board_size * board_size, hidden_layers, layer_thickness, board_size * board_size, "tanh")
        //initialise score of 0
        this.apply(gamer => gamer.score = 0);
        //redefine cost function
        this.apply(gamer => gamer.cost = () => gamer.score == 0 ? number : 1 / gamer.score);
    }
    seed(umpire) {
        //reset scores
        this.apply(gamer => gamer.score = 0);
        this.apply(gamer => gamer.cost = () => gamer.score == 0 ? number : 1 / gamer.score);
        //play round robin tournament
        for (let i = 0; i < this.number; i++) {
            for (let j = 0; j < this.number; j++) {
                if (i != j) {
                    let result = JSON.stringify(umpire.play(this.population[i], this.population[j]))
                    const table1 = {"0":2,"1":3,"-1":0}
                    const table2 = {"0":2,"1":0,"-1":3}
                    //update scores
                    this.population[i].score += table1[result]
                    this.population[j].score += table2[result]
                }
            }
        }
    }

    reproduce(umpire, n=1){
        for (let i = 0; i < n; i++){
            this.seed(umpire)
            super.reproduce()
        }
    }
    static from_string(generation) {
        //create new population
        let gamers = new Gamers(generation.length, Math.sqrt(generation[0].inputs), generation[0].length, generation[0].width)
        //reset population
        gamers.population = generation.map(gamer => Genetic_Neural_Network.from_string(gamer))
        return gamers
    }
}
let g = new Gamers(20, 11, 3, 50)
let umpire = new Hex()
/*
g.seed(umpire)
g.sort()
for (let i = 0; i < 5; i++){
    console.log(umpire.challenge(g.population[i]))
}
*/

console.log(g.populations[g.generation][0].score, g.generation)
for (let i = 0; i < 5; i++) {
    g.reproduce(umpire)
    console.log(g.populations[g.generation][0].score,g.generation)
}
document.body.innerHTML = JSON.stringify(g.populations[g.generation])
