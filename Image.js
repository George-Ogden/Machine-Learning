
class Image_from_src {
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
        this.resize(256,256)
        let x = new Image_from_data(this.prepare(),"a")
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

    prepare(){
        return [this.red,this.green,this.blue]
    }
}
class BW_Image_from_src extends Image_from_src{
    constructor(src=""){
        super(src)
        console.log(2)
    }
    onload(image){
        console.log(1)
        //declare image
        this.image = image;

        //calculate width and height
        this.width = image.width;
        this.height = image.height;

        //create colour matrices
        this.black = new Matrix(this.width,this.height);

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
                this.black.data[i][j] = pixelData.data[4*(i*this.height+j)]*.21 + pixelData.data[4*(i*this.height+j)+1]*.72 + pixelData.data[4*(i*this.height+j)+2]*.07;
                pixelData.data[4*(i*this.height+j)] = this.black.data[i][j]*.21
                pixelData.data[4*(i*this.height+j)+1] = this.black.data[i][j]*.72
                pixelData.data[4*(i*this.height+j)+2] = this.black.data[i][j]*.07;
            }
        }
        //now loaded
        this.loaded = true;
        this.show()
        this.resize(256,256)
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
        this.black = new Matrix(this.width,this.height);

        let pixelData = this.context.getImageData(0,0,this.width,this.height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++){
                this.black.data[i][j] = pixelData.data[4*(i*this.height+j)]*.21 + pixelData.data[4*(i*this.height+j)+1]*.72 + pixelData.data[4*(i*this.height+j)+2]*.07;
                pixelData.data[4*(i*this.height+j)] = this.black.data[i][j]
                pixelData.data[4*(i*this.height+j)+1] = this.black.data[i][j]
                pixelData.data[4*(i*this.height+j)+2] = this.black.data[i][j];
            }
        }
        this.context.putImageData(pixelData,0,0)
    }

    static from_string(dict){
        let image = new Image_();
        //copy attributes
        image.src = dict.src
        image.loaded = dict.loaded;
        image.image = dict.image;
        image.width = dict.width;
        image.height = dict.height;
        image.black = dict.black
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
        copy.black = this.black
        copy.canvas = this.canvas;
        return copy;
    }

    prepare(){
        return [this.black]
    }
}


class Image_from_data {
    constructor(data,label){
        //save data
        this.red = data[0] instanceof Matrix ? data[0] : Matrix.fromArray(data[0])
        this.green = data[1] instanceof Matrix ? data[1] : Matrix.fromArray(data[1])
        this.blue = data[2] instanceof Matrix ? data[2] : Matrix.fromArray(data[2])
        //calculate width and height
        this.width = this.red.cols;
        this.height = this.red.rows;

        //create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.data = this.context.createImageData(256,256)
        for (let i = 0; i < this.width; i ++){
            for (let j = 0; j < this.height; j ++){
                this.data.data[4*(i*this.height+j)] = this.red.data[i][j]
                this.data.data[4*(i*this.height+j)+1] = this.green.data[i][j]
                this.data.data[4*(i*this.height+j)+2] = this.blue.data[i][j]
                this.data.data[4*(i*this.height+j)+3] = 255
            }
        }
        this.label = label


        //create context
        this.context.putImageData(this.data,0,0)
        this.show()
        //this.resize(256,256)
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
        this.black = new Matrix(this.width,this.height);

        let pixelData = this.context.getImageData(0,0,this.width,this.height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++){
                this.black.data[i][j] = pixelData.data[4*(i*this.height+j)]*.21 + pixelData.data[4*(i*this.height+j)+1]*.72 + pixelData.data[4*(i*this.height+j)+2]*.07;
                pixelData.data[4*(i*this.height+j)] = this.black.data[i][j]
                pixelData.data[4*(i*this.height+j)+1] = this.black.data[i][j]
                pixelData.data[4*(i*this.height+j)+2] = this.black.data[i][j];
            }
        }
        this.context.putImageData(pixelData,0,0)
    }

    static from_string(dict){
        let image = new Image_();
        //copy attributes
        image.src = dict.src
        image.loaded = dict.loaded;
        image.image = dict.image;
        image.width = dict.width;
        image.height = dict.height;
        image.black = dict.black
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
        copy.black = this.black
        copy.canvas = this.canvas;
        return copy;
    }

    prepare(){
        return [this.black]
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


let image = new Image_from_src("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Ecosia-like_logo.png/220px-Ecosia-like_logo.png");