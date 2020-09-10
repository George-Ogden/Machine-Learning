const Matrix = require("./Matrix.js");
const fs = require("fs")
const Gamer = require("./Gamer.js");
const Noughts_and_Crosses = require("./Noughts_and_Crosses.js");
const Population = require("./Population.js");
const Genetic_Fully_Connected_Neural_Network = require("./GFCNN.js");
const Genetic_Combined_Network = require("./Genetic Combined Network.js");
const Umpire = require("./Umpire.js");
class Gamers extends Population {
    constructor(number, umpire, hidden_layers, layer_thickness) {
        //create networks with parameters
        super(number, umpire.size * umpire.size, umpire, hidden_layers, layer_thickness, "tanh")
        //initialise score of 0
        this.apply(gamer => gamer.score = 0);
    }
    seed(elitists=1) {
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
                        let result = this.umpire.play(new Gamer(this.population[i], this.umpire,1), new Gamer(this.population[j],this.umpire,1))
                        //update scores
                        this.population[i].score += result
                        this.population[j].score -= result
                    }
                }
            }
        }
    }
    order(elitists=1){
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
    reproduce(n=1, elitists=1){
        for (let i = 0; i < n; i++){
            this.seed(elitists)
            super.reproduce(1, elitists,2)
        }
    }
    static from_string(generation,n=0) {
        //create new population
        let gamers = new Gamers(generation.number,new Umpire(generation.umpire.size),1, 1)
        //fill in population
        gamers.population = generation.population.map(gamer => Genetic_Combined_Network.from_string(gamer))
        gamers.generation = n;

        return gamers
    }
    static load(name=type){
        return Gamers.from_string(eval("(" + fs.readFileSync(name+".json").toString() + ")"))
    }
    save(name = this.type){
        fs.writeFileSync(name+".json",JSON.stringify(this))
    }
      
}
const umpire = new Noughts_and_Crosses(7, 4);
//let p = new Gamers(100,umpire,1,5)
let p = Gamers.load("players")
let x = 0
while (true){
    p.reproduce(5)
    p.save("players")
    console.log(x+=5)
}