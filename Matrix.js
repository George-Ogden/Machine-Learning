class Matrix {
    constructor(rows = 0, columns = 0){
      this.data = [];
      this.rows = rows;
      this.cols = columns;
      //initialise matrix with vector of 0s
      for (let i = 0; i < rows; i++){
        this.data.push([]);
        for (let j = 0; j < columns; j++){
          this.data[i].push(1);
        }
      }
      //randomise values
      this.randomise();
    }
  
    static fromArray(array){
      //crete a new matrix
      let new_matrix = new Matrix(array.length, array[0].length);
      //copy data
      new_matrix.data = array;
      //return new matrix
      return new_matrix;
    }
  
    toArray(array){
      //return data
      return this.data;
    }
  
    set(matrix){
      this.rows = matrix.rows;
      this.cols = matrix.cols;
      this.data = matrix.data;
    }
  
    show(){
      //use console.table() to print matrix neatly
      console.table(this.data);
      return this.data;
    }
  
    map(func, matrix = null){
      if (matrix){
        //initialise new matrix
        let new_matrix = new Matrix(this.rows, this.cols);
        //loop through rows and columns
        for (let i = 0; i < this.rows; i++){
          for (let j = 0; j < this.cols; j++){
            //apply a function based on both matrices' data
            new_matrix.data[i][j] = func(this.data[i][j], matrix.data[i][j]);
          }
        }
        //return new matrix
        return new_matrix;
      }
      //loop through rows and columns
      for (let i = 0; i < this.rows; i++){
        for (let j = 0; j < this.cols; j++){
          //apply a function based on the matrix's data
          this.data[i][j] = func(this.data[i][j]);
        }
      }
    }
  
    static map(matrix, func){
      //initialise new matrix
      let new_matrix = Matrix.fromArray(matrix.data);
      //apply function
      new_matrix.map(func);
      //return new matrix
      return new_matrix;
    }
  
    randomise(){
      //apply a random function from 0-1 to each element
      this.map(Math.random);
    }
  
    reset(n=0){
      //apply a random function from 0-1 to each element
      this.map(x => n);
    }
  
    transpose(){
      //use static method
      this.set(Matrix.transpose(this));
    }
  
    static transpose(matrix){
      //create a new matrix that will be returned
      let image = new Matrix(matrix.cols, matrix.rows);
      //loop through rows and columns
      for (let i = 0; i < matrix.rows; i++){
        for (let j = 0; j < matrix.cols; j++){
          //flip rows and columns
          image.data[j][i] = matrix.data[i][j];
        }
      }
      //return image
      return image;
    }
  
    static add(matrix1, matrix2){
      //add two values
      return matrix1.map((x, y) => x + y, matrix2);
    }
  
    add(matrix){
      //use static method
      this.set(Matrix.add(this, matrix));
    }
  
    static subtract(matrix1, matrix2){
      //subtract two values
      return matrix1.map((x, y) => x - y, matrix2);
    }
  
    subtract(matrix){
      //use static method
      this.set(Matrix.subtract(this, matrix));
    }
  
    multiply(n){
      if (typeof n == "number"){
        //scalar product
        this.map(x => x * n);
      } else {
        //Hadamard product
        this.set(this.map((x, y) => x * y, n));
      }
    }
  
    static multiply(matrix, n){
      //use non-static method
      let new_matrix = Matrix.fromArray(matrix.data)
      new_matrix.multiply(n)
      return new_matrix
    }
  
    static dot(matrix1, matrix2){
      if ((matrix1.cols = matrix2.rows)){
        //initialise new matrix with columns of this and rows of that
        let new_matrix = new Matrix(matrix1.rows, matrix2.cols);
        //loop through rows and columns
        for (let i = 0; i < new_matrix.rows; i++){
          for (let j = 0; j < new_matrix.cols; j++){
            //initialise with no value
            let value = 0;
            for (let k = 0; k < matrix1.cols; k++){
              //add on the sum of each row-column product
              value += matrix1.data[i][k] * matrix2.data[k][j];
            }
            new_matrix.data[i][j] = value;
          }
        }
        return new_matrix;
      } 
    }
  
    dot(matrix){
      //use static method
      this.set(Matrix.dot(this, matrix));
    }
  
    rss(){
      //initialise with no value
      let value = 0;
      for (let i = 0; i < this.rows; i++){
        for (let j = 0; j < this.cols; j++){
          //add each element squared
          value += this.data[i][j] * this.data[i][j];
        }
      }
      //return value
      return value;
    }
  
    sum(){
      //calculate sum of elements
      return this.data.reduce((x, y) => x + y.reduce((x, y) => x + y),0);
  
      //initialise with no value
      let value;
  
      for (let i = 0; i < this.rows; i++){
        for (let j = 0; j < this.cols; j++){
          //add each element
          value += this.data[i][j];
        }
      }
      //return value
      return value;
    }
  
    static flatten(matrix){
      //initialise new matrix
      let new_matrix = new Matrix(1, matrix.rows * matrix.cols);
      //loop through rows and columns
      for (let i = 0; i < matrix.rows; i++){
        for (let j = 0; j < matrix.cols; j++){
          //insert each element into the new array
          new_matrix.data[0][i * matrix.cols + j] = matrix.data[i][j];
        }
      }
      //return new matrix
      return new_matrix;
    }
  
    flatten(){
      //use static method
      this.set(Matrix.flatten(this));
    }
  
    subsection(x, y, w, h){
      //initialise new matrix
      let new_matrix = new Matrix(h, w);
      //loop through rows and columns
      for (let i = y; i < y + h; i++){
        for (let j = x; j < x + w; j++){
          //flatten
          new_matrix.data[i - y][j - x] = this.data[i][j];
        }
      }
      //return new matrix
      return new_matrix;
    }

    static build(matrix, rows, cols){
      //initialise new matrix
      let new_matrix = new Matrix(rows, cols);
      //loop through rows and columns
      for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
          //rebuild
          new_matrix.data[i][j] = matrix.data[0][i * cols + j];
        }
      }
      //return new matrix
      return new_matrix;
    }

    build(rows, cols){
	    //use static method
	    this.set(Matrix.build(this, rows, cols));
    }
  
    copy(){
      return Matrix.fromArray(this.data);
    }

    static pad(matrix,rows=1,cols=1){
      //create new, blank, expanded matrix
      let new_matrix = new Matrix(matrix.rows + 2*rows, matrix.cols + 2*cols)
      new_matrix.reset();
      //loop through rows and columns
      for (let i = 0; i < matrix.rows; i ++){
        for (let j = 0; j < matrix.cols;  j++){
          //insert data
          new_matrix.data[i+rows][j+cols] = matrix.data[i][j]
        }
      }
      //return new matrix
      return new_matrix
    }
    
    pad(rows=1,cols=1){
      //use static method
      this.set(Matrix.pad(this,rows,cols))
    }
    
    static flip(matrix){
      //create new matrix with same directions
      let new_matrix = new Matrix(matrix.rows, matrix.cols);
      //loop through rows and columns
      for (let i = 0; i < matrix.rows; i ++){
        for (let j = 0; j < matrix.cols;  j++){
          //flip data
          new_matrix.data[i][j] = matrix.data[matrix.rows-i-1][matrix.cols-j-1]
        }
      }
      //return new matrix
      return new_matrix
    }

    flip(){
      this.set(Matrix.flip(this));
    }
  }

  let x = new Matrix(3,4)