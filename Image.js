class Image_ {
    constructor(label, type) {
        //add label
        this.label = label;
        //add type
        this.type = type;
    }

    show() {
        //add to document
        document.body.appendChild(this.canvas);
    }

    hide() {
        //remove from document
        document.body.removeChild(this.canvas);
    }
}

class Image_colour extends Image_ {
    constructor(label, type) {
        //use super constructor
        super(label, type)
    }

    shrink(width, height) {
        //find offset
        let x = 0
        let y = 0
        let sf = width / this.width
        if (width / height > this.width / this.height) {
            sf = height / this.height
            //crop x
            x = Math.round((width - this.width * sf) / 2)
        } else if (width / height < this.width / this.height) {
            //crop y
            y = Math.round((height - this.height * sf) / 2)
        }

        //redraw smaller image
        this.context.drawImage(this.canvas, x, y, this.width * sf, this.height * sf);

        //find width and height
        this.width = width
        this.height = height

        //redefine data
        this.red = new Matrix(this.height, this.width)
        this.green = new Matrix(this.height, this.width)
        this.blue = new Matrix(this.height, this.width)
        this.data = this.context.getImageData(0, 0, this.width, this.height)
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.red.data[i][j] = this.data.data[4 * (i * this.height + j)]
                this.green.data[i][j] = this.data.data[4 * (i * this.height + j) + 1]
                this.blue.data[i][j] = this.data.data[4 * (i * this.height + j) + 2]
            }
        }
        //update canvas
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context.putImageData(this.data, 0, 0)
    }

    static from_string(dict) {
        //define image
        let image = new dict.type();
        //copy attributes
        image.src = dict.src
        image.label = dict.label
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

    copy() {
        //create an image from string
        return Image_colour.from_string(eval(JSON.stringify(this)));
    }

    prepare() {
        //return data
        return [this.red.copy(), this.green.copy(), this.blue.copy()]
    }

    prepare_bw() {
        //return black matrix
        return Matrix.add(Matrix.add(Matrix.multiply(this.red, .21), Matrix.multiply(this.green, .72)), Matrix.multiply(this.blue, .07))
    }
}

class Image_BW extends Image_ {
    constructor(label, type) {
        super(label, type)
    }

    shrink(width, height) {
        //find offset
        let x = 0
        let y = 0
        let sf = width / this.width
        if (width / height > this.width / this.height) {
            sf = height / this.height
            //crop x
            x = Math.round((width - this.width * sf) / 2)
        } else if (width / height < this.width / this.height) {
            //crop y
            y = Math.round((height - this.height * sf) / 2)
        }

        //redraw smaller image
        this.context.drawImage(this.canvas, x, y, this.width * sf, this.height * sf);

        //find width and height
        this.width = width
        this.height = height

        //redefine data
        this.black = new Matrix(this.height, this.width)
        this.data = this.context.getImageData(0, 0, this.width, this.height)
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.black.data[i][j] = this.data.data[4 * (i * this.height + j)] * .21 + this.data.data[4 * (i * this.height + j) + 1] * .72 + this.data.data[4 * (i * this.height + j) + 2] * .07;
                this.data.data[4 * (i * this.height + j)] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 1] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 2] = this.black.data[i][j];
            }
        }
        //update canvas
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context.putImageData(this.data, 0, 0)
    }

    static from_string(dict) {
        let image = new dict.type();
        //copy attributes
        image.src = dict.src
        image.label = dict.label
        image.loaded = dict.loaded;
        image.image = dict.image;
        image.width = dict.width;
        image.height = dict.height;
        image.black = dict.black
        image.canvas = dict.canvas;
        return image;
    }

    copy() {
        //create an image from string
        return Image_BW.from_string(eval(JSON.stringify(this)));
    }

    prepare() {
        //return data
        return [this.black.copy()]
    }

    prepare_colour() {
        //return black matrix
        return [this.black.copy(), this.black.copy(), this.black.copy()]
    }
}

class Image_from_src extends Image_colour {
    constructor(src = "", label = "") {
        super(label, Image_from_src);
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

    onload(image) {
        //declare image
        this.image = image;

        //calculate width and height
        this.width = image.width;
        this.height = image.height;

        //create colour matrices
        this.red = new Matrix(this.width, this.height);
        this.green = new Matrix(this.width, this.height);
        this.blue = new Matrix(this.width, this.height);

        //create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        //create context
        this.context = this.canvas.getContext('2d');
        this.context.drawImage(image, 0, 0);
        //convert pixel data to rgb matrices
        this.data = this.context.getImageData(0, 0, this.width, this.height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.red.data[i][j] = this.data.data[4 * (i * this.height + j)];
                this.green.data[i][j] = this.data.data[4 * (i * this.height + j) + 1];
                this.blue.data[i][j] = this.data.data[4 * (i * this.height + j) + 2];
            }
        }
        //now loaded
        this.loaded = true;
        this.show()
    }

}

class BW_Image_from_src extends Image_BW {
    constructor(src = "", label = "") {
        super(label, BW_Image_from_src)

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

    onload(image) {
        //declare image
        this.image = image;

        //calculate width and height
        this.width = image.width;
        this.height = image.height;

        //create colour matrices
        this.black = new Matrix(this.width, this.height);

        //create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        //create context
        this.context = this.canvas.getContext('2d');
        this.context.drawImage(image, 0, 0);

        //convert pixel data to rgb matrices
        this.data = this.context.getImageData(0, 0, this.width, this.height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.black.data[i][j] = this.data.data[4 * (i * this.height + j)] * .21 + this.data.data[4 * (i * this.height + j) + 1] * .72 + this.data.data[4 * (i * this.height + j) + 2] * .07;
                this.data.data[4 * (i * this.height + j)] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 1] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 2] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 3] = 255
            }
        }
        this.context.putImageData(this.data, 0, 0)
        //now loaded
        this.loaded = true;
        this.show()
    }
}

class Image_from_data extends Image_colour {
    constructor(data, label = "") {
        super(label, Image_from_data);
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

        this.data = this.context.createImageData(this.width, this.height)
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.data.data[4 * (i * this.height + j)] = this.red.data[i][j]
                this.data.data[4 * (i * this.height + j) + 1] = this.green.data[i][j]
                this.data.data[4 * (i * this.height + j) + 2] = this.blue.data[i][j]
                this.data.data[4 * (i * this.height + j) + 3] = 255
            }
        }

        //create context
        this.context.putImageData(this.data, 0, 0)

        //show
        this.show()
    }
}

class BW_Image_from_data extends Image_BW {
    constructor(data, label = "") {
        super(label, BW_Image_from_data);
        //save data
        this.black = data instanceof Matrix ? data : Matrix.fromArray(data);
        //calculate width and height
        this.width = this.black.cols;
        this.height = this.black.rows;

        //create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.data = this.context.createImageData(this.width, this.height)
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.data.data[4 * (i * this.height + j)] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 1] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 2] = this.black.data[i][j]
                this.data.data[4 * (i * this.height + j) + 3] = 255
            }
        }


        //create context
        this.context.putImageData(this.data, 0, 0)
        this.show()
    }
}
let image = new Image_from_src("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Ecosia-like_logo.png/220px-Ecosia-like_logo.png");
module.exports = {
    "image":Image_,
    "src":Image_from_src,
    "data":Image_from_data,
    "colour":Image_colour,
    "bw":Image_BW,
    "bw_src":BW_Image_from_src,
    "bw_data":BW_Image_from_data,
    "eco":image
}