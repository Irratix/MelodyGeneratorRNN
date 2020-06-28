class Matrix {
	
	//basic syntax:
	/*
		to make a new matrix use `new Matrix()
		parameters are either an array, a 2d array, or two numbers indicating the size of the matrix
		
		to set all values in a matrix to 0 use myMatrix.setZeroes()
		
		to set all values in a matrix to a random value from 0 to 1 use myMatrix.setRandom()
		
		to multiply two matrices use matrixA.mult(matrixB)
		this returns a new matrix and does not change either input matrix
		
		to add two matrices use matrixA.add(matrixB)
		this returns a new matrix and does not change either input matrix
		
		to scale all values in a matrix by some number use myMatrix.scale(number)
		this returns a new matrix and does not change the current matrix
		
		to apply a function to all values in a matrix use myMatrix.withFunction(f)
		this returns a new matrix and does not change the current matrix
		parameter f is any function that returns a valid number
		parameters of the function are the current value, the x index, and the y index
	*/
	
	constructor(m, n) {
		//several cases:
		if (typeof m == "number") {
			//1- sizes are given: initialize an empty array with given sizes
			this.constructBySize(m,n);
		} else if (Array.isArray(m)) {
			//2- input array is given, just turn it into matrix
			this.constructByArray(m);
		} else {
			//3- unknown type, just set to null
			throw`Error: invalid declaration of matrix: incompatible parameters`;
			return;
		}
	}
	
	//a vector was given, turn it into a valid matrix
	constructAsVector(m) {
		this.width = this.m = 1;
		this.height = this.n = m.length;
		this.matrix = [];
		this.matrix[0] = [];
		for (let i=0; i<m.length; i++) {
			this.matrix[0][i] = Number(m[i]);
		}
	}
	
	//a 2D array was given, turn it into a valid matrix
	constructAsMatrix(m) {
		//do some type validity checks
		if (typeof m[0][0] == "bigint") {
			//just a warning, but continue
			console.log`WARNING: BigInts in matrix will be converted to Number primitive`;
		} else if (typeof Number(m[0][0]) != "number") {
			//known incompatible type, just halt
			throw`Error: invalid declaration of matrix: inconsistent types in array object`;
			return;
		}
		//check for maximum height
		let length = 0;
		for (let i of m) {
			i.length>length?length=i.length:0;
		}
		//now set the array. make sure to set empty entries to 0
		this.width = this.m = m.length;
		this.height = this.n = length;
		this.matrix = [];
		for (let i=0; i<this.m; i++) {
			this.matrix[i] = [];
			for (let j=0; j<this.n; j++) {
				if (m[i][j] == undefined || isNaN(Number(m[i][j]))) {
					this.matrix[i][j] = 0;
				} else {
					this.matrix[i][j] = Number(m[i][j]);
				}
			}
		}
	}
	
	//constructor given by an array
	constructByArray(m) {
		//first check if entries are consistent
		let isConsistent = true;
		for (let i=0; i<m.length-1; i++) {
			if (typeof(m[i]) != typeof(m[i+1])) {
				isConsistent = false;
			}
		}
		if (isConsistent == false) {
			throw`Error: invalid declaration of matrix: inconsistent types in array object`;
			return;
		}
		//check if it's a vector or a matrix 
		if (Array.isArray(m[0]) || m[0] instanceof Float32Array) {
			//this is already a 2d array, import it
			this.constructAsMatrix(m);
		} else if (typeof Number(m[0]) == "number") {
			//this is a vector, just turn it into a 1xN matrix
			this.constructAsVector(m);
		} else if (typeof m[0] == "bigint") {
			//give a warning, but process the same as a regular vector
			console.log`WARNING: BigInts in matrix will be converted to Number primitive`;
			this.constructAsVector(m);
		} else {
			//invalid types
			throw`Error: invalid declaration of matrix: non-valid type in array object`;
			return;
		}
	}
	
	//constructor given by 2 ints, given width and height
	constructBySize(m, n) {
		if (typeof n != "number") {
			throw`Error: invalid declaration of matrix: incompatible parameters`;
			return;
		}
		this.width = this.m = m;
		this.height = this.n = n;
		this.matrix = [];
		for (let i=0; i<m; i++) {
			this.matrix[i] = [];
		}
		//initialize with zeroes
		this.setZeroes();
	}
	
	//sets every entry in the matrix to 0
	setZeroes() {
		if (this.m * this.n < 1000) {
			for (let i of this.matrix) {
				for (let j=0; j<this.n; j++) {
					i[j] = 0;
				}
			}
		} else {
			let gpu = new GPU();
			let randomize = gpu.createKernel(function () {
				return 0;
			}).setOutput([this.m,this.n]);
			this.matrix = randomize();
		}
	}
	
	//sets every entry in the matrix to a random value
	setRandom() {
		if (this.m * this.n < 1000) {
			for (let i of this.matrix) {
				for (let j=0; j<this.n; j++) {
					i[j] = Math.random();
				}
			}
		} else {
			let gpu = new GPU();
			let randomize = gpu.createKernel(function () {
				return Math.random();
			}).setOutput([this.m,this.n]);
			this.matrix = randomize();
		}
	}
	
	//multiplies this matrix by another matrix
	mult(object) {
		this.isComputing = true;
		if (object instanceof Matrix == false) {
			throw`Error: cannot multiply matrix with non-matrix object`;
			return;
		}
		if (this.m != object.n) {
			throw`Error: cannot multiply ${this.m}*${this.n} matrix with ${object.m}*${object.n} matrix`;
		}
		
		//single thread approach
		if (this.m * this.n * object.m < 1000) {
			let newMatrix = new Matrix(object.m, this.n);
			for (let i=0; i<newMatrix.m; i++) {
				for (let j=0; j<newMatrix.n; j++) {
					let sum = 0;
					for (let k=0; k<this.m; k++) {
						sum += this.matrix[k][j] * object.matrix[i][k];
					}
					newMatrix.matrix[i][j] = sum;
				}
			}
			return newMatrix;
		}
		
		//GPU approach
		if (this.m*this.n*object.m > 3000**3) {
			throw`Error: ultra large matrix multiplication currently not well-supported`
			return;
		}
		const gpu = new GPU();
		const multiply = gpu.createKernel(function(m1, m2, length) {
			let sum = 0;
			for (let i=0; i<length; i++) {
				sum += m1[this.thread.y][i] * m2[i][this.thread.y];
			}
			return sum;
		}).setOutput([this.n, object.m]);
		return new Matrix(multiply(this.matrix, object.matrix, this.m));
	}
	
	//returns a new matrix where function x has been applied to every entry of this matrix
	withFunction(x) {
		if (typeof x != "function") {
			throw`Error: cannot apply function to matrix: parameter is not a function`;
			return;
		}
		let n = x(1, 0, 0);
		if (isNaN(Number(n))) {
			throw`Error: cannot apply function to matrix: function does not return a valid number`;
			return;
		}
		if (typeof n == "bigint") {
			console.log`WARNING: function applied to matrix returns bigint, will be converted to number primitive`;
		}
		let newMatrix = new Matrix(this.m, this.n);
		for (let i=0; i<this.m; i++) {
			for (let j=0; j<this.n; j++) {
				newMatrix.matrix[i][j] = Number(x(this.matrix[i][j], i, j));
			}
		}
		return newMatrix;
	}
	
	//adds a matrix to this matrix
	add(object) {
		if (object instanceof Matrix == false) {
			throw`Error: cannot add non-matrix object to matrix`;
			return;
		}
		if (this.m != object.m || this.n != object.n) {
			throw`Error: cannot add matrices of non-equal sizes`;
			return;
		}
		if (this.m*this.n < 1000) {
			let newMatrix = new Matrix(this.m, this.n);
			for (let i=0; i<this.m; i++) {
				for (let j=0; j<this.n; j++) {
					newMatrix.matrix[i][j] = this.matrix[i][j] + object.matrix[i][j];
				}
			}
			return newMatrix;
		}
		let gpu = new GPU();
		let addMatrices = gpu.createKernel(function (m1, m2) {
			return m1[this.thread.x][this.thread.y] + m2[this.thread.x][this.thread.y];
		}).setOutput([this.m, this.n]);
		return new Matrix(addMatrices(this.matrix, object.matrix));
	}
	
	//returns a matrix that is equal to this matrix scaled by some number
	scale(n) {
		let x = Number(n);
		if (typeof x != "number") {
			throw`Error: cannot scale matrix by non-number type`;
			return;
		}
		if (this.m*this.n < 1000) {
			let newMatrix = new Matrix(this.m, this.n);
			for (let i=0; i<this.m; i++) {
				for (let j=0; j<this.n; j++) {
					newMatrix.matrix[i][j] = this.matrix[i][j] * x;
				}
			}
			return newMatrix;
		}
		let gpu = new GPU();
		let addMatrices = gpu.createKernel(function (m, x) {
			return m[this.thread.x][this.thread.y] * x;
		}).setOutput([this.m, this.n]);
		return new Matrix(addMatrices(this.matrix, x));
	}
}