class NeuralNet {
	
	constructor(stateLength, inputLength, outputLength) {
		if (typeof stateLength != "number" || typeof inputLength != "number" || typeof outputLength != "number") {
			throw(`Error: cannot create matrix with non-number vector sizes`);
			return;
		}
		this.bias = new Matrix(1,stateLength);
		this.bias_Out = new Matrix(1,outputLength);
		this.state = new Matrix(1,stateLength);
		this.weight_In = new Matrix(inputLength, stateLength);
		this.weight = new Matrix(stateLength, stateLength);
		this.weight_Out = new Matrix(stateLength, outputLength);
		this.bias.setRandom(-1,1);
		this.bias_Out.setRandom(-1,1);
		this.weight.setRandom(-1,1);
		this.weight_In.setRandom(-1,1);
		this.weight_Out.setRandom(-1,1);
		this.activation = x => Math.tanh(x);
		this.outputFunction = x => Math.tanh(x);
	}
	
	// resets the state vector
	resetState() {
		this.state.setZeroes();
	}
	
	// changes the activation function. is sigmoid by default
	changeActivation(x) {
		if (typeof x != "function") {
			throw(`Error: can't set activation function to something that isn't a function`);
			return;
		}
		if (typeof Number(x(0)) != "number") {
			throw(`Error: can't set activation function to something that doesn't return a number`);
			return;
		}
		this.activation = x;
	}
	
	
	// changes the output function
	changeOutputFunction(x) {
		if (typeof x != "function") {
			throw(`Error: can't set output function to something that isn't a function`);
			return;
		}
		if (typeof Number(x(0)) != "number") {
			throw(`Error: can't set ouput function to something that doesn't return a number`);
			return;
		}
		this.outputFunction = x;
	}
	
	// calculates the new state based on some input vector
	calculateState(input) {
		if (input instanceof Matrix == false) {
			throw(`Error: cannot take non-vector as input. Vectors must be an instance of Matrix`);
			return;
		}
		if (input.isVector() == false) {
			throw(`Error: cannot take non-vector as input`);
			return;
		}
		if (input.height != this.weight_In.width) {
			throw(`Error: input vector is of incorrect size`);
			return;
		}
		let stateCalc = this.weight.mult(this.state);
		let inputCalc = this.weight_In.mult(input);
		let vectorSum = stateCalc.add(inputCalc).add(this.bias);
		this.state = vectorSum.withFunction(this.activation);
	}
	
	// returns the output based on the current state
	getOutput() {
		return this.weight_Out.mult(this.state).add(this.bias_Out).withFunction(this.outputFunction);
	}
	
	// returns the output based on the current state, without activation function
	getOutputWOS() {
		return this.weight_Out.mult(this.state).add(this.bias_Out);
	}
	
	// returns the sum of cost values for a given desired value
	costSum(desiredValue) {
		let cost = this.getOutput().add(desiredValue.scale(-1)).withFunction(x => x ** 2);
		let sum = 0;
		for (let thing of cost.matrix[0]) {
			sum += thing;
		}
		return sum;
	}
}