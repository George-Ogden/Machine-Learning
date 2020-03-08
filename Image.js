
class Image_ {
    constructor(src=""){
        //create actual image object
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = src;
        image.addEventListener("load", () => this.onload(image));
        
        //save src
        this.src = src

        //not yet loaded
        this.loaded = false;
    }

    onload(image){
        //declare image
        this.image = image;

        //calculate width and height
        this.width = image.width;
        this.height = image.height;

        //create colour matrices
        this.red = new Matrix(this.width,this.height);
        this.green = new Matrix(this.width,this.height);
        this.blue = new Matrix(this.width,this.height);

        //create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        //create context
        this.context = this.canvas.getContext('2d');
        this.context.drawImage(image, 0, 0);

        //convert pixel data to rgb matrices
        let pixelData = this.context.getImageData(0,0,this.width,this.height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++){
                this.red.data[i][j] = pixelData.data[4*(i*this.height+j)];
                this.green.data[i][j] = pixelData.data[4*(i*this.height+j)+1];
                this.blue.data[i][j] = pixelData.data[4*(i*this.height+j)+2];
            }
        }
        //now loaded
        this.loaded = true;
        this.show()
        this.resize(100,100)
    }

    resize(width,height){
        let x = 0
        let y = 0
        let sf = width/this.width
        if (width/height > this.width/this.height){
            sf =  height/this.height
            //crop x
            x = Math.round((width-this.width*sf)/2)
        } else if (width/height < this.width/this.height){
            //crop y
            y = Math.round((height-this.height*sf)/2)
        }
        //change canvas size
        this.canvas.width = width;
        this.canvas.height = height;
        //clear canvas
        this.context.clearRect(0, 0, this.width, this.height);
        //change image
        this.context.drawImage(this.image, x, y, this.width*sf, this.height*sf);

        //update variables
        this.width = width;
        this.height = height;
        this.red = new Matrix(this.width,this.height);
        this.green = new Matrix(this.width,this.height);
        this.blue = new Matrix(this.width,this.height);
        let pixelData = this.context.getImageData(0,0,this.width,this.height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++){
                this.red.data[i][j] = pixelData.data[4*(i*this.height+j)];
                this.green.data[i][j] = pixelData.data[4*(i*this.height+j)+1];
                this.blue.data[i][j] = pixelData.data[4*(i*this.height+j)+2];
            }
        }
    }

    static from_string(dict){
        let image = new Image_();
        //copy attributes
        image.src = dict.src
        image.loaded = dict.loaded;
        image.image = dict.image;
        image.width = dict.width;
        image.height = dict.height;
        image.red = dict.red
        image.green = dict.red
        image.blue = dict.blue
        image.canvas = dict.canvas;
        return image;
    }

    copy(){
        let copy = new Image_();
        //copy attributes
        copy.src = this.src
        copy.loaded = this.loaded;
        copy.image = this.image;
        copy.width = this.width;
        copy.height = this.height;
        copy.red = this.red
        copy.green = this.red
        copy.blue = this.blue
        copy.canvas = this.canvas;
        return copy;
    }

    show(){
        //add to document
        document.body.appendChild(this.canvas);
    }
    hide(){
        //remove from document
        document.body.removeChild(this.canvas);
    }
}

let image = new Image_("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Ecosia-like_logo.png/220px-Ecosia-like_logo.png");