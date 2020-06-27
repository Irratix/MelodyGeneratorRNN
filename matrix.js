class Matrix {
	
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
		} else if (typeof m[0][0] != "number") {
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
		if (typeof m[0] == "number") {
			//this is a vector, just turn it into a 1xN matrix
			this.constructAsVector(m);
		} else if (Array.isArray(m[0])) {
			//this is already a 2d array, import it
			this.constructAsMatrix(m);
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
		for (let i of this.matrix) {
			for (let j=0; j<this.n; j++) {
				i[j] = 0;
			}
		}
	}
	
	//sets every entry in the matrix to a random value
	setRandom() {
		for (let i of this.matrix) {
			for (let j=0; j<this.n; j++) {
				i[j] = Math.random();
			}
		}
	}
	
	//multiplies this matrix by another matrix
	mult(object) {
		if (object instanceof Matrix == false) {
			console.log`Error: cannot multiply matrix with non-matrix object`;
			return;
		}
		if (this.m != object.n) {
			console.log`Error: cannot multiply ${this.m}*${this.n} matrix with ${object.m}*${object.n} matrix`;
		}
		//single thread approach
		/*
		let newMatrix = new Matrix(object.m, this.n);
		for (let i=0; i<newMatrix.m; i++) {
			for (let j=0; j<newMatrix.n; j++) {
				let sum = 0;
				for (let k=0; k<this.m; k++) {
					sum += this.matrix[k][j] * object.matrix[i][k];
				}
				newMatrix.matrix[i][j] = sum;
			}
		}*/
		
		//multithread approach
		let newMatrix = new Matrix(object.m, this.n+1);
		for (let i=0; i<newMatrix.m; i++) {
			newMatrix.matrix[i][newMatrix.n-1] = i;
		}
		let p = new Parallel(newMatrix.matrix, {
			env: {
				m1: this.matrix,
				m2: object.matrix
			}
		});
		p.map(function (arr) {
			let m1 = global.env.m1;
			let m2 = global.env.m2;
			index = arr[arr.length-1];
			for (let j=0; j<arr.length; j++) {
				let sum = 0;
				for (let k=0; k<m1.length; k++) {
					sum += m1[k][j] * m2[index][k];
				}
				arr[j] = sum;
			}
			return arr;
		});
		newMatrix.matrix = p.data;
		for (let i of newMatrix.matrix) {
			i = i.slice(0,i.length-1);
		}
		newMatrix.n = newMatrix.height = newMatrix.n - 1;
		return newMatrix;
	}
	
	//returns a new matrix where function x has been applied to every entry of this matrix
	withFunction(x) {
		if (typeof x != "function") {
			throw`Error: cannot apply function to matrix: parameter is not a function`;
			return;
		}
		let n = x(1);
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
				newMatrix.matrix[i][j] = Number(x(this.matrix[i][j]));
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
		let newMatrix = new Matrix(this.m, this.n);
		for (let i=0; i<this.m; i++) {
			for (let j=0; j<this.n; j++) {
				newMatrix.matrix[i][j] = this.matrix[i][j] + object.matrix[i][j];
			}
		}
		return newMatrix;
	}
	
	//returns a matrix that is equal to this matrix scaled by some number
	scale(n) {
		let x = Number(n);
		if (typeof x != "number") {
			throw`Error: cannot scale matrix by non-number type`;
			return;
		}
		let newMatrix = new Matrix(this.m, this.n);
		for (let i=0; i<this.m; i++) {
			for (let j=0; j<this.n; j++) {
				newMatrix.matrix[i][j] = this.matrix[i][j] * x;
			}
		}
		return newMatrix;
	}
}