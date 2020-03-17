class Flatten extends Neural_Network{
    constructor(x,y){
        super("Flatten","identity",1)
		this.x = x;
		this.y = y;
		this.colours = 3
    }
	forward_propagate(pixel_data){
		console.log(pixel_data)
        //create output
        let output = new Matrix(1,this.x*this.y*this.colours)
        //loop through layers
        for (let i = 0; i < this.colours; i++){
			for (let x = 0; x < this.x; x++){
				for (let y = 0; y < this.y; y++){
					output.data[0][i*this.x*this.y + x * this.y + y] = pixel_data[i].data[y][x]
				}
			}
		}
		return output
	}
	backward_propagate(error){
		//define gradient
		let gradient = []
		//loop through colours
        for (let i = 0; i < this.colours; i++){
			//add to gradient
			gradient.push(new Matrix(this.y,this.x))
			//loop through data
			for (let x = 0; x < this.x; x++){
				for (let y = 0; y < this.y; y++){
					gradient[i].data[y][x] = error.data[0][i*this.x*this.y + x * this.y + y]
				}
			}
		}
        return gradient
    }
	static fromString(dict){
		//create new network
		let network = new Flatten(this.x,this.y)
		return network
	}
	copy(){
		return Flatten.fromString(this);
	}
}