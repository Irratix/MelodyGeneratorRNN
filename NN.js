class NeuralNet {
	
	constructor(stateLength, inputLength, outputLength) {
		if (typeof stateLength != "number" || typeof inputLength != "number" || typeof outputLength != "number") {
			log(`Error: cannot create matrix with non-number vector sizes`);
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
	
	//resets the state vector
	resetState() {
		this.state.setZeroes();
	}
	
	//changes the activation function. is sigmoid by default
	changeActivation(x) {
		if (typeof x != "function") {
			log(`Error: can't set activation function to something that isn't a function`);
			return;
		}
		if (typeof Number(x(0)) != "number") {
			log(`Error: can't set activation function to something that doesn't return a number`);
			return;
		}
		this.activation = x;
	}
	
	
	//changes the output function
	changeOutputFunction(x) {
		if (typeof x != "function") {
			log(`Error: can't set output function to something that isn't a function`);
			return;
		}
		if (typeof Number(x(0)) != "number") {
			log(`Error: can't set ouput function to something that doesn't return a number`);
			return;
		}
		this.outputFunction = x;
	}
	
	//calculates the new state based on some input vector
	calculateState(input) {
		if (input instanceof Matrix == false) {
			log(`Error: cannot take non-vector as input. Vectors must be an instance of Matrix`);
			return;
		}
		if (input.isVector() == false) {
			log(`Error: cannot take non-vector as input`);
			return;
		}
		if (input.height != this.weight_In.width) {
			log(`Error: input vector is of incorrect size`);
			return;
		}
		let stateCalc = this.weight.mult(this.state);
		let inputCalc = this.weight_In.mult(input);
		let vectorSum = stateCalc.add(inputCalc).add(this.bias);
		this.state = vectorSum.withFunction(this.activation);
	}
	
	//returns the output based on the current state
	getOutput() {
		return this.weight_Out.mult(this.state).add(this.bias_Out).withFunction(this.outputFunction);
	}
}