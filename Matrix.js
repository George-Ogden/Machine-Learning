class Matrix {
    constructor(rows = 0, columns = 0) {
        this.data = [];
        this.rows = rows;
        this.cols = columns;
        //initialise matrix with vector of 0s
        for (let i = 0; i < rows; i++) {
            this.data.push([]);
            for (let j = 0; j < columns; j++) {
                this.data[i].push(1);
            }
        }
        //randomise values
        this.randomise();
    }

    static fromArray(array) {
        //crete a new matrix
        let new_matrix = new Matrix(array.length, array[0].length);
        //copy data
        new_matrix.data = array;
        //return new matrix
        return new_matrix;
    }

    toArray(array) {
        //return data
        return this.data;
    }

    set(matrix) {
        matrix = Matrix.fromArray(matrix.data)
        this.rows = matrix.rows;
        this.cols = matrix.cols;
        this.data = matrix.data;
    }

    show() {
        //use console.table() to print matrix neatly
        console.table(this.data);
        return this.data;
    }

    map(func, matrix = null) {
        if (matrix) {
            //initialise new matrix
            let new_matrix = new Matrix(this.rows, this.cols);
            //loop through rows and columns
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    //apply a function based on both matrices' data
                    new_matrix.data[i][j] = func(this.data[i][j], matrix.data[i][j]);
                }
            }
            //return new matrix
            return new_matrix;
        }
        //loop through rows and columns
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                //apply a function based on the matrix's data
                this.data[i][j] = func(this.data[i][j]);
            }
        }
    }

    static map(matrix, func) {
        //initialise new matrix
        let new_matrix = matrix.copy()
        //apply function
        new_matrix.map(func);
        //return new matrix
        return new_matrix;
    }

    randomise() {
        //apply a random function from 0 to 1 to each element
        this.map(Math.random);
    }

    reset(n = 0) {
        //set everything to a predefined value
        this.map(() => n);
    }

    transpose() {
        //use static method
        this.set(Matrix.transpose(this));
    }

    static transpose(matrix) {
        //create a new matrix that will be returned
        let image = new Matrix(matrix.cols, matrix.rows);
        //loop through rows and columns
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                //rotate rows and columns
                image.data[j][i] = matrix.data[i][j];
            }
        }
        //return image
        return image;
    }

    static add(matrix1, matrix2) {
        //add two values
        return matrix1.map((x, y) => x + y, matrix2);
    }

    add(matrix) {
        //use static method
        this.set(Matrix.add(this, matrix));
    }

    static subtract(matrix1, matrix2) {
        //subtract two values
        return matrix1.map((x, y) => x - y, matrix2);
    }

    subtract(matrix) {
        //use static method
        this.set(Matrix.subtract(this, matrix));
    }

    multiply(n) {
        if (typeof n == "number") {
            //scalar product
            this.map(x => x * n);
        } else {
            //Hadamard product
            this.set(this.map((x, y) => x * y, n));
        }
    }

    static multiply(matrix, n) {
        //use non-static method
        let new_matrix = matrix.copy()
        new_matrix.multiply(n)
        return new_matrix
    }

    static dot(matrix1, matrix2) {
        if ((matrix1.cols = matrix2.rows)) {
            //initialise new matrix with columns of this and rows of that
            let new_matrix = new Matrix(matrix1.rows, matrix2.cols);
            //loop through rows and columns
            for (let i = 0; i < new_matrix.rows; i++) {
                for (let j = 0; j < new_matrix.cols; j++) {
                    //initialise with no value
                    let value = 0;
                    for (let k = 0; k < matrix1.cols; k++) {
                        //add on the sum of each row-column product
                        value += matrix1.data[i][k] * matrix2.data[k][j];
                    }
                    new_matrix.data[i][j] = value;
                }
            }
            return new_matrix;
        }
    }

    dot(matrix) {
        //use static method
        this.set(Matrix.dot(this, matrix));
    }

    rss() {
        //return each element squared
        return this.data.reduce((x, y) => x + y.reduce((x, y) => x + y * y, 0), 0);
    }

}